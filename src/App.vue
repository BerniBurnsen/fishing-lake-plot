<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import FishingMap from './components/FishingMap.vue'
import ControlPanel from './components/ControlPanel.vue'
import CurrentPlotBanner from './components/CurrentPlotBanner.vue'
import InfoOverlay from './components/InfoOverlay.vue'
import { useUrlState } from './composables/useUrlState'
import { useGeolocation } from './composables/useGeolocation'
import { findPlotAt } from './utils/geo'

const DISCLAIMER_KEY = 'disclaimerAccepted'

const { lakeId, lake, ownerIds, mode, toggleOwner } = useUrlState()
const geo = useGeolocation()

const currentPlot = computed(() => {
  const p = geo.position.value
  return p ? findPlotAt(p.lat, p.lng, lake.value.plots.features) : null
})

const firstVisit = ref(readFlag() !== '1')
const showInfo = ref(firstVisit.value)

function openInfo() {
  firstVisit.value = false
  showInfo.value = true
}

function closeInfo() {
  if (firstVisit.value) {
    writeFlag()
    firstVisit.value = false
  }
  showInfo.value = false
}

// localStorage may be unavailable (private mode, blocked storage); never let that break the app.
function readFlag(): string | null {
  try {
    return localStorage.getItem(DISCLAIMER_KEY)
  } catch {
    return null
  }
}
function writeFlag() {
  try {
    localStorage.setItem(DISCLAIMER_KEY, '1')
  } catch {
    /* ignore */
  }
}

onMounted(geo.start)
</script>

<template>
  <div class="app">
    <FishingMap
      :lake="lake"
      :mode="mode"
      :my-owner-ids="ownerIds"
      :position="geo.position.value"
      :current-plot="currentPlot"
      @locate="geo.start"
    />
    <ControlPanel
      :lake="lake"
      :mode="mode"
      :owner-ids="ownerIds"
      @update:lake-id="lakeId = $event"
      @update:mode="mode = $event"
      @toggle-owner="toggleOwner"
      @info="openInfo"
    />
    <CurrentPlotBanner
      :lake="lake"
      :plot="currentPlot"
      :position="geo.position.value"
      :error="geo.error.value"
      :my-owner-ids="ownerIds"
    />
    <InfoOverlay v-if="showInfo" :first-visit="firstVisit" @close="closeInfo" />
  </div>
</template>

<style scoped>
.app {
  position: fixed;
  inset: 0;
}
</style>
