const proj4 = require('./proj4.js');
const crs = "+proj=tmerc +lat_0=30 +lon_0=31 +k=1 +x_0=615000 +y_0=810000 +ellps=helmert +towgs84=-130,110,-13,0,0,0,0 +units=m +no_defs";

const jsonres = 15.5;
const jsonmarginX = -999;
const jsonmarginY = 9851.0;

const x = 3467, y = 7217;
const px = (x - jsonmarginX) * jsonres;
const py = (jsonmarginY - y) * jsonres;

console.log("px, py:", px, py);
console.log("proj4:", proj4(crs, 'WGS84', [px, py]));
