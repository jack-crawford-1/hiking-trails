// to add in index.html

//  <!-- <script
//       src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCzZ49ZFaYrgOpA_L0e07U7V3An6QDqm8c&libraries=maps3d&v=beta"
//       defer
//     ></script>
//     <script
//       src="https://www.gstatic.com/maps/map.v3/gmap3d-map-renderer.js"
//       defer
//     ></script> -->

// Using the new Google Maps <gmp-map-3d> web component to display 3D terrain in hybrid mode, replacing traditional Google Maps JS API with native 3D tile rendering.

import { useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { fetchDocTracks } from "../api/fetchDoc";
import convertToLatLng from "./ConvertLatLon";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function MainMap() {
  useEffect(() => {
    async function initMap() {
      const container = document.getElementById("map-3d");
      if (!container) return;

      container.innerHTML = "";

      const el = document.createElement("gmp-map-3d");
      el.setAttribute("style", "width: 100vw; height: 90vh;");
      el.setAttribute("center", "-40.94992,175");
      el.setAttribute("zoom", "7");
      el.setAttribute("tilt", "67.5");
      el.setAttribute("heading", "45");
      el.setAttribute("mode", "HYBRID");

      el.addEventListener("gmp-map-ready", async () => {
        const gmpMapEl = el as any;
        const map = gmpMapEl.getMap();

        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        const tracks = await fetchDocTracks();
        console.log("Fetched", tracks.length, "tracks");

        tracks.forEach((track: any, i: number) => {
          const { lat, lng } = convertToLatLng(track.x, track.y);

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            console.warn("Skipping invalid coords:", {
              i,
              x: track.x,
              y: track.y,
              lat,
              lng,
            });
            return;
          }

          if (i < 3) {
            console.log("Track:", { x: track.x, y: track.y });
            console.log("Converted to:", { lat, lng });
          }

          const div = document.createElement("div");
          div.innerHTML = `
            <div style="width: 24px; height: 24px; background: orange; border-radius: 50%; border: 2px solid white;"></div>
          `;

          new AdvancedMarkerElement({
            map,
            position: { lat, lng },
            content: div,
          });
        });
      });

      container.appendChild(el);
    }

    initMap();
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      <div id="map-3d" />
    </APIProvider>
  );
}
