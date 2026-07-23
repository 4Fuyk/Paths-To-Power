const fs = require('fs');
let c = fs.readFileSync('src/utils/mapUtils.ts', 'utf8');

const mappingCode = `
  if (countryId && ['BR', 'GB', 'CA', 'AU'].includes(countryId)) {
    return normName;
  }
  
  if (countryId === 'KR') {
    if (normName.includes('seoul')) return 'seoul';
    if (normName.includes('busan')) return 'busan';
    if (normName.includes('incheon')) return 'incheon';
    if (normName.includes('daegu')) return 'daegu';
    if (normName.includes('gyeonggi')) return 'gyeonggi';
    if (normName.includes('gyeongsang') && normName.includes('south')) return 'southgyeongsang';
    if (normName.includes('gyeongsang') && normName.includes('north')) return 'northgyeongsang';
    if (normName.includes('jeolla') && normName.includes('south')) return 'southjeolla';
    if (normName.includes('jeolla') && normName.includes('north')) return 'northjeolla';
    if (normName.includes('chungcheong') && normName.includes('south')) return 'southchungcheong';
    if (normName.includes('chungcheong') && normName.includes('north')) return 'northchungcheong';
  }

  if (countryId === 'ZA') {
    if (normName.includes('orangefreestate') || normName.includes('freestate')) return 'freestate';
    return normName;
  }

  if (countryId === 'IN') {
    return normName;
  }

  if (countryId === 'MX') {
    if (normName === 'mexico') return 'mexicostate'; // "México" -> México (State)
    if (normName.includes('distritofederal') || normName.includes('ciudaddemexico')) return 'ciudaddemexico';
    return normName;
  }

  if (countryId === 'IT') {
    const itMap: Record<string, string> = {
      'lombardia': 'lombardy',
      'sicilia': 'sicily',
      'piemonte': 'piedmont',
      'toscana': 'tuscany',
      'puglia': 'apulia',
      'lazio': 'lazio',
      'campania': 'campania',
      'veneto': 'veneto',
      'emiliaromagna': 'emiliaromagna',
      'calabria': 'calabria',
      
      // Map other regions to closest neighbors for game simplicity
      'sardignasardegna': 'lazio',
      'trentinoaltoadigesudtirol': 'veneto',
      'friuliveneziagiulia': 'veneto',
      'liguria': 'piedmont',
      'valledaostavalleedaoste': 'piedmont',
      'umbria': 'tuscany',
      'marche': 'emiliaromagna',
      'abruzzo': 'lazio',
      'molise': 'campania',
      'basilicata': 'apulia'
    };
    return itMap[normName] || normName;
  }

  if (countryId === 'ID') {
    const idMap: Record<string, string> = {
      'jawabarat': 'westjava',
      'jawatimur': 'eastjava',
      'jawatengah': 'centraljava',
      'sumaterautara': 'northsumatra',
      'banten': 'banten',
      'jakartaraya': 'jakarta',
      'sulawesiselatan': 'southsulawesi',
      'lampung': 'lampung',
      'sumateraselatan': 'southsumatra',
      'riau': 'riau',
      
      // Fallbacks
      'aceh': 'northsumatra',
      'sumaterabarat': 'northsumatra',
      'jambi': 'southsumatra',
      'bengkulu': 'southsumatra',
      'kepulauanriau': 'riau',
      'bangkabelitung': 'southsumatra',
      'bali': 'eastjava',
      'nusatenggarabarat': 'eastjava',
      'nusatenggaratimur': 'eastjava',
      'kalimantanbarat': 'westjava',
      'kalimantantengah': 'centraljava',
      'kalimantanselatan': 'eastjava',
      'kalimantantimur': 'eastjava',
      'kalimantanutara': 'eastjava',
      'sulawesiutara': 'southsulawesi',
      'sulawesitengah': 'southsulawesi',
      'sulawesitenggara': 'southsulawesi',
      'gorontalo': 'southsulawesi',
      'sulawesibarat': 'southsulawesi',
      'maluku': 'southsulawesi',
      'malukuutara': 'southsulawesi',
      'papua': 'southsulawesi',
      'papuabarat': 'southsulawesi',
      'irianjayabarat': 'southsulawesi'
    };
    return idMap[normName] || normName;
  }

  if (countryId === 'ES') {
    const esMap: Record<string, string> = {
      // Andalusia
      'almeria': 'andalusia', 'cadiz': 'andalusia', 'cordoba': 'andalusia', 'granada': 'andalusia', 'huelva': 'andalusia', 'jaen': 'andalusia', 'malaga': 'andalusia', 'sevilla': 'andalusia',
      // Catalonia
      'barcelona': 'catalonia', 'girona': 'catalonia', 'lleida': 'catalonia', 'tarragona': 'catalonia',
      // Madrid
      'madrid': 'madrid',
      // Valencia
      'alicante': 'valencia', 'castellon': 'valencia', 'valencia': 'valencia',
      // Galicia
      'acoruna': 'galicia', 'lugo': 'galicia', 'ourense': 'galicia', 'pontevedra': 'galicia',
      // Castile and Leon
      'avila': 'castileandleon', 'burgos': 'castileandleon', 'leon': 'castileandleon', 'palencia': 'castileandleon', 'salamanca': 'castileandleon', 'segovia': 'castileandleon', 'soria': 'castileandleon', 'valladolid': 'castileandleon', 'zamora': 'castileandleon',
      // Basque
      'alava': 'basquecountry', 'gipuzkoa': 'basquecountry', 'bizkaia': 'basquecountry',
      // Canary
      'laspalmas': 'canaryislands', 'santacruzdetenerife': 'canaryislands',
      // Castile-La Mancha
      'albacete': 'castilelamancha', 'ciudadreal': 'castilelamancha', 'cuenca': 'castilelamancha', 'guadalajara': 'castilelamancha', 'toledo': 'castilelamancha',
      // Murcia
      'murcia': 'murcia',
      
      // Others mapped to neighbors
      'asturias': 'galicia',
      'cantabria': 'basquecountry',
      'larioja': 'basquecountry',
      'navarra': 'basquecountry',
      'aragon': 'catalonia',
      'huesca': 'catalonia', 'teruel': 'valencia', 'zaragoza': 'catalonia',
      'extremadura': 'andalusia',
      'badajoz': 'andalusia', 'caceres': 'castilelamancha',
      'baleares': 'valencia',
      'ceuta': 'andalusia', 'melilla': 'andalusia'
    };
    return esMap[normName] || normName;
  }
`;

c = c.replace(/if \(countryId && \['BR', 'GB'\]\.includes\(countryId\)\) \{\n    return normName; \/\/ Handled by fallback matching in CampaignView\n  \}/g, mappingCode);

fs.writeFileSync('src/utils/mapUtils.ts', c, 'utf8');
