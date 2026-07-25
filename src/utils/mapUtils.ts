export const normalizeName = (str: string) => {
  if (!str) return '';
  return str
    .replace(/İ/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/I/g, 'i')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z]/g, ''); // strip any spaces/dashes for mapping purposes
};

export const getRegionIdFromNormalizedName = (normName: string, countryId?: string): string => {
  if (countryId === 'US') {
    const cleanName = normName.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanName === 'washingtondc' || cleanName === 'districtofcolumbia' || cleanName === 'dc') {
      return 'US_districtofcolumbia';
    }
    return `US_${cleanName}`;
  }
  if (countryId === 'DE') {
    return `DE_${normName}`;
  }
  if (countryId === 'EG') {
    const egMap: Record<string, string> = {
      'albahralahmar': 'redsea',
      'janubsina': 'southsinai',
      'luxor': 'luxor',
      'aluqsur': 'luxor',
      'alismailiyah': 'ismailia',
      'algharbiyah': 'gharbia',
      'alminufiyah': 'monufia',
      'alqahirah': 'cairo',
      'alqalyubiyah': 'qalyubia',
      'ashsharqiyah': 'sharqia',
      'shamalsina': 'northsinai',
      'assuways': 'suez',
      'addaqahliyah': 'dakahlia',
      'bursaid': 'portsaid',
      'dumyat': 'damietta',
      'albuhayrah': 'beheira',
      'matruh': 'matrouh',
      'aliskandariyah': 'alexandria',
      'aljizah': 'giza',
      'alfayyum': 'faiyum',
      'alwadiatjadid': 'newvalley',
      'alwadialjadid': 'newvalley',
      'alminya': 'minya',
      'banisuwayf': 'benisuef',
      'kafrashshaykh': 'kafrelsheikh',
      'asyut': 'asyut',
      'aswan': 'aswan',
      'qina': 'qena',
      'suhaj': 'sohag'
    };
    return egMap[normName] || normName;
  }
  if (countryId === 'JP') {
    let cleanName = normName.toLowerCase();
    if (cleanName.endsWith('to')) cleanName = cleanName.slice(0, -2);
    else if (cleanName.endsWith('fu')) cleanName = cleanName.slice(0, -2);
    else if (cleanName.endsWith('ken')) cleanName = cleanName.slice(0, -3);
    
    // exception
    if (cleanName === 'hokkai') return 'hokkaido';
    return cleanName;
  }
  
  if (countryId === 'BR' || countryId === 'GB') {
    return normName;
  }

  if (countryId === 'CA') {
    if (normName.includes('ontario')) return 'CA_ontario';
    if (normName.includes('quebec')) return 'CA_quebec';
    if (normName.includes('britishcolumbia')) return 'CA_britishcolumbia';
    if (normName.includes('alberta')) return 'CA_alberta';
    if (normName.includes('manitoba')) return 'CA_manitoba';
    if (normName.includes('saskatchewan')) return 'CA_saskatchewan';
    if (normName.includes('novascotia')) return 'CA_novascotia';
    if (normName.includes('newbrunswick')) return 'CA_newbrunswick';
    if (normName.includes('newfoundland')) return 'CA_newfoundlandandlabrador';
    if (normName.includes('princeedward')) return 'CA_princeedwardisland';
    return `CA_${normName}`;
  }

  if (countryId === 'AR') {
    if (normName.includes('buenosaires')) return 'AR_buenosaires';
    if (normName.includes('cordoba')) return 'AR_cordoba';
    if (normName.includes('santafe')) return 'AR_santafe';
    if (normName.includes('mendoza')) return 'AR_mendoza';
    if (normName.includes('tucuman')) return 'AR_tucuman';
    if (normName.includes('entrerios')) return 'AR_entrerios';
    if (normName.includes('salta')) return 'AR_salta';
    if (normName.includes('misiones')) return 'AR_misiones';
    if (normName.includes('chaco')) return 'AR_chaco';
    if (normName.includes('corrientes')) return 'AR_corrientes';
    if (normName.includes('santiagodelestero')) return 'AR_santiagodelestero';
    if (normName.includes('jujuy')) return 'AR_jujuy';
    if (normName.includes('formosa')) return 'AR_formosa';
    if (normName.includes('catamarca')) return 'AR_catamarca';
    if (normName.includes('lapampa')) return 'AR_lapampa';
    if (normName.includes('larioja')) return 'AR_larioja';
    if (normName.includes('sanjuan')) return 'AR_sanjuan';
    if (normName.includes('sanluis')) return 'AR_sanluis';
    if (normName.includes('neuquen')) return 'AR_neuquen';
    if (normName.includes('rionegro')) return 'AR_rionegro';
    if (normName.includes('chubut')) return 'AR_chubut';
    if (normName.includes('santacruz')) return 'AR_santacruz';
    if (normName.includes('tierradelfuego')) return 'AR_tierradelfuego';
    if (normName.includes('capitalfederal')) return 'AR_capitalfederal';
    return `AR_${normName}`;
  }
  
  if (countryId === 'KR') {
    if (normName.includes('seoul')) return 'KR_seoul';
    if (normName.includes('busan')) return 'KR_busan';
    if (normName.includes('incheon')) return 'KR_incheon';
    if (normName.includes('daegu')) return 'KR_daegu';
    if (normName.includes('gyeonggi')) return 'KR_gyeonggi';
    if (normName.includes('gyeongsang') && normName.includes('south')) return 'KR_gyeongnam';
    if (normName.includes('gyeongsang') && normName.includes('north')) return 'KR_gyeongbuk';
    if (normName.includes('jeolla') && normName.includes('south')) return 'KR_jeonnam';
    if (normName.includes('jeolla') && normName.includes('north')) return 'KR_jeonbuk';
    if (normName.includes('chungcheong') && normName.includes('south')) return 'KR_chungnam';
    if (normName.includes('chungcheong') && normName.includes('north')) return 'KR_chungbuk';
    return `KR_${normName}`;
  }

  if (countryId === 'ZA') {
    if (normName.includes('orangefreestate') || normName.includes('freestate')) return 'ZA_freestate';
    if (normName.includes('gauteng')) return 'ZA_gauteng';
    if (normName.includes('kwazulunatal') || normName.includes('natal')) return 'ZA_kwazulunatal';
    if (normName.includes('westerncape')) return 'ZA_westerncape';
    if (normName.includes('easterncape')) return 'ZA_easterncape';
    if (normName.includes('limpopo')) return 'ZA_limpopo';
    if (normName.includes('mpumalanga')) return 'ZA_mpumalanga';
    if (normName.includes('northwest')) return 'ZA_northwest';
    if (normName.includes('northerncape')) return 'ZA_northerncape';
    return `ZA_${normName}`;
  }

  if (countryId === 'IN') {
    if (normName.includes('uttarpradesh')) return 'IN_uttarpradesh';
    if (normName.includes('maharashtra')) return 'IN_maharashtra';
    if (normName.includes('westbengal')) return 'IN_westbengal';
    if (normName.includes('bihar')) return 'IN_bihar';
    if (normName.includes('tamilnadu')) return 'IN_tamilnadu';
    if (normName.includes('madhyapradesh')) return 'IN_madhyapradesh';
    if (normName.includes('karnataka')) return 'IN_karnataka';
    if (normName.includes('gujarat')) return 'IN_gujarat';
    if (normName.includes('andhrapradesh')) return 'IN_andhrapradesh';
    if (normName.includes('rajasthan')) return 'IN_rajasthan';
    if (normName.includes('odisha') || normName.includes('orissa')) return 'IN_odisha';
    if (normName.includes('kerala')) return 'IN_kerala';
    if (normName.includes('telangana')) return 'IN_telangana';
    if (normName.includes('assam')) return 'IN_assam';
    if (normName.includes('jharkhand')) return 'IN_jharkhand';
    if (normName.includes('punjab')) return 'IN_punjab';
    if (normName.includes('chhattisgarh')) return 'IN_chhattisgarh';
    if (normName.includes('haryana')) return 'IN_haryana';
    if (normName.includes('jammu')) return 'IN_jammuandkashmir';
    if (normName.includes('uttarakhand')) return 'IN_uttarakhand';
    if (normName.includes('himachal')) return 'IN_himachalpradesh';
    if (normName.includes('tripura')) return 'IN_tripura';
    if (normName.includes('manipur')) return 'IN_manipur';
    if (normName.includes('meghalaya')) return 'IN_meghalaya';
    if (normName.includes('nagaland')) return 'IN_nagaland';
    if (normName.includes('goa')) return 'IN_goa';
    if (normName.includes('arunachal')) return 'IN_arunachalpradesh';
    if (normName.includes('mizoram')) return 'IN_mizoram';
    if (normName.includes('sikkim')) return 'IN_sikkim';
    if (normName.includes('delhi')) return 'IN_delhi';
    return `IN_${normName}`;
  }

  if (countryId === 'MX') {
    if (normName === 'mexico' || normName === 'mexicostate' || normName.includes('estadodemexico')) return 'MX_stateofmexico';
    if (normName.includes('distritofederal') || normName.includes('ciudaddemexico') || normName === 'df') return 'MX_mexicocity';
    if (normName.includes('jalisco')) return 'MX_jalisco';
    if (normName.includes('veracruz')) return 'MX_veracruz';
    if (normName.includes('puebla')) return 'MX_puebla';
    if (normName.includes('guanajuato')) return 'MX_guanajuato';
    if (normName.includes('nuevoleon')) return 'MX_nuevoleon';
    if (normName.includes('chiapas')) return 'MX_chiapas';
    if (normName.includes('michoacan')) return 'MX_michoacan';
    if (normName.includes('oaxaca')) return 'MX_oaxaca';
    if (normName.includes('chihuahua')) return 'MX_chihuahua';
    if (normName.includes('guerrero')) return 'MX_guerrero';
    if (normName.includes('tamaulipas')) return 'MX_tamaulipas';
    if (normName.includes('bajacalifornia') && !normName.includes('sur')) return 'MX_bajacalifornia';
    if (normName.includes('bajacaliforniasur')) return 'MX_bajacaliforniasur';
    if (normName.includes('sinaloa')) return 'MX_sinaloa';
    if (normName.includes('sanluispotosi')) return 'MX_sanluispotosi';
    if (normName.includes('tabasco')) return 'MX_tabasco';
    if (normName.includes('sonora')) return 'MX_sonora';
    if (normName.includes('hidalgo')) return 'MX_hidalgo';
    if (normName.includes('coahuila')) return 'MX_coahuila';
    if (normName.includes('queretaro')) return 'MX_queretaro';
    if (normName.includes('yucatan')) return 'MX_yucatan';
    if (normName.includes('durango')) return 'MX_durango';
    if (normName.includes('zacatecas')) return 'MX_zacatecas';
    if (normName.includes('quintanaroo')) return 'MX_quintanaroo';
    if (normName.includes('nayarit')) return 'MX_nayarit';
    if (normName.includes('tlaxcala')) return 'MX_tlaxcala';
    if (normName.includes('campeche')) return 'MX_campeche';
    if (normName.includes('aguascalientes')) return 'MX_aguascalientes';
    if (normName.includes('colima')) return 'MX_colima';
    return `MX_${normName}`;
  }

  if (countryId === 'IT') {
    const itMap: Record<string, string> = {
      'lombardia': 'lombardy',
      'lombardy': 'lombardy',
      'sicilia': 'sicily',
      'sicily': 'sicily',
      'piemonte': 'piedmont',
      'piedmont': 'piedmont',
      'toscana': 'tuscany',
      'tuscany': 'tuscany',
      'puglia': 'apulia',
      'apulia': 'apulia',
      'lazio': 'lazio',
      'campania': 'campania',
      'veneto': 'veneto',
      'emiliaromagna': 'emiliaromagna',
      'calabria': 'calabria',
      
      'sardignasardegna': 'lazio',
      'sardegna': 'lazio',
      'sardinia': 'lazio',
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
    const mapped = itMap[normName] || normName;
    return `IT_${mapped}`;
  }

  if (countryId === 'ID') {
    const idMap: Record<string, string> = {
      'jawabarat': 'westjava',
      'jawatimur': 'eastjava',
      'jawatengah': 'centraljava',
      'sumaterautara': 'northsumatra',
      'banten': 'banten',
      'jakartaraya': 'jakarta',
      'jakarta': 'jakarta',
      'sulawesiselatan': 'southsulawesi',
      'lampung': 'lampung',
      'sumateraselatan': 'southsumatra',
      'riau': 'riau',
      
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
    const mapped = idMap[normName] || normName;
    return `ID_${mapped}`;
  }

  if (countryId === 'ES') {
    const esMap: Record<string, string> = {
      'almeria': 'andalusia', 'cadiz': 'andalusia', 'cordoba': 'andalusia', 'granada': 'andalusia', 'huelva': 'andalusia', 'jaen': 'andalusia', 'malaga': 'andalusia', 'sevilla': 'andalusia', 'andalucia': 'andalusia', 'andalusia': 'andalusia',
      'barcelona': 'catalonia', 'girona': 'catalonia', 'lleida': 'catalonia', 'tarragona': 'catalonia', 'catalunya': 'catalonia', 'catalonia': 'catalonia',
      'madrid': 'madrid',
      'alicante': 'valencia', 'castellon': 'valencia', 'valencia': 'valencia',
      'acoruna': 'galicia', 'lugo': 'galicia', 'ourense': 'galicia', 'pontevedra': 'galicia', 'galicia': 'galicia',
      'avila': 'castileandleon', 'burgos': 'castileandleon', 'leon': 'castileandleon', 'palencia': 'castileandleon', 'salamanca': 'castileandleon', 'segovia': 'castileandleon', 'soria': 'castileandleon', 'valladolid': 'castileandleon', 'zamora': 'castileandleon', 'castillayleon': 'castileandleon', 'castileandleon': 'castileandleon',
      'alava': 'basquecountry', 'gipuzkoa': 'basquecountry', 'bizkaia': 'basquecountry', 'paisvasco': 'basquecountry', 'basquecountry': 'basquecountry',
      'laspalmas': 'canaryislands', 'santacruzdetenerife': 'canaryislands', 'canarias': 'canaryislands', 'canaryislands': 'canaryislands',
      'albacete': 'castilelamancha', 'ciudadreal': 'castilelamancha', 'cuenca': 'castilelamancha', 'guadalajara': 'castilelamancha', 'toledo': 'castilelamancha', 'castillalamancha': 'castilelamancha', 'castilelamancha': 'castilelamancha',
      'murcia': 'murcia',
      
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
    const mapped = esMap[normName] || normName;
    return `ES_${mapped}`;
  }

  if (countryId === 'AU') {
    if (normName.includes('newsouthwales')) return 'AU_newsouthwales';
    if (normName.includes('victoria')) return 'AU_victoria';
    if (normName.includes('queensland')) return 'AU_queensland';
    if (normName.includes('westernaustralia')) return 'AU_westernaustralia';
    if (normName.includes('southaustralia')) return 'AU_southaustralia';
    if (normName.includes('tasmania')) return 'AU_tasmania';
    if (normName.includes('australiancapitalterritory')) return 'AU_australiancapitalterritory';
    if (normName.includes('northernterritory')) return 'AU_northernterritory';
    return `AU_${normName}`;
  }

  const coreMap: Record<string, string> = {
    'istanbul': 'TR_ist',
    'ankara': 'TR_ank',
    'izmir': 'TR_izm',
    'bursa': 'TR_bur',
    'antalya': 'TR_ant',
    'adana': 'TR_ada',
    'konya': 'TR_kon',
    'gaziantep': 'TR_gaz',
    'sanliurfa': 'TR_san',
    'trabzon': 'TR_tra',
    'diyarbakir': 'TR_diy',
    'hatay': 'TR_hat',
    'eskisehir': 'TR_esk',
    'sivas': 'TR_siv',
    'afyon': 'TR_afyonkarahisar',
    'afyonkarahisar': 'TR_afyonkarahisar'
  };
  return coreMap[normName] || `TR_${normName}`;
};

export const getFeatureName = (feature: any): string => {
  if (!feature) return '';
  if (feature.properties) {
    return feature.properties.shapeName || feature.properties.NAME_1 || 
           feature.properties.nombre || 
           feature.properties.NOMBRE || 
           feature.properties.name || 
           feature.properties.provincia || 
           feature.properties.PROVINCIA || 
           feature.properties.prov_nam || 
           feature.properties.PROV_NAM || 
           feature.properties.state || 
           feature.properties.STATE || 
           feature.properties.nam || 
           feature.properties.NAME || 
           feature.properties.EER13NM || 
           feature.properties['hc-key'] || 
           feature.properties.admin || '';
  }
  return feature.name || '';
};
