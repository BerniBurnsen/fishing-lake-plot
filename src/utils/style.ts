import type { PathOptions } from 'leaflet'
import type { ColorMode, LakeDefinition, PlotFeature } from '@/types'

export const COLOR_FISHABLE = '#2e7d32'
export const COLOR_FORBIDDEN = '#9e9e9e'
export const COLOR_UNKNOWN_OWNER = '#d32f2f'

export function ownerColor(lake: LakeDefinition, ownerId: string): string {
  return lake.owners.find((o) => o.id === ownerId)?.color ?? COLOR_UNKNOWN_OWNER
}

export function ownerName(lake: LakeDefinition, ownerId: string): string {
  return lake.owners.find((o) => o.id === ownerId)?.name ?? `Unbekannt (${ownerId})`
}

export function isFishable(plot: PlotFeature, myOwnerIds: readonly string[]): boolean {
  return myOwnerIds.includes(plot.properties.owner)
}

export function plotStyle(
  plot: PlotFeature,
  lake: LakeDefinition,
  mode: ColorMode,
  myOwnerIds: readonly string[],
  highlighted = false,
): PathOptions {
  const mine = isFishable(plot, myOwnerIds)
  const base: PathOptions = {
    weight: highlighted ? 4 : mine && mode === 'all' ? 3 : 1.5,
    opacity: 0.9,
    fillOpacity: highlighted ? 0.6 : 0.4,
  }

  if (mode === 'mine') {
    const color = mine ? COLOR_FISHABLE : COLOR_FORBIDDEN
    return { ...base, color, fillColor: color, fillOpacity: mine ? base.fillOpacity : 0.2 }
  }

  const color = ownerColor(lake, plot.properties.owner)
  return { ...base, color: mine ? '#000' : color, fillColor: color }
}
