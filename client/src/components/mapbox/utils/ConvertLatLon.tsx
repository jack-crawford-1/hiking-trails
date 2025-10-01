import proj4 from "proj4";

const nztm =
  "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +units=m +no_defs";

const wgs84 = proj4.WGS84;

export default function convertToLatLng(x: number, y: number) {
  const [lng, lat] = proj4(nztm, wgs84, [x, y]);
  return { lat, lng };
}
