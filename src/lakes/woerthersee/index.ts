import type { LakeDefinition, PlotCollection } from '@/types'
import plots from './plots.json'

export const woerthersee: LakeDefinition = {
  id: 'woerthersee',
  name: 'Wörthersee',
  // Centered on the test plots at the east end near Klagenfurt for now.
  center: [46.613, 14.052],
  zoom: 15,
  // Placeholder owner for the test polygons. Replace with the real license holders.
  owners: [{ id: 'test-123', name: 'Testrevier 123', color: '#2ca02c' }],
  plots: plots as PlotCollection,
}
