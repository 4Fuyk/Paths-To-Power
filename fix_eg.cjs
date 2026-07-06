const fs = require('fs');
const proj4 = require('./proj4.js');

fetch('https://unpkg.com/@highcharts/map-collection@2.1.0/countries/eg/eg-all.geo.json')
  .then(r=>r.json())
  .then(async data => {
    const transform = data['hc-transform']?.default;
    if (transform) {
      const { crs, scale, xoffset, yoffset } = transform;
      
      const unproject = (x, y) => {
        const px = x * scale + xoffset;
        const py = yoffset - (y * scale);
        return proj4(crs, 'WGS84', [px, py]);
      };

      const decodeCoordinates = (coords) => {
        if (typeof coords[0] === 'number') {
           return unproject(coords[0], coords[1]);
        }
        return coords.map(c => decodeCoordinates(c));
      };

      data.features.forEach(f => {
        f.geometry.coordinates = decodeCoordinates(f.geometry.coordinates);
      });
      delete data['hc-transform'];
      fs.writeFileSync('./public/egypt-provinces.geojson', JSON.stringify(data));
      console.log('Converted and saved!');
    }
  });
