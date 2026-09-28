<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ColorMode, LakeDefinition, PlotFeature } from '@/types'
import type { Position } from '@/composables/useGeolocation'
import { ownerName, plotStyle } from '@/utils/style'

const props = defineProps<{
  lake: LakeDefinition
  mode: ColorMode
  myOwnerIds: readonly string[]
  position: Position | null
  /** Plot the user is currently inside; drawn with a thicker border. */
  currentPlot: PlotFeature | null
}>()

const emit = defineEmits<{ locate: [] }>()

const mapEl = ref<HTMLDivElement | null>(null)
const map = shallowRef<L.Map | null>(null)
let plotLayer: L.GeoJSON<PlotFeature['properties']> | null = null
let positionMarker: L.CircleMarker | null = null
let accuracyCircle: L.Circle | null = null
let hasCenteredOnUser = false

onMounted(() => {
  if (!mapEl.value) return
  const m = L.map(mapEl.value, { zoomControl: true }).setView(props.lake.center, props.lake.zoom)

  // Base layers from basemap.at, the official Austrian base map (free, no key). Note the {y}/{x} order.
  const basemapAttribution = 'Datenquelle: <a href="https://basemap.at">basemap.at</a>'
  const baseLayers = {
    'basemap.at Standard': L.tileLayer(
      'https://mapsneu.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png',
      { maxZoom: 19, attribution: basemapAttribution },
    ),
    'basemap.at Orthofoto': L.tileLayer(
      'https://mapsneu.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg',
      { maxZoom: 19, attribution: basemapAttribution },
    ),
  }
  baseLayers['basemap.at Standard'].addTo(m)
  L.control.layers(baseLayers, undefined, { position: 'topleft' }).addTo(m)

  addLocateControl(m)
  map.value = m
  renderPlots()
})

onBeforeUnmount(() => map.value?.remove())

function addLocateControl(m: L.Map) {
  const Locate = L.Control.extend({
    onAdd() {
      const btn = L.DomUtil.create('a', 'leaflet-bar leaflet-control locate-btn')
      btn.href = '#'
      btn.title = 'Meinen Standort anzeigen'
      btn.textContent = '◎'
      L.DomEvent.on(btn, 'click', (e) => {
        L.DomEvent.preventDefault(e)
        hasCenteredOnUser = false
        emit('locate')
        if (props.position) m.setView([props.position.lat, props.position.lng], Math.max(m.getZoom(), 16))
      })
      return btn
    },
  })
  new Locate({ position: 'topleft' }).addTo(m)
}

function renderPlots() {
  const m = map.value
  if (!m) return
  plotLayer?.remove()
  plotLayer = L.geoJSON<PlotFeature['properties']>(props.lake.plots, {
    style: (f) => plotStyle(f as PlotFeature, props.lake, props.mode, props.myOwnerIds, isCurrent(f as PlotFeature)),
    onEachFeature: (f, layer) => {
      const plot = f as PlotFeature
      layer.bindPopup(() => popupHtml(plot))
    },
  }).addTo(m)
}

function isCurrent(plot: PlotFeature): boolean {
  return !!props.currentPlot && props.currentPlot.properties.plotnumber === plot.properties.plotnumber
}

function restyle() {
  plotLayer?.eachLayer((layer) => {
    const f = (layer as L.Path & { feature?: PlotFeature }).feature
    if (f) (layer as L.Path).setStyle(plotStyle(f, props.lake, props.mode, props.myOwnerIds, isCurrent(f)))
  })
}

function popupHtml(plot: PlotFeature): string {
  const fishable = props.myOwnerIds.includes(plot.properties.owner)
  const status = props.myOwnerIds.length
    ? fishable
      ? '<span style="color:#2e7d32">✔ Fischen erlaubt</span>'
      : '<span style="color:#c62828">✖ Keine Lizenz</span>'
    : '<em>Keine Lizenz ausgewählt</em>'
  return `<strong>Parzelle ${esc(String(plot.properties.plotnumber))}</strong><br>` +
    `${esc(ownerName(props.lake, plot.properties.owner))}<br>${status}` +
    (plot.properties.note ? `<br><small>${esc(plot.properties.note)}</small>` : '')
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function renderPosition() {
  const m = map.value
  if (!m) return
  const p = props.position
  if (!p) {
    positionMarker?.remove()
    accuracyCircle?.remove()
    positionMarker = accuracyCircle = null
    return
  }
  const latlng: L.LatLngExpression = [p.lat, p.lng]
  if (!positionMarker) {
    accuracyCircle = L.circle(latlng, { radius: p.accuracy, color: '#1976d2', weight: 1, fillOpacity: 0.1 }).addTo(m)
    positionMarker = L.circleMarker(latlng, { radius: 7, color: '#fff', weight: 2, fillColor: '#1976d2', fillOpacity: 1 }).addTo(m)
  } else {
    positionMarker.setLatLng(latlng)
    accuracyCircle?.setLatLng(latlng).setRadius(p.accuracy)
  }
  if (!hasCenteredOnUser) {
    hasCenteredOnUser = true
    m.setView(latlng, Math.max(m.getZoom(), 16))
  }
}

watch(() => props.lake, (lake) => {
  map.value?.setView(lake.center, lake.zoom)
  renderPlots()
})
watch([() => props.mode, () => props.myOwnerIds, () => props.currentPlot], restyle)
watch(() => props.position, renderPosition)
</script>

<template>
  <div ref="mapEl" class="map" />
</template>

<style scoped>
.map {
  position: absolute;
  inset: 0;
}
</style>

<style>
.locate-btn {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  background: #fff;
  color: #000;
  text-decoration: none;
}
</style>
