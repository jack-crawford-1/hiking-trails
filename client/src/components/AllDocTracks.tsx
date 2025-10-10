import { useEffect, useState } from "react";
import { fetchDocTracks } from "../api/fetchDoc.js";

export interface Tracks {
  assetId: string;
  name: string;
  region: Region[];
  x: number;
  y: number;
  line: Array<Array<number[]>>;
}

export default function AllDocTracks() {
  const [tracks, setTracks] = useState<Tracks[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    fetchDocTracks()
      .then((data) => {
        setTracks(data);
        if (data.length > 0) {
          setSelectedAssetId(data[0].assetId);
        }
      })
      .catch(console.error);
  }, []);

  const selectedTrack = tracks.find(
    (track) => track.assetId === selectedAssetId
  );

  return (
    <div className="w-[1000px]">
      <div>
        <label htmlFor="assetId-select">Select Asset ID: </label>
        <select
          id="assetId-select"
          value={selectedAssetId}
          onChange={(e) => setSelectedAssetId(e.target.value)}
          className="bg-gray-700 py-2 pl-2"
        >
          {tracks.map((track) => (
            <option key={track.assetId} value={track.assetId}>
              {track.assetId}
            </option>
          ))}
        </select>
      </div>
      {selectedTrack && (
        <div key={selectedTrack.assetId}>
          <div>Asset ID: {selectedTrack.assetId}</div>
          <div>Name: {selectedTrack.name}</div>
          <div>Region: {selectedTrack.region.join(", ")}</div>
          <div>
            Line:
            <ul>
              {selectedTrack.line.map((segment, i) => (
                <li key={i}>
                  [{segment.map((point) => `[${point.join(", ")}]`).join(", ")}]
                </li>
              ))}
            </ul>
          </div>
          <div>X: {selectedTrack.x}</div>
          <div>Y: {selectedTrack.y}</div>
        </div>
      )}
    </div>
  );
}

export type Region =
  | "Auckland"
  | "Bay of Plenty"
  | "Canterbury"
  | "Central North Island"
  | "Chatham Islands"
  | "Coromandel"
  | "East Coast"
  | "Fiordland"
  | "Hawke’s Bay"
  | "Manawatu/Whanganui"
  | "Marlborough"
  | "Nelson/Tasman"
  | "Northland"
  | "Otago"
  | "Southland"
  | "Taranaki"
  | "Waikato"
  | "Wairarapa"
  | "Wellington/Kapiti"
  | "West Coast";
