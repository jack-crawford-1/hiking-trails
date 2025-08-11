import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import myTrackData from "../../public/allDocTracks.json";
import convertToLatLng from "./ConvertLatLon";

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
        zoom: 4.5,
      });

      mapRef.current.on("load", () => {
        mapRef.current!.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.terrain-rgb",
        });

        // Convert x/y to lat/lng
        const markerGeoJSON: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: myTrackData.map((track: any) => {
            const { lng, lat } = convertToLatLng(track.x, track.y);
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
              properties: {
                name: track.name,
              },
            };
          }),
        };

        mapRef.current!.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
        mapRef.current!.addSource("marker", {
          type: "geojson",
          data: markerGeoJSON,
        });

        mapRef.current!.loadImage("/m7.png", (error, image) => {
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
              "icon-size": 0.09,
            },
          });
        });

        mapRef.current?.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0, 10],
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

        // SNOW
        // mapRef.current!.setSnow({
        // density: zoomBasedReveal(0.85),
        // intensity: 1.0,
        // "center-thinning": 0.1,
        // direction: [0, 50],
        // opacity: 1.0,
        // color: `#ffffff`,
        // "flake-size": 0.71,
        // vignette: zoomBasedReveal(0.3),
        // "vignette-color": `#ffffff`,
        // });

        // RAIN
        // mapRef.current!.setRain({
        // density: zoomBasedReveal(0.5),
        // intensity: 1.0,
        // color: "#a8adbc",
        // opacity: 0.7,
        // vignette: zoomBasedReveal(1.0),
        // "vignette-color": "#464646",
        // direction: [0, 80],
        // "droplet-size": [2.6, 18.2],
        // "distortion-strength": 0.7,
        // "center-thinning": 0,
        // });

        // DAY FOG
        // mapRef.current!.setFog({
        // range: [-1, 2],
        // "horizon-blend": 0.3,
        // color: "white",
        // "high-color": "#add8e6",
        // "space-color": "#d8f2ff",
        // "star-intensity": 0.0,
        // });

        // NIGHT FOG
        // mapRef.current!.setFog({
        // range: [-1, 2],
        // "horizon-blend": 0.3,
        // color: "#242B4B",
        // "high-color": "#161B36",
        // "space-color": "#0B1026",
        // "star-intensity": 0.8,
        // });
      });
    }
  }, []);

  return (
    <div ref={mapContainerRef} className="map-container w-full h-[600px]" />
  );
}
