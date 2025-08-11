import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import myTrackData from "../../public/allDocTracks.json";
import convertToLatLng from "./ConvertLatLon";
import type { Feature, Point } from "geojson";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_GL_API_KEY;

export default function MapBoxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  function zoomBasedReveal(targetValue: number): mapboxgl.Expression {
    return ["interpolate", ["linear"], ["zoom"], 5, 0, 12, targetValue];
  }

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
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [174.7762, -41.2865],
        zoom: 5.5,
        pitch: 60,
        bearing: 0,
        antialias: true,
        attributionControl: false,
      });

      mapRef.current.on("load", () => {
        mapRef.current!.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.terrain-rgb",
        });
        mapRef.current!.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

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

        type PaintProp = Parameters<mapboxgl.Map["setPaintProperty"]>[1];

        function setPaint(id: string, prop: PaintProp, value: any) {
          if (mapRef.current?.getLayer(id))
            mapRef.current.setPaintProperty(id, prop, value);
        }

        function applyTopoPalette() {
          const colors = {
            land: "#efe6d1",
            landuse: "#91b48b",
            veg: "#81b48b",
            water: "#cfe6f7",
            waterLine: "#9fcae6",
          };

          setPaint("land", "background-color", colors.land);
          setPaint("landcover", "fill-color", colors.veg);
          setPaint("landuse", "fill-color", colors.landuse);
          setPaint("water", "fill-color", colors.water);
          setPaint("waterway", "line-color", colors.waterLine);
          setPaint("water-shadow", "fill-color", colors.water);
          setPaint("waterway-shadow", "line-color", colors.waterLine);
        }

        applyTopoPalette();

        mapRef.current!.addSource("marker", {
          type: "geojson",
          data: markerGeoJSON,
        });

        mapRef.current!.loadImage("/m8.png", (error, image) => {
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

        mapRef.current!.setRain({
          density: zoomBasedReveal(1),
          intensity: 0.4,
          color: "#a8adbc",
          opacity: 0.7,
          "vignette-color": "#464646",
          direction: [0, 80],
          "droplet-size": [1.6, 4.2],
          "distortion-strength": 0.7,
          "center-thinning": 0,
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

          mapRef.current!.flyTo({ center: coords, zoom: 15 });
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
    <div ref={mapContainerRef} className="map-container w-full h-[600px]" />
  );
}
