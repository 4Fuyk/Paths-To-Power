const proj4 = require('proj4');
const crs = "+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=810000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs";
const scale = 0.000568355052131;
const xoffset = -7520.92927507;
const yoffset = 1008534.68201;

const x = 3467, y = 7217;
const px = x * scale + xoffset;
const py = yoffset - (y * scale);

console.log("px, py:", px, py);
console.log("proj4:", proj4(crs, 'WGS84', [px, py]));
