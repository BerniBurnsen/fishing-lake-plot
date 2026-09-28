import type { LakeDefinition, PlotCollection } from '@/types'
import plots from './plots.json'

export const ossiacherSee: LakeDefinition = {
  id: 'ossiacher-see',
  name: 'Ossiacher See',
  center: [46.655, 13.915],
  zoom: 15,
  // Placeholder owners for the test polygons. Replace with the real license holders.
  owners: [
    { id: 'fischereiverein-ossiach', name: 'Fischereiverein Ossiach', color: '#1f77b4' },
    { id: 'revier-nord', name: 'Revier Nordufer', color: '#ff7f0e' },
    { id: 'privat-mueller', name: 'Privatrevier Müller', color: '#9467bd' },
  ],
  plots: plots as PlotCollection,
}
