<script setup lang="ts">
import { computed } from 'vue'
import type { LakeDefinition, PlotFeature } from '@/types'
import type { Position } from '@/composables/useGeolocation'
import { ownerName } from '@/utils/style'

const props = defineProps<{
  lake: LakeDefinition
  plot: PlotFeature | null
  position: Position | null
  error: string | null
  myOwnerIds: readonly string[]
}>()

const state = computed<'error' | 'waiting' | 'outside' | 'ok' | 'forbidden' | 'nolicense'>(() => {
  if (props.error) return 'error'
  if (!props.position) return 'waiting'
  if (!props.plot) return 'outside'
  if (!props.myOwnerIds.length) return 'nolicense'
  return props.myOwnerIds.includes(props.plot.properties.owner) ? 'ok' : 'forbidden'
})
</script>

<template>
  <div class="banner" :class="state">
    <template v-if="state === 'error'">{{ error }}</template>
    <template v-else-if="state === 'waiting'">Standort wird ermittelt…</template>
    <template v-else-if="state === 'outside'">Du befindest dich in keiner bekannten Parzelle.</template>
    <template v-else>
      <strong>Parzelle {{ plot!.properties.plotnumber }}</strong>
      · {{ ownerName(lake, plot!.properties.owner) }}
      <span v-if="state === 'ok'"> · ✔ Fischen erlaubt</span>
      <span v-else-if="state === 'forbidden'"> · ✖ Keine Lizenz</span>
      <span v-else> · keine Lizenz ausgewählt</span>
    </template>
    <small v-if="position" class="acc">±{{ Math.round(position.accuracy) }} m</small>
  </div>
</template>

<style scoped>
.banner {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 1000;
  padding: 10px 14px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  background: #eceff1;
  color: #222;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}
.banner.ok {
  background: #c8e6c9;
}
.banner.forbidden {
  background: #ffcdd2;
}
.banner.error {
  background: #fff3e0;
}
.acc {
  opacity: 0.7;
  white-space: nowrap;
}
</style>
