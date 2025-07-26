import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { ClusteredMarkers } from "./ClusteredMarkers";
import SlidingDrawer from "./SlidingDrawer";
import { useState } from "react";
import { TrackPolyline } from "./PolyLines";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

export default function MainMap() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);

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
      <SlidingDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        track={selectedTrack}
      />

      {selectedTrack?.line && <TrackPolyline line={selectedTrack.line} />}

      <ClusteredMarkers
        onMarkerClick={(track) => {
          setSelectedTrack(track);
          setDrawerOpen(true);
        }}
      />
    </APIProvider>
  );
}
