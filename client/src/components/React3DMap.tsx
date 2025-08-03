// @vis.gl/react-google-maps with the new gmp-map-3d web component layered in manually.
// Replaces older DOM-based approach with state driven logic.

import "./react3dMapStyle.css";
import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import {
  type DOMAttributes,
  type RefAttributes,
  type ForwardedRef,
  forwardRef,
  type DependencyList,
  type EffectCallback,
  type Ref,
  useImperativeHandle,
} from "react";

import { AdvancedMarker, useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  APIProvider,
  Map,
  type MapMouseEvent,
  useMap,
} from "@vis.gl/react-google-maps";

import isDeepEqual from "fast-deep-equal";
import { destination, getCoords, point } from "@turf/turf";

const cameraPropNames = ["center", "range", "heading", "tilt", "roll"] as const;

const DEFAULT_CAMERA_PROPS: Map3DCameraProps = {
  center: { lat: 0, lng: 0, altitude: 0 },
  range: 0,
  heading: 0,
  tilt: 0,
  roll: 0,
};

export function useMap3DCameraEvents(
  mapEl?: google.maps.maps3d.Map3DElement | null,
  onCameraChange?: (cameraProps: Map3DCameraProps) => void
) {
  const cameraPropsRef = useRef<Map3DCameraProps>(DEFAULT_CAMERA_PROPS);

  useEffect(() => {
    if (!mapEl) return;

    const cleanupFns: (() => void)[] = [];

    let updateQueued = false;

    for (const p of cameraPropNames) {
      const removeListener = addDomListener(mapEl, `gmp-${p}change`, () => {
        const newValue = mapEl[p];

        if (newValue == null) return;

        if (p === "center")
          cameraPropsRef.current.center = (
            newValue as google.maps.LatLngAltitude
          ).toJSON();
        else cameraPropsRef.current[p] = newValue as number;

        if (onCameraChange && !updateQueued) {
          updateQueued = true;

          queueMicrotask(() => {
            updateQueued = false;
            onCameraChange(cameraPropsRef.current);
          });
        }
      });

      cleanupFns.push(removeListener);
    }

    return () => {
      for (const removeListener of cleanupFns) removeListener();
    };
  }, [mapEl, onCameraChange]);
}

function addDomListener(
  element: google.maps.maps3d.Map3DElement,
  type: string,
  listener: (this: google.maps.maps3d.Map3DElement, ev: unknown) => void
): () => void {
  element.addEventListener(type, listener);

  return () => {
    element.removeEventListener(type, listener);
  };
}

declare module "@vis.gl/react-google-maps" {
  export function useMapsLibrary(
    name: "maps3d"
  ): typeof google.maps.maps3d | null;
}

declare global {
  namespace google.maps.maps3d {
    interface Map3DElement extends HTMLElement {
      mode?: "HYBRID" | "SATELLITE";
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      ["gmp-map-3d"]: CustomElement<
        google.maps.maps3d.Map3DElement,
        google.maps.maps3d.Map3DElement
      >;
    }
  }
}

type CustomElement<TElem, TAttr> = Partial<
  TAttr &
    DOMAttributes<TElem> &
    RefAttributes<TElem> & {
      children: any;
    }
>;

export type Map3DProps = google.maps.maps3d.Map3DElementOptions & {
  onCameraChange?: (cameraProps: Map3DCameraProps) => void;
};

export type Map3DCameraProps = {
  center: google.maps.LatLngAltitudeLiteral;
  range: number;
  heading: number;
  tilt: number;
  roll: number;
};

export const Map3D = forwardRef(
  (
    props: Map3DProps,
    forwardedRef: ForwardedRef<google.maps.maps3d.Map3DElement | null>
  ) => {
    useMapsLibrary("maps3d");

    const [map3DElement, map3dRef] =
      useCallbackRef<google.maps.maps3d.Map3DElement>();

    useMap3DCameraEvents(map3DElement, (p) => {
      if (!props.onCameraChange) return;

      props.onCameraChange(p);
    });

    const [customElementsReady, setCustomElementsReady] = useState(false);
    useEffect(() => {
      customElements.whenDefined("gmp-map-3d").then(() => {
        setCustomElementsReady(true);
      });
    }, []);

    const { center, heading, tilt, range, roll, ...map3dOptions } = props;

    useDeepCompareEffect(() => {
      if (!map3DElement) return;

      Object.assign(map3DElement, map3dOptions);
    }, [map3DElement, map3dOptions]);

    useImperativeHandle<
      google.maps.maps3d.Map3DElement | null,
      google.maps.maps3d.Map3DElement | null
    >(forwardedRef, () => map3DElement, [map3DElement]);

    if (!customElementsReady) return null;

    return (
      <gmp-map-3d
        ref={map3dRef}
        center={center}
        range={props.range}
        heading={props.heading}
        tilt={props.tilt}
        roll={props.roll}
        mode="HYBRID"
      ></gmp-map-3d>
    );
  }
);

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;

type ViewCenterMarkerProps = { position: google.maps.LatLngAltitudeLiteral };
export const ViewCenterMarker = ({ position }: ViewCenterMarkerProps) => (
  <AdvancedMarker position={position} className={"view-center-marker"}>
    <div className={"circle"} />
  </AdvancedMarker>
);

type CameraPositionMarkerProps = {
  position: google.maps.LatLngAltitudeLiteral;
  heading: number;
};

export const CameraPositionMarker = ({
  position,
  heading,
}: CameraPositionMarkerProps) => (
  <AdvancedMarker
    position={position}
    style={{ width: 0, height: 0 }}
    className={"camera-position-marker"}
  >
    <svg
      viewBox={"-1 -1 2 2"}
      width={20}
      height={20}
      style={{ "--camera-heading": heading } as React.CSSProperties}
    >
      <path d="M0,-1 L1,0 H0.3 V1 H-0.3 V0 H-1 Z" />
    </svg>
  </AdvancedMarker>
);

export function estimateCameraPosition(
  camera3dProps: Map3DCameraProps
): google.maps.LatLngAltitudeLiteral {
  const { center, heading, tilt, range } = camera3dProps;

  const tiltRad = (tilt / 180) * Math.PI;
  const height = range * Math.cos(tiltRad);
  const distance = range * Math.sin(tiltRad);

  const [lng, lat] = getCoords(
    destination(point([center.lng, center.lat]), distance, heading + 180, {
      units: "meters",
    })
  );

  return {
    lat: lat as number,
    lng: lng as number,
    altitude: center.altitude + height,
  };
}

export function useCallbackRef<T>() {
  const [el, setEl] = useState<T | null>(null);
  const ref = useCallback((value: T) => setEl(value), [setEl]);

  return [el, ref as Ref<T>] as const;
}

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList
) {
  const ref = useRef<DependencyList | undefined>(undefined);

  if (!ref.current || !isDeepEqual(deps, ref.current)) {
    ref.current = deps;
  }

  useEffect(effect, ref.current);
}

export function useDebouncedEffect(
  effect: EffectCallback,
  timeout: number,
  deps: DependencyList
) {
  const timerRef = useRef(0);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = 0;
    }

    timerRef.current = setTimeout(() => effect(), timeout);
    return () => clearTimeout(timerRef.current);
  }, [timeout, ...deps]);
}

type MiniMapProps = {
  camera3dProps: Map3DCameraProps;
  onMapClick?: (ev: MapMouseEvent) => void;
};

export const MiniMap = ({ camera3dProps, onMapClick }: MiniMapProps) => {
  const minimap = useMap("minimap");

  const cameraPosition = useMemo(
    () => estimateCameraPosition(camera3dProps),
    [camera3dProps]
  );

  useDebouncedEffect(
    () => {
      if (!minimap) return;

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(camera3dProps.center);
      bounds.extend(cameraPosition);

      const maxZoom = Math.max(
        1,
        Math.round(23 - Math.log2(camera3dProps.range))
      );

      minimap.fitBounds(bounds, 120);
      minimap.setZoom(maxZoom);
    },
    200,
    [minimap, camera3dProps.center, camera3dProps.range, cameraPosition]
  );

  return (
    <Map
      id={"minimap"}
      className={"minimap"}
      mapId={MAP_ID}
      // mapTypeId={"terrain"}
      defaultCenter={camera3dProps.center}
      defaultZoom={20}
      onClick={onMapClick}
      disableDefaultUI={true}
      clickableIcons={true}
    >
      <ViewCenterMarker position={camera3dProps.center}></ViewCenterMarker>
      <CameraPositionMarker
        position={cameraPosition}
        heading={camera3dProps.heading}
      ></CameraPositionMarker>
    </Map>
  );
};

const INITIAL_VIEW_PROPS = {
  center: { lat: -40.94992, lng: 175.4184247132748, altitude: 2000 },
  range: 10000,
  heading: 0,
  tilt: 69,
  roll: 0,
};

export function Map3DExample() {
  const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);

  const handleCameraChange = useCallback((props: Map3DCameraProps) => {
    setViewProps((oldProps) => ({ ...oldProps, ...props }));
  }, []);

  const handleMapClick = useCallback((ev: MapMouseEvent) => {
    console.log("clicked minimap");
    if (!ev.detail.latLng) return;

    const { lat, lng } = ev.detail.latLng;
    setViewProps((p) => ({ ...p, center: { lat, lng, altitude: 0 } }));
  }, []);

  return (
    <>
      <Map3D
        {...viewProps}
        onCameraChange={handleCameraChange}
        defaultLabelsDisabled={true}
      />

      {/* <MiniMap camera3dProps={viewProps} onMapClick={handleMapClick}></MiniMap> */}
    </>
  );
}

const ThreeDApp = () => {
  const nonAlphaVersionLoaded = Boolean(
    globalThis &&
      globalThis.google?.maps?.version &&
      !globalThis.google?.maps?.version.endsWith("-alpha")
  );

  if (nonAlphaVersionLoaded) {
    location.reload();
    return;
  }

  return (
    <APIProvider apiKey={API_KEY} version={"alpha"}>
      <Map3DExample />
    </APIProvider>
  );
};
export default ThreeDApp;
