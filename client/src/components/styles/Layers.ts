type PaintProp =
  | "background-color"
  | "fill-color"
  | "line-color"
  | "circle-color"
  | "fill-extrusion-color"
  | "heatmap-color"
  | "text-color"
  | "icon-color";

type LayerStyle = {
  id: string;
  prop: PaintProp;
  value: string | number | any;
};
export const topo = {
  land: "#C7C0B5",
  landcover: "#91B48B",
  landuse: "#81B18F",
  park: "#91B48B",
  water: "#3FAAAA",
  waterLine: "#7FB1D6",
  wetland: "#B4D7C8",
  waterShadow: "#B8DBEF",
  contour: "#F57627",
  hillshade: 0.25,
  roadMinor: "#DDD7CE",
  roadMinorLink: "#D9D2C8",
  roadStreet: "#ffffff",
  roadStreetLow: "#ffffff",
  roadSecTer: "#C7BFB3",
  roadPrimary: "#B8AE9E",
  roadPrimaryCase: "#AA9F8D",
  motorway: "#A79883",
  motorwayCase: "#9E8F7B",
  roadMajorLink: "#B0A694",
  roadCaseMinor: "#BDB4A7",
  roadCaseStreet: "#B7AE9F",
  roadCaseSecTer: "#B2A898",
  roadCaseMajorLink: "#A69885",
  roadBg: "#D4CCBF",
  roadPedPoly: "#E9E2D6",
  roadPolygon: "#E80909",
  rail: "#333fff",
  railTracks: "#E80909",
  boundary: "#ffffff",
  boundaryHalo0: "#E1D6C3",
  boundaryHalo1: "#E5DAC7",
  labelDark: "#4F4A40",
  labelDarker: "#473F34",
  labelRoad: "#D4CCBF",
  labelPoi: "#FFFFFF",
  labelWater: "#4E6472",
  labelNatural: "#5F574C",
  labelStructure: "#6A6358",
  labelCityMinor: "#4F4A40",
  labelCityMajor: "#473F34",
  test: "#E80909",
};

export const layerStyles: LayerStyle[] = [
  // Base land & water
  { id: "land", prop: "background-color", value: topo.land },
  { id: "landcover", prop: "fill-color", value: topo.landcover },
  { id: "national-park", prop: "fill-color", value: topo.park },
  { id: "national-park_tint-band", prop: "line-color", value: "#7CA57A" },
  { id: "landuse", prop: "fill-color", value: topo.landuse },

  { id: "pitch-outline", prop: "line-color", value: "#CBBF9E" },
  { id: "waterway-shadow", prop: "line-color", value: topo.water },
  { id: "water-shadow", prop: "fill-color", value: topo.waterShadow },
  { id: "waterway", prop: "line-color", value: topo.waterLine },
  { id: "water", prop: "fill-color", value: topo.water },
  { id: "water-depth", prop: "fill-color", value: "#8CB9DF" },
  { id: "wetland", prop: "fill-color", value: topo.wetland },
  { id: "wetland-pattern", prop: "fill-color", value: topo.wetland },
  { id: "hillshade", prop: "fill-color", value: "#C8C2B6" },
  { id: "contour-line", prop: "line-color", value: topo.contour },

  // Structures & terrain features
  { id: "land-structure-polygon", prop: "fill-color", value: "#CBBF9E" },
  { id: "land-structure-line", prop: "line-color", value: "#CFC7B6" },
  { id: "aeroway-polygon", prop: "fill-color", value: "#CBBF9E" },
  { id: "aeroway-line", prop: "line-color", value: "#C7C0B5" },
  { id: "building", prop: "fill-color", value: "#F2EAD7" },
  { id: "building-underground", prop: "fill-color", value: "#EAE3D2" },

  // Tunnels (roads/paths below ground)
  { id: "tunnel-minor-case", prop: "line-color", value: "#B7AE9E" },
  { id: "tunnel-street-case", prop: "line-color", value: "#B1A89A" },
  { id: "tunnel-minor-link-case", prop: "line-color", value: "#B1A89A" },
  {
    id: "tunnel-secondary-tertiary-case",
    prop: "line-color",
    value: "#AFA593",
  },
  { id: "tunnel-primary-case", prop: "line-color", value: "#A79C89" },
  { id: "tunnel-major-link-case", prop: "line-color", value: "#A39683" },
  {
    id: "tunnel-motorway-trunk-case",
    prop: "line-color",
    value: topo.motorwayCase,
  },
  { id: "tunnel-path-trail", prop: "line-color", value: "#BBAF9C" },
  { id: "tunnel-path-cycleway-piste", prop: "line-color", value: "#BBAF9C" },
  { id: "tunnel-path", prop: "line-color", value: "#BBAF9C" },
  { id: "tunnel-steps", prop: "line-color", value: "#B9AE9A" },
  { id: "tunnel-pedestrian", prop: "line-color", value: "#B9AE9A" },
  { id: "tunnel-construction", prop: "line-color", value: "#B4A996" },
  { id: "tunnel-minor", prop: "line-color", value: "#CFC7BC" },
  { id: "tunnel-minor-link", prop: "line-color", value: "#CFC7BC" },
  { id: "tunnel-major-link", prop: "line-color", value: topo.roadMajorLink },
  { id: "tunnel-street", prop: "line-color", value: "#C8C0B4" },
  { id: "tunnel-street-low", prop: "line-color", value: "#D7D1C7" },
  { id: "tunnel-secondary-tertiary", prop: "line-color", value: "#C1B8AB" },
  { id: "tunnel-primary", prop: "line-color", value: "#B4AA9B" },
  { id: "tunnel-motorway-trunk", prop: "line-color", value: topo.motorway },
  { id: "tunnel-oneway-arrow-blue", prop: "text-color", value: "#B5AA98" },
  { id: "tunnel-oneway-arrow-white", prop: "text-color", value: "#B5AA98" },

  // Natural features & ferries
  { id: "cliff", prop: "line-color", value: "#B08F6A" },
  { id: "ferry", prop: "line-color", value: "#7FA7C6" },
  { id: "ferry-auto", prop: "line-color", value: "#7FA7C6" },

  // Pedestrian polygons & backgrounds
  {
    id: "road-pedestrian-polygon-fill",
    prop: "fill-color",
    value: topo.roadPedPoly,
  },
  {
    id: "road-pedestrian-polygon-pattern",
    prop: "fill-color",
    value: topo.roadPedPoly,
  },
  { id: "road-path-bg", prop: "line-color", value: topo.roadBg },
  { id: "road-steps-bg", prop: "line-color", value: topo.roadBg },

  // Surface roads & paths (cases/outlines)
  { id: "road-pedestrian-case", prop: "line-color", value: "#BBB2A4" },
  { id: "road-path-trail", prop: "line-color", value: "#BEAF9B" },
  { id: "road-path-cycleway-piste", prop: "line-color", value: "#B7A992" },
  { id: "road-path", prop: "line-color", value: "#C1B5A4" },
  { id: "road-steps", prop: "line-color", value: "#C1B5A4" },
  { id: "road-pedestrian", prop: "line-color", value: "#C9C1B4" },
  { id: "golf-hole-line", prop: "line-color", value: "#9E8E7A" },
  { id: "road-polygon", prop: "fill-color", value: topo.roadPolygon },

  // Circle features
  { id: "turning-feature-outline", prop: "circle-color", value: "#AFA695" },

  // Road cases by class
  { id: "road-minor-case", prop: "line-color", value: topo.roadCaseMinor },
  { id: "road-street-case", prop: "line-color", value: topo.roadCaseStreet },
  {
    id: "road-minor-link-case",
    prop: "line-color",
    value: topo.roadCaseStreet,
  },
  {
    id: "road-secondary-tertiary-case",
    prop: "line-color",
    value: topo.roadCaseSecTer,
  },
  { id: "road-primary-case", prop: "line-color", value: topo.roadPrimaryCase },
  {
    id: "road-major-link-case",
    prop: "line-color",
    value: topo.roadCaseMajorLink,
  },
  {
    id: "road-motorway-trunk-case",
    prop: "line-color",
    value: topo.motorwayCase,
  },

  // Circle turning features (surface)
  { id: "turning-feature", prop: "circle-color", value: "#B8AF9E" },

  // Surface roads by class
  { id: "road-construction", prop: "line-color", value: "#C7BBA9" },
  { id: "road-minor", prop: "line-color", value: topo.roadMinor },
  { id: "road-minor-link", prop: "line-color", value: topo.roadMinorLink },
  { id: "road-major-link", prop: "line-color", value: topo.roadMajorLink },
  { id: "road-street", prop: "line-color", value: topo.roadStreet },
  { id: "road-street-low", prop: "line-color", value: topo.roadStreetLow },
  { id: "road-secondary-tertiary", prop: "line-color", value: topo.roadSecTer },
  { id: "road-primary", prop: "line-color", value: topo.roadPrimary },
  { id: "road-motorway-trunk", prop: "line-color", value: topo.motorway },

  // Rail
  { id: "road-rail", prop: "line-color", value: topo.rail },
  { id: "road-rail-tracks", prop: "line-color", value: topo.railTracks },

  // Symbols (arrows/crossings etc.)
  { id: "level-crossing", prop: "text-color", value: "#B5AA98" },
  { id: "road-oneway-arrow-blue", prop: "text-color", value: "#B5AA98" },
  { id: "road-oneway-arrow-white", prop: "text-color", value: "#B5AA98" },
  { id: "crosswalks", prop: "text-color", value: "#B5AA98" },

  // Fences/hedges/etc.
  { id: "gate-fence-hedge", prop: "line-color", value: "#C2B6A6" },

  // Bridges: backgrounds & cases
  { id: "bridge-path-bg", prop: "line-color", value: topo.roadBg },
  { id: "bridge-steps-bg", prop: "line-color", value: topo.roadBg },
  { id: "bridge-pedestrian-case", prop: "line-color", value: "#BBB2A4" },
  { id: "bridge-path-trail", prop: "line-color", value: "#BEAF9B" },
  { id: "bridge-path-cycleway-piste", prop: "line-color", value: "#B7A992" },
  { id: "bridge-path", prop: "line-color", value: "#C1B5A4" },
  { id: "bridge-steps", prop: "line-color", value: "#C1B5A4" },
  { id: "bridge-pedestrian", prop: "line-color", value: "#C9C1B4" },

  // Labels on structures
  { id: "gate-label", prop: "text-color", value: topo.labelStructure },

  // Bridge cases continued
  { id: "bridge-minor-case", prop: "line-color", value: topo.roadCaseMinor },
  { id: "bridge-street-case", prop: "line-color", value: topo.roadCaseStreet },
  {
    id: "bridge-minor-link-case",
    prop: "line-color",
    value: topo.roadCaseStreet,
  },
  {
    id: "bridge-secondary-tertiary-case",
    prop: "line-color",
    value: topo.roadCaseSecTer,
  },
  {
    id: "bridge-primary-case",
    prop: "line-color",
    value: topo.roadPrimaryCase,
  },
  {
    id: "bridge-major-link-case",
    prop: "line-color",
    value: topo.roadCaseMajorLink,
  },
  {
    id: "bridge-motorway-trunk-case",
    prop: "line-color",
    value: topo.motorwayCase,
  },

  // Bridges (surface)
  { id: "bridge-construction", prop: "line-color", value: "#C7BBA9" },
  { id: "bridge-minor", prop: "line-color", value: topo.roadMinor },
  { id: "bridge-minor-link", prop: "line-color", value: topo.roadMinorLink },
  { id: "bridge-major-link", prop: "line-color", value: topo.roadMajorLink },
  { id: "bridge-street", prop: "line-color", value: topo.roadStreet },
  { id: "bridge-street-low", prop: "line-color", value: topo.roadStreetLow },
  {
    id: "bridge-secondary-tertiary",
    prop: "line-color",
    value: topo.roadSecTer,
  },
  { id: "bridge-primary", prop: "line-color", value: topo.roadPrimary },
  { id: "bridge-motorway-trunk", prop: "line-color", value: topo.motorway },

  // Bridge variants (2 / -case)
  {
    id: "bridge-major-link-2-case",
    prop: "line-color",
    value: topo.roadCaseMajorLink,
  },
  {
    id: "bridge-motorway-trunk-2-case",
    prop: "line-color",
    value: topo.motorwayCase,
  },
  { id: "bridge-major-link-2", prop: "line-color", value: topo.roadMajorLink },
  { id: "bridge-motorway-trunk-2", prop: "line-color", value: topo.motorway },

  // Bridge arrows & rail
  { id: "bridge-oneway-arrow-blue", prop: "text-color", value: "#B5AA98" },
  { id: "bridge-oneway-arrow-white", prop: "text-color", value: "#B5AA98" },
  { id: "bridge-rail", prop: "line-color", value: topo.rail },
  { id: "bridge-rail-tracks", prop: "line-color", value: topo.railTracks },

  // Aerialway
  { id: "aerialway", prop: "line-color", value: "#B3A793" },

  // Boundaries & halos
  { id: "admin-1-boundary-bg", prop: "line-color", value: topo.boundaryHalo1 },
  { id: "admin-0-boundary-bg", prop: "line-color", value: topo.boundaryHalo0 },
  { id: "admin-1-boundary", prop: "line-color", value: topo.boundary },
  { id: "admin-0-boundary", prop: "line-color", value: "#AB9F8A" },
  { id: "admin-0-boundary-disputed", prop: "line-color", value: "#AB9F8A" },

  // Symbol labels (text)
  { id: "contour-label", prop: "text-color", value: "#8C7E65" },
  { id: "building-entrance", prop: "text-color", value: topo.labelStructure },
  {
    id: "building-number-label",
    prop: "text-color",
    value: topo.labelStructure,
  },
  { id: "block-number-label", prop: "text-color", value: topo.labelStructure },
  { id: "road-label", prop: "text-color", value: topo.labelRoad },
  { id: "road-intersection", prop: "text-color", value: topo.labelRoad },
  { id: "road-number-shield", prop: "text-color", value: topo.labelRoad },
  { id: "road-exit-shield", prop: "text-color", value: topo.labelRoad },
  { id: "path-pedestrian-label", prop: "text-color", value: topo.labelRoad },
  { id: "golf-hole-label", prop: "text-color", value: topo.labelStructure },
  { id: "ferry-aerialway-label", prop: "text-color", value: "#5A6D7A" },
  { id: "waterway-label", prop: "text-color", value: topo.labelWater },
  { id: "natural-line-label", prop: "text-color", value: topo.labelNatural },
  { id: "natural-point-label", prop: "text-color", value: topo.labelNatural },
  { id: "water-line-label", prop: "text-color", value: topo.labelWater },
  { id: "water-point-label", prop: "text-color", value: topo.labelWater },
  { id: "poi-label", prop: "text-color", value: topo.labelPoi },
  { id: "transit-label", prop: "text-color", value: topo.labelPoi },
  { id: "airport-label", prop: "text-color", value: topo.labelPoi },
  {
    id: "settlement-subdivision-label",
    prop: "text-color",
    value: topo.labelCityMinor,
  },
  {
    id: "settlement-minor-label",
    prop: "text-color",
    value: topo.labelCityMinor,
  },
  { id: "settlement-major-label", prop: "text-color", value: topo.labelDarker },
  { id: "state-label", prop: "text-color", value: "#4B4439" },
  { id: "country-label", prop: "text-color", value: "#3F382E" },
  { id: "continent-label", prop: "text-color", value: "#3A332A" },
];

export function applyLayerStyles(
  map: mapboxgl.Map,
  styles: LayerStyle[] = layerStyles
) {
  styles.forEach(({ id, prop, value }) => {
    if (map.getLayer(id)) map.setPaintProperty(id, prop, value as any);
  });
  if (map.getLayer("hillshade")) {
    map.setPaintProperty("hillshade", "fill-opacity", topo.hillshade as number);
  }
}

export function bindReapplyOnStyleData(
  map: mapboxgl.Map,
  styles: LayerStyle[] = layerStyles
) {
  const handler = () => applyLayerStyles(map, styles);
  map.on("styledata", handler);
  return () => map.off("styledata", handler);
}
