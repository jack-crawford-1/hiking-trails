import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import convertToLatLng from "./ConvertLatLon";

type Props = {
  line: number[][] | number[][][];
};

export function TrackPolyline({ line }: Props) {
  const map = useMap();

  const isNested = Array.isArray(line[0]) && Array.isArray(line[0][0]);
  const flattenedLine: number[][] = isNested
    ? (line as number[][][]).flat()
    : (line as number[][]);

  useEffect(() => {
    if (!map || !line) return;

    const latLngPath = flattenedLine.map(([x, y], i) => {
      console.log(`Converting point ${i}: x=${x}, y=${y}`);
      return convertToLatLng(x, y);
    });

    const polyline = new google.maps.Polyline({
      path: latLngPath,
      geodesic: true,
      strokeColor: "red",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map, flattenedLine]);

  return null;
}
