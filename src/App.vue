<script setup lang="ts">
import { computed, onMounted } from 'vue'
import FishingMap from './components/FishingMap.vue'
import ControlPanel from './components/ControlPanel.vue'
import CurrentPlotBanner from './components/CurrentPlotBanner.vue'
import { useUrlState } from './composables/useUrlState'
import { useGeolocation } from './composables/useGeolocation'
import { findPlotAt } from './utils/geo'

const { lakeId, lake, ownerIds, validOwnerIds, mode, toggleOwner } = useUrlState()
const geo = useGeolocation()

const currentPlot = computed(() => {
  const p = geo.position.value
  return p ? findPlotAt(p.lat, p.lng, lake.value.plots.features) : null
})

onMounted(geo.start)
</script>

<template>
  <div class="app">
    <FishingMap
      :lake="lake"
      :mode="mode"
      :my-owner-ids="validOwnerIds"
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
    />
    <CurrentPlotBanner
      :lake="lake"
      :plot="currentPlot"
      :position="geo.position.value"
      :error="geo.error.value"
      :my-owner-ids="validOwnerIds"
    />
  </div>
</template>

<style scoped>
.app {
  position: fixed;
  inset: 0;
}
</style>
