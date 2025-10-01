import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import tracks from "./data/allDocTracks.json";
import convertToLatLng from "./utils/ConvertLatLon";
import type { Feature, Point } from "geojson";
import HeatmapAddon from "./utils/TracksHeatmap";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_GL_API_KEY;

export default function MapBoxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapboxuser671/cme95gbjv003g01r920xo5juj",
        // style: "mapbox://styles/mapbox/outdoors-v12",
        // style: "mapbox://styles/mapbox/standard-satellite",

        center: [174.7762, -41.2865],
        zoom: 8.5,
        pitch: 50,
        bearing: 0,
        antialias: true,
        attributionControl: false,
      });

      setMapInstance(mapRef.current);

      new mapboxgl.Marker().setLngLat([30.5, 50.5]).addTo(mapRef.current!);

      mapRef.current.on("load", () => {
        const markerGeoJSON: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: tracks.map((track: any) => {
            const { lng, lat } = convertToLatLng(track.x, track.y);
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
              properties: {
                name: track.name,
                assetId: track.assetId,
              },
            };
          }),
        };

        mapRef.current!.addSource("marker", {
          type: "geojson",
          data: markerGeoJSON,
        });

        mapRef.current!.loadImage("/m13.png", (error, image) => {
          if (error || !image) throw error;

          if (!mapRef.current!.hasImage("custom-marker")) {
            mapRef.current!.addImage("custom-marker", image);
          }

          mapRef.current!.addLayer({
            id: "marker-point",
            type: "symbol",
            source: "marker",
            layout: {
              "icon-image": "custom-marker",
              "icon-size": 0.6,
              "icon-rotation-alignment": "viewport",
              "icon-pitch-alignment": "viewport",
              "icon-anchor": "bottom",
            },
          });
        });

        const hour = new Date().getHours();
        const skyColor = hour < 6 || hour > 18 ? "#0b1d40" : "#87ceeb";

        mapRef.current!.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-color": skyColor,
            "sky-atmosphere-sun": [180, 60],
            "sky-atmosphere-sun-intensity": hour < 6 || hour > 18 ? 2 : 15,
          },
        });

        mapRef.current!.setFog({
          range: [0.5, 3],
          "horizon-blend": 0.5,
          color: "#dce7f1",
          "high-color": "#a8c6db",
          "space-color": "#87b4c7",
        });

        mapRef.current!.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          type: "fill-extrusion",
          minzoom: 10,
          paint: {
            "fill-extrusion-color": "#ffffff",
            "fill-extrusion-opacity": 0.8,
          },
        });

        mapRef.current!.on("click", "marker-point", (e) => {
          const feature = e.features?.[0] as Feature<Point> | undefined;
          if (!feature) return;

          const coords = feature.geometry.coordinates as [number, number];
          // const props = feature.properties as { name?: string } | undefined;
          const props = feature.properties as
            | { assetId?: string; name?: string }
            | undefined;

          console.log(`Walk name: ${props?.name}`);
          console.log(`Asset ID: ${props?.assetId}`);

          document
            .querySelectorAll(".mapboxgl-popup")
            .forEach((p) => p.remove());

          new mapboxgl.Popup({ closeOnClick: true, offset: 12 })
            .setLngLat(coords)
            .setHTML(`${props?.name}`)
            .addTo(mapRef.current!);

          mapRef.current!.flyTo({ center: coords, zoom: 16, pitch: 150 });
        });
      });
    }
  }, []);

  return (
    <>
      <div
        ref={mapContainerRef}
        className="map-container w-[1000px] h-[600px]"
      />
      {mapInstance && (
        <HeatmapAddon
          map={mapInstance}
          tracks={tracks}
          layerPrefix="tracks"
          showPointsAtZoom={14}
        />
      )}
    </>
  );
}

// TODO
// check asset ID from clicked marker (JSON) and comare with AllDocTracks.TSX results from DOC API using the same Asset ID.
// DOC API data has array of track details for polyLine
// JSON just has single marker with ID and name
