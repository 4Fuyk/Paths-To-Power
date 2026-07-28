const https = require('https');
https.get('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const fs = require('fs');
    fs.writeFileSync('world.svg', data);
    console.log('Saved world.svg');
  });
});
