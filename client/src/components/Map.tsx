import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { CustomMarker } from "./CustomMarker";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

export default function MainMap() {
  const [confirmLatLng, setConfirmLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: "80vw", height: "70vh" }}
        mapId={MAP_ID}
        defaultCenter={{ lat: -41.54992, lng: 175 }}
        defaultZoom={8}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onClick={(e) => {
          if (e.detail?.latLng) {
            setConfirmLatLng({
              lat: e.detail.latLng.lat,
              lng: e.detail.latLng.lng,
            });
            console.log(
              `clicked ${e.detail.latLng.lat} , ${e.detail.latLng.lng}`
            );
          }
        }}
      />

      <CustomMarker
        position={{ lat: -40.37422328025859, lng: 175.46232617982287 }}
      />

      <div>
        <div>
          <p>Last Clicked Lat Lng:</p>{" "}
          {confirmLatLng
            ? `lat: ${confirmLatLng.lat}, lng: ${confirmLatLng.lng}`
            : "null"}
        </div>
      </div>
    </APIProvider>
  );
}
