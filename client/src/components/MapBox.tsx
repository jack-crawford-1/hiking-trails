// MAPBOX Example code to render a map
// https://docs.mapbox.com/mapbox-gl-js/guides/install/

// mapboxgl.accessToken = '<your access token here>';
// const map = new mapboxgl.Map({
//   container: 'map', // container ID
//   style: 'mapbox://styles/mapbox/streets-v12', // style URL
//   center: [-74.5, 40], // starting position [lng, lat]
//   zoom: 9 // starting zoom
// });

// BASIC WORKING EXAMPLE WITH TOPO LINES - FROM GLOBE
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
    }
  }, []);

  return (
    <div ref={mapContainerRef} className="map-container w-full h-[400px]" />
  );
}
