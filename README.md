# austria-fishing-plot

Frontend-only Vue 3 + TypeScript + Leaflet app that shows the fishing plots ("Parzellen") of Austrian
lakes on OpenStreetMap, colors them according to the licenses you own, and tells you which plot you are
currently in via geolocation.

## Run

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
```

Geolocation only works on `localhost` or over HTTPS. To test on a phone, serve the `dist/` folder over HTTPS
or use `vite --host` together with a tunnel.

## URL state

Everything is in the query string, so a view can be bookmarked or shared:

```
?lake=ossiacher-see&owner=verein-ossiach,revier-nord&mode=mine
```

| Param   | Values                                   | Default          |
|---------|------------------------------------------|------------------|
| `lake`  | a lake id from `src/lakes/index.ts`      | first lake       |
| `owner` | comma-separated owner ids you hold a license for | none     |
| `mode`  | `mine` (green = fishable, grey = not) or `all` (one color per owner, yours with black border) | `mine` |

Checkboxes and the mode toggle in the panel update the URL live.

## Adding a lake

1. Create `src/lakes/<lake-id>/plots.json` – a GeoJSON `FeatureCollection` of `Polygon`/`MultiPolygon`
   features. Every feature needs `properties.parzelle` (number or string) and `properties.owner`
   (an owner id). Optional `properties.note` is shown in the popup.
2. Create `src/lakes/<lake-id>/index.ts` exporting a `LakeDefinition` (id, name, center, zoom, owners
   with id/name/color, plots).
3. Register it in `src/lakes/index.ts`. A lake selector appears automatically once there is more than one.

The types live in `src/types.ts`.

## Ossiacher See test data

The four polygons in `src/lakes/ossiacher-see/plots.json` are test data. Only plot 44 has a real number,
the others are named `TEST-2..4`, and the three owners are placeholders. Replace them with the real
license holders.
