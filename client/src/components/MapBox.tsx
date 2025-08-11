// BASIC WORKING EXAMPLE WITH TOPO LINES AND 3D TERRAIN AND BUILDINGS - FROM GLOBE
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_GL_API_KEY;

export default function MapBoxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [174.7762, -41.2865],
        zoom: 9,
        pitch: 60,
        bearing: -20,
        antialias: true,
      });

      mapRef.current.on("load", () => {
        mapRef.current!.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.terrain-rgb",
        });

        mapRef.current!.addSource("marker", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: [174.7762, -41.2865],
                },
              },
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: [174.9762, -41.5865],
                },
              },
            ],
          },
        });

        mapRef.current!.loadImage("/m2.png", (error, image) => {
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
              "icon-size": 0.13,
            },
          });
        });

        mapRef.current!.setTerrain({ source: "mapbox-dem", exaggeration: 1 });

        mapRef.current?.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0, -5],
            "sky-atmosphere-sun-intensity": 3,
          },
        });

        mapRef.current!.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.6,
          },
        });
      });
    }
  }, []);

  return (
    <div ref={mapContainerRef} className="map-container w-full h-[400px]" />
  );
}
