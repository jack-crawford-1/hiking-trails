import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function MainMap() {
  const [confirmLatLng, setConfirmLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: "80vw", height: "50vh" }}
        defaultCenter={{ lat: -44.54992, lng: 144 }}
        defaultZoom={5}
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
