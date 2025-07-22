import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { fetchDocTracks } from "../api/fetchDoc";
import convertToLatLng from "./ConvertLatLon";
import { LocationPinSvg } from "./LocationPinSvg";

export function ClusteredMarkers({
  onMarkerClick,
}: {
  onMarkerClick: (track: any) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let markers: google.maps.marker.AdvancedMarkerElement[] = [];

    async function setupMarkers() {
      const tracks = await fetchDocTracks();
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
      const { MarkerClusterer } = await import("@googlemaps/markerclusterer");

      markers = tracks.map((track: { x: number; y: number }) => {
        const { lat, lng } = convertToLatLng(track.x, track.y);

        const markerContent = document.createElement("div");
        markerContent.innerHTML = `
          <div style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
            ${LocationPinSvg}
          </div>
        `;

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat, lng },
          content: markerContent,
        });

        marker.addListener("click", () => {
          console.log("Marker clicked for track:", track);
          onMarkerClick(track);
        });

        return marker;
      });

      new MarkerClusterer({
        map,
        markers,
        renderer: {
          render: ({ count, position }) => {
            const size = Math.min(50, 30 + count * 1.5);

            const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#14853d" stroke="#ffffff" stroke-width="1" />
        <text x="20" y="25" text-anchor="middle" font-size="14" fill="#ffffff">${count}</text>
      </svg>
    `;

            const div = document.createElement("div");
            div.innerHTML = svg;

            return new AdvancedMarkerElement({
              position,
              content: div,
            });
          },
        },
      });
    }

    setupMarkers();

    return () => {
      markers.forEach((marker) => (marker.map = null));
    };
  }, [map, onMarkerClick]);

  return null;
}
