import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { CustomMarker } from "./CustomMarker";
import { fetchDocTracks } from "../api/fetchDoc";
import type { Tracks } from "./AllDocTracks";
import convertToLatLng from "./ConvertLatLon";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

export default function MainMap() {
  const [confirmLatLng, setConfirmLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [tracks, setTracks] = useState<Tracks[]>([]);

  useEffect(() => {
    fetchDocTracks().then(setTracks).catch(console.error);
  }, []);

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

      {tracks.map((track) => {
        const position = convertToLatLng(track.x, track.y);
        return <CustomMarker key={track.assetId} position={position} />;
      })}

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
