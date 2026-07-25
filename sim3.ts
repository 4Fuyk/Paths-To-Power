import { getTurkeyRegions } from './src/constants/countries.ts';

const regions = getTurkeyRegions();
let totalCHP = 0;
let totalYENI = 0;
let totalAKP = 0;
let totalMHP = 0;
let totalDEM = 0;
let totalSeats = 0;

regions.forEach(prov => {
  let supports = prov.supports || {}; 
  const regionSeats = prov.seats;
  totalSeats += regionSeats;
  
  let allocated = 0;
  let results = {};
  let entries = Object.entries(supports).sort((a,b) => b[1] - a[1]);
  entries.forEach(([pid, val]) => {
    let s = Math.floor((val / 100) * regionSeats);
    results[pid] = s;
    allocated += s;
  });
  let res = regionSeats - allocated;
  let idx = 0;
  while(res > 0 && entries.length > 0) {
    let pid = entries[idx % entries.length][0];
    results[pid] = (results[pid] || 0) + 1;
    res--;
    idx++;
  }
  totalCHP += results['CHP'] || 0;
  totalYENI += results['YENI'] || 0;
  totalAKP += results['AKP'] || 0;
  totalMHP += results['MHP'] || 0;
  totalDEM += results['DEM'] || 0;
});
console.log(`Total Seats: ${totalSeats}`);
console.log(`AKP: ${totalAKP}, YENI: ${totalYENI}, CHP: ${totalCHP}, MHP: ${totalMHP}, DEM: ${totalDEM}`);
