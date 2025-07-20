import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { LocationPinSvg } from "./LocationPinSvg.tsx";

type CustomMarkerProps = {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
};

export const CustomMarker: React.FC<CustomMarkerProps> = ({ position }) => {
  return (
    <AdvancedMarker
      position={position}
      className={" w-[50px] h-[50px] flex justify-center items-center"}
      onClick={() => {
        console.log(`clicked custom marker`);
      }}
    >
      <LocationPinSvg />
    </AdvancedMarker>
  );
};
