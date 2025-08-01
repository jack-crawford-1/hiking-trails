import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import SlidingDrawer from "./SlidingDrawer";
import { fetchDocTracks } from "../api/fetchDoc";
import convertToLatLng from "./ConvertLatLon";

const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY;

// Swapping from Google Maps to MapLibre to try using 3D terrain with raster tiles (LINZ basemap + raster-dem) instead of vector basemaps.

export default function MapLibreGlLinz() {
  const mapRef = useRef(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          linz: {
            type: "raster",
            tiles: [
              `https://basemaps.linz.govt.nz/v1/tiles/topo-raster/WebMercatorQuad/{z}/{x}/{y}.webp?api=${LINZ_API_KEY}`,
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "linz",
            type: "raster",
            source: "linz",
          },
        ],
      },
      center: [175.4326057, -40.8775692],
      zoom: 9,
      pitch: 160,
      bearing: -8.8,
    });

    mapInstance.current = map;

    map.on("load", async () => {
      map.addSource("terrain", {
        type: "raster-dem",
        url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
        tileSize: 256,
      });

      map.setTerrain({ source: "terrain", exaggeration: 1.5 });

      const tracks = await fetchDocTracks();
      const features = tracks.map((track: any, i: number) => {
        const { lat, lng } = convertToLatLng(track.x, track.y);
        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: [lng, lat] },
          properties: { id: i, ...track },
        };
      });

      map.addSource("trackMarkers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });

      map.addLayer({
        id: "trackMarkers",
        type: "circle",
        source: "trackMarkers",
        paint: {
          "circle-radius": 16,
          "circle-color": "#e63946",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.on("click", "trackMarkers", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties;
        const clickedTrack = tracks[props?.id];
        setSelectedTrack(clickedTrack);
        setDrawerOpen(true);

        if (clickedTrack?.line) {
          map.addSource("trackLine", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: clickedTrack.line,
              },
            },
          });

          map.addLayer({
            id: "trackLine",
            type: "line",
            source: "trackLine",
            paint: {
              "line-color": "#0074D9",
              "line-width": 4,
            },
          });
        }
      });

      map.on("mouseenter", "trackMarkers", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "trackMarkers", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: "98vw", height: "98vh" }} />
      <SlidingDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        track={selectedTrack}
      />
    </>
  );
}
