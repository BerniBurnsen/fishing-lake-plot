import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

/** Properties every plot polygon in a lake GeoJSON must carry. */
export interface PlotProperties {
  /** Plot ("Parzelle") number as printed on the official plans. */
  parzelle: number | string
  /** Owner id; must match an `OwnerDefinition.id` of the same lake. */
  owner: string
  /** Optional free text shown in the popup. */
  note?: string
}

export type PlotFeature = Feature<Polygon | MultiPolygon, PlotProperties>
export type PlotCollection = FeatureCollection<Polygon | MultiPolygon, PlotProperties>

export interface OwnerDefinition {
  /** Stable id, used in the URL (`?owner=a,b`). Keep it URL-safe. */
  id: string
  /** Display name, e.g. the association or license holder. */
  name: string
  /** Base color used in "all owners" mode. Any CSS color. */
  color: string
}

export interface LakeDefinition {
  /** Stable id, used in the URL (`?lake=...`). */
  id: string
  name: string
  /** Initial map view. */
  center: [lat: number, lng: number]
  zoom: number
  owners: OwnerDefinition[]
  plots: PlotCollection
}

export type ColorMode = 'mine' | 'all'
