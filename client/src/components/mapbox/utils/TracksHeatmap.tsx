import { useEffect } from "react";
import type { Map as MapboxMap, GeoJSONSource } from "mapbox-gl";
import proj4 from "proj4";

proj4.defs(
  "EPSG:2193",
  "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +units=m +no_defs"
);

type Track = {
  assetId?: string;
  name?: string;
  x?: number;
  y?: number;
  line?: number[][] | number[][][];
};

type Props = {
  map: MapboxMap;
  tracks: Track[];
  layerPrefix?: string;
  beforeId?: string;
  showPointsAtZoom?: number;
};

type PointProps = { name: string; assetId: string; weight: number };
type FCPoint = GeoJSON.FeatureCollection<GeoJSON.Point, PointProps>;

export default function HeatmapAddon({
  map,
  tracks,
  layerPrefix = "tracks",
  beforeId,
  showPointsAtZoom = 20,
}: Props) {
  useEffect(() => {
    const sourceId = `${layerPrefix}-points`;
    const heatId = `${layerPrefix}-heat`;

    function toLonLat(xy: [number, number]): [number, number] {
      return proj4("EPSG:2193", "WGS84", xy) as [number, number];
    }

    function representativeLonLat(t: Track): [number, number] | null {
      const ln = t.line;
      if (Array.isArray(ln) && ln.length > 0) {
        const isMulti = Array.isArray(ln[0][0]);
        const coords = isMulti
          ? (ln as number[][][]).flat()
          : (ln as number[][]);
        const mid = coords[Math.floor(coords.length / 2)];
        if (Array.isArray(mid) && mid.length >= 2)
          return toLonLat([mid[0], mid[1]]);
      }
      if (typeof t.x === "number" && typeof t.y === "number") {
        return toLonLat([t.x, t.y]);
      }
      return null;
    }

    function mount() {
      const counts = new Map<string, number>();
      const sample = new Map<string, { name: string; assetId: string }>();

      for (const t of tracks) {
        const ll = representativeLonLat(t);
        if (!ll) continue;
        const key = `${ll[0].toFixed(6)},${ll[1].toFixed(6)}`;
        counts.set(key, (counts.get(key) || 0) + 1);
        if (!sample.has(key)) {
          sample.set(key, {
            name: t.name || "Track",
            assetId: t.assetId || "",
          });
        }
      }

      const features: GeoJSON.Feature<GeoJSON.Point, PointProps>[] = [];
      for (const [key, weight] of counts.entries()) {
        const parts = key.split(",");
        const lon = Number(parts[0]);
        const lat = Number(parts[1]);
        const props = sample.get(key)!;
        features.push({
          type: "Feature",
          properties: { ...props, weight },
          geometry: { type: "Point", coordinates: [lon, lat] },
        });
      }

      const fc: FCPoint = { type: "FeatureCollection", features };

      const existing = map.getSource(sourceId) as GeoJSONSource | undefined;
      if (!existing) {
        map.addSource(sourceId, { type: "geojson", data: fc });
      } else {
        existing.setData(fc);
      }

      const insertBefore =
        beforeId && map.getLayer(beforeId) ? beforeId : undefined;

      if (!map.getLayer(heatId)) {
        map.addLayer(
          {
            id: heatId,
            type: "heatmap",
            source: sourceId,
            paint: {
              "heatmap-weight": [
                "coalesce",
                ["to-number", ["get", "weight"]],
                1,
              ],
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5,
                0.6,
                12,
                2.0,
              ],
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0.0,
                "rgba(0,0,0,0)",
                0.15,
                "#FFE5E5",
                0.3,
                "#FF9999",
                0.45,
                "#FF4D4D",
                0.6,
                "#E60000",
                0.75,
                "#CC0000",
                0.9,
                "#990000",
                1.0,
                "#660000",
              ],
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5,
                8,
                12,
                28,
              ],
              "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                showPointsAtZoom - 1,
                1,
                showPointsAtZoom,
                0,
              ],
            },
          },
          insertBefore
        );
      }
    }

    if (map.loaded()) {
      mount();
    } else {
      const onLoad = () => {
        map.off("load", onLoad);
        mount();
      };
      map.on("load", onLoad);
    }

    return () => {
      if (map.getLayer(`${layerPrefix}-heat`))
        map.removeLayer(`${layerPrefix}-heat`);
      if (map.getSource(`${layerPrefix}-points`))
        map.removeSource(`${layerPrefix}-points`);
    };
  }, [map, tracks, layerPrefix, beforeId, showPointsAtZoom]);

  return null;
}
