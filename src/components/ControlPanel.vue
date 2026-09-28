<script setup lang="ts">
import type { ColorMode, LakeDefinition } from '@/types'
import { lakes } from '@/lakes'
import { COLOR_FISHABLE, COLOR_FORBIDDEN } from '@/utils/style'

const props = defineProps<{
  lake: LakeDefinition
  mode: ColorMode
  ownerIds: string[]
}>()

const emit = defineEmits<{
  'update:lakeId': [id: string]
  'update:mode': [mode: ColorMode]
  toggleOwner: [id: string]
}>()

function isMine(id: string) {
  return props.ownerIds.includes(id)
}
</script>

<template>
  <aside class="panel">
    <label v-if="lakes.length > 1" class="row">
      <span>See</span>
      <select :value="lake.id" @change="emit('update:lakeId', ($event.target as HTMLSelectElement).value)">
        <option v-for="l in lakes" :key="l.id" :value="l.id">{{ l.name }}</option>
      </select>
    </label>
    <h1 v-else class="title">{{ lake.name }}</h1>

    <fieldset class="group">
      <legend>Meine Lizenzen</legend>
      <label v-for="o in lake.owners" :key="o.id" class="owner">
        <input type="checkbox" :checked="isMine(o.id)" @change="emit('toggleOwner', o.id)" />
        <span class="swatch" :style="{ background: mode === 'all' ? o.color : isMine(o.id) ? COLOR_FISHABLE : COLOR_FORBIDDEN }" />
        {{ o.name }}
      </label>
    </fieldset>

    <div class="modes">
      <button :class="{ active: mode === 'mine' }" @click="emit('update:mode', 'mine')">Meine Plätze</button>
      <button :class="{ active: mode === 'all' }" @click="emit('update:mode', 'all')">Alle Besitzer</button>
    </div>
  </aside>
</template>

<style scoped>
.panel {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  color: #222;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  padding: 10px 12px;
  width: min(280px, calc(100vw - 20px));
  font-size: 14px;
}
.title {
  margin: 0 0 8px;
  font-size: 16px;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.group {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 8px;
  margin: 0 0 8px;
}
.owner {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
  cursor: pointer;
}
.swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.3);
}
.modes {
  display: flex;
}
.modes button {
  flex: 1;
  padding: 6px;
  border: 1px solid #bbb;
  background: #f5f5f5;
  cursor: pointer;
}
.modes button:first-child {
  border-radius: 6px 0 0 6px;
}
.modes button:last-child {
  border-radius: 0 6px 6px 0;
  border-left: none;
}
.modes button.active {
  background: #1976d2;
  color: #fff;
  border-color: #1976d2;
}
</style>
