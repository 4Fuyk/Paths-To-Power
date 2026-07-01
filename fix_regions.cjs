const fs = require('fs');

const jpParties = ['LDP', 'CDP', 'Komeito', 'Ishin no Kai', 'DPFP', 'JCP'];
const egParties = ['NFP', 'RPP', 'WAFD', 'HDP', 'MEP', 'ESDP'];
const brParties = ['PT', 'PL', 'UNIAO', 'MDB', 'PSD', 'PP'];

function getJpParty(name) {
  if (['Yamaguchi', 'Shimane', 'Kagoshima'].includes(name)) return 'LDP';
  if (['Osaka', 'Hyogo'].includes(name)) return 'Ishin no Kai';
  if (['Hokkaido', 'Iwate', 'Nagano'].includes(name)) return 'CDP';
  if (name === 'Okinawa') return 'CDP';
  return 'LDP';
}

function getEgParty(name) {
  return 'NFP';
}

function getBrParty(name) {
  if (['Bahia', 'Pernambuco', 'Ceará', 'Maranhão', 'Piauí', 'Alagoas', 'Paraíba', 'Rio Grande do Norte', 'Sergipe'].includes(name)) return 'PT';
  if (['Santa Catarina', 'Paraná', 'Mato Grosso', 'Rondônia', 'Roraima', 'Mato Grosso do Sul', 'Goiás', 'Distrito Federal', 'Acre', 'Amapá'].includes(name)) return 'PL';
  return (Math.random() > 0.5 ? 'PL' : 'PT');
}

function genSupports(partyIds, mainParty, isMixed) {
  let supports = {};
  let total = 0;
  
  partyIds.forEach(pid => {
    let base = Math.random() * 5;
    if (pid === mainParty) base += isMixed ? 35 : (partyIds === egParties ? 60 : 45);
    else if (isMixed) base += Math.random() * 20;
    
    supports[pid] = base;
    total += base;
  });
  
  let norm = {};
  partyIds.forEach(pid => {
    norm[pid] = parseFloat(((supports[pid] / total) * 100).toFixed(1));
  });
  return norm;
}

let content = fs.readFileSync('src/constants/countries.ts', 'utf8');

// Replace BR regions
content = content.replace(/(id: 'BR'[\s\S]*?regions: )\[([\s\S]*?)\]/, (match, prefix, regionsStr) => {
  let newRegions = regionsStr.replace(/\{ id: '([^']+)', name: '([^']+)', seats: (\d+), voterDistribution: makeVoterGroup\([^)]+\), supports: \{\}, infrastructure: \d+, campaignLevel: 0, ownerPartyId: '([^']+)' \}/g, (m, id, name, seats, oldOwner) => {
    const owner = getBrParty(name);
    const isMixed = ['São Paulo', 'Minas Gerais', 'Rio de Janeiro', 'Espírito Santo', 'Rio Grande do Sul'].includes(name);
    const supp = genSupports(brParties, owner, isMixed);
    return `{ id: '${id}', name: '${name}', seats: ${seats}, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: ${JSON.stringify(supp)}, infrastructure: 3, campaignLevel: 0, ownerPartyId: '${owner}' }`;
  });
  return prefix + '[' + newRegions + ']';
});

// Replace JP regions
content = content.replace(/(id: 'JP'[\s\S]*?regions: )\[([\s\S]*?)\]/, (match, prefix, regionsStr) => {
  let newRegions = regionsStr.replace(/\{ id: '([^']+)', name: '([^']+)', seats: (\d+), voterDistribution: makeVoterGroup\([^)]+\), supports: \{\}, infrastructure: \d+, campaignLevel: 0, ownerPartyId: '([^']+)' \}/g, (m, id, name, seats, oldOwner) => {
    const owner = getJpParty(name);
    const supp = genSupports(jpParties, owner, false);
    return `{ id: '${id}', name: '${name}', seats: ${seats}, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: ${JSON.stringify(supp)}, infrastructure: 4, campaignLevel: 0, ownerPartyId: '${owner}' }`;
  });
  return prefix + '[' + newRegions + ']';
});

// Replace EG regions
content = content.replace(/(id: 'EG'[\s\S]*?regions: )\[([\s\S]*?)\]/, (match, prefix, regionsStr) => {
  let newRegions = regionsStr.replace(/\{ id: '([^']+)', name: '([^']+)', seats: (\d+), voterDistribution: makeVoterGroup\([^)]+\), supports: \{\}, infrastructure: \d+, campaignLevel: 0, ownerPartyId: '([^']+)' \}/g, (m, id, name, seats, oldOwner) => {
    const owner = getEgParty(name);
    const isMixed = ['Cairo', 'Alexandria', 'Giza'].includes(name);
    const supp = genSupports(egParties, owner, isMixed);
    return `{ id: '${id}', name: '${name}', seats: ${seats}, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: ${JSON.stringify(supp)}, infrastructure: 3, campaignLevel: 0, ownerPartyId: '${owner}' }`;
  });
  return prefix + '[' + newRegions + ']';
});

fs.writeFileSync('src/constants/countries.ts', content, 'utf8');
console.log('Done replacing regions in countries.ts');
