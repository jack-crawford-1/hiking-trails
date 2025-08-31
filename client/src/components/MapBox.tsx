import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import myTrackData from "../../public/allDocTracks.json";
import convertToLatLng from "./ConvertLatLon";
import type { Feature, Point } from "geojson";
import HeatmapAddon from "./TracksHeatmap";
import tracks from "../../public/allDocTracks.json";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_GL_API_KEY;

export default function MapBoxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);

  async function getIssGeoJSON(): Promise<GeoJSON.FeatureCollection> {
    const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
    const { latitude, longitude } = await res.json();
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          properties: {},
        },
      ],
    };
  }

  useEffect(() => {
    let issInterval: NodeJS.Timeout;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        // style: "mapbox://styles/mapbox/outdoors-v12",
        // style: "mapbox://styles/mapbox/standard-satellite",
        style: "mapbox://styles/mapboxuser671/cme95gbjv003g01r920xo5juj",
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
        // (mapRef.current as any).addSource("raster-array-source", {
        //   type: "raster-array",
        //   url: "mapbox://rasterarrayexamples.gfs-winds",
        //   tileSize: 512,
        // });

        // (mapRef.current as any).addLayer({
        //   id: "wind-layer",
        //   type: "raster-particle",
        //   source: "raster-array-source",
        //   "source-layer": "10winds",
        //   paint: {
        //     "raster-particle-speed-factor": 0.4,
        //     "raster-particle-fade-opacity-factor": 0.9,
        //     "raster-particle-reset-rate-factor": 0.4,
        //     "raster-particle-count": 4000,
        //     "raster-particle-max-speed": 40,
        //     "raster-particle-color": [
        //       "interpolate",
        //       ["linear"],
        //       ["raster-particle-speed"],
        //       1.5,
        //       "rgba(255,255,255,1)",
        //       69.44,
        //       "rgba(0,0,0,1)",
        //     ],
        //   },
        // });

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
          const props = feature.properties as { name?: string } | undefined;

          document
            .querySelectorAll(".mapboxgl-popup")
            .forEach((p) => p.remove());

          new mapboxgl.Popup({ closeOnClick: true, offset: 12 })
            .setLngLat(coords)
            .setHTML(`${props?.name}`)
            .addTo(mapRef.current!);

          mapRef.current!.flyTo({ center: coords, zoom: 16, pitch: 150 });
        });

        mapRef.current!.loadImage("/iss.png", async (error, image) => {
          if (error || !image) throw error;

          mapRef.current!.addImage("iss-icon", image);

          const initialGeoJSON = await getIssGeoJSON();

          mapRef.current!.addSource("iss", {
            type: "geojson",
            data: initialGeoJSON,
          });

          mapRef.current!.addLayer({
            id: "iss-layer",
            type: "symbol",
            source: "iss",
            layout: {
              "icon-image": "iss-icon",
              "icon-size": 0.12,
              "icon-anchor": "bottom",
            },
          });

          issInterval = setInterval(async () => {
            const updatedGeoJSON = await getIssGeoJSON();
            const source = mapRef.current!.getSource(
              "iss"
            ) as mapboxgl.GeoJSONSource;
            source.setData(updatedGeoJSON);
          }, 2000);
        });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      clearInterval(issInterval);
    };
  }, []);

  return (
    <>
      <div
        ref={mapContainerRef}
        className="map-container w-[1200px] h-[600px]"
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
