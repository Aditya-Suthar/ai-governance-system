import NodeGeocoder from "node-geocoder";
import fetch from "node-fetch";

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  fetch: fetch as any,
});

export default geocoder;