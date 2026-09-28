import type { MultiPolygon, Polygon, Position } from 'geojson'
import type { PlotFeature } from '@/types'

/** Ray-casting point-in-ring test. `point` and ring coords are [lng, lat]. */
function pointInRing(point: Position, ring: Position[]): boolean {
  const [x, y] = point as [number, number]
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i] as [number, number]
    const [xj, yj] = ring[j] as [number, number]
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

/** Inside outer ring and outside all holes. */
function pointInPolygonRings(point: Position, rings: Position[][]): boolean {
  const [outer, ...holes] = rings
  if (!outer || !pointInRing(point, outer)) return false
  return !holes.some((hole) => pointInRing(point, hole))
}

export function pointInGeometry(lat: number, lng: number, geometry: Polygon | MultiPolygon): boolean {
  const point: Position = [lng, lat]
  if (geometry.type === 'Polygon') return pointInPolygonRings(point, geometry.coordinates)
  return geometry.coordinates.some((rings) => pointInPolygonRings(point, rings))
}

/** First plot containing the given position, or null. */
export function findPlotAt(lat: number, lng: number, plots: PlotFeature[]): PlotFeature | null {
  return plots.find((p) => pointInGeometry(lat, lng, p.geometry)) ?? null
}
