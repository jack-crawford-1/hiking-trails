import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ClusteredMarkers } from "./ClusteredMarkers";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

export default function MainMap() {
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: "80vw", height: "70vh" }}
        mapId={MAP_ID}
        defaultCenter={{ lat: -41.54992, lng: 175 }}
        defaultZoom={8}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      />
      <ClusteredMarkers />
    </APIProvider>
  );
}
