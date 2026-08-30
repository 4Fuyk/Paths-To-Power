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

  if (countryId === 'GB') {
    if (normName.includes('northernireland') || normName.includes('ulster') || normName.includes('belfast')) return 'GB_northernireland';
    if (normName.includes('northeast') || normName.includes('newcastle')) return 'GB_northeast';
    if (normName.includes('northwest') || normName.includes('manchester') || normName.includes('liverpool')) return 'GB_northwest';
    if (normName.includes('yorkshire') || normName.includes('leeds') || normName.includes('sheffield')) return 'GB_yorkshireandthehumber';
    if (normName.includes('eastmidlands') || normName.includes('nottingham') || normName.includes('leicester')) return 'GB_eastmidlands';
    if (normName.includes('westmidlands') || normName.includes('birmingham')) return 'GB_westmidlands';
    if (normName.includes('eastern') || normName.includes('eastofengland') || normName.includes('cambridge') || normName.includes('norwich')) return 'GB_eastern';
    if (normName.includes('london') || normName.includes('greaterlondon')) return 'GB_london';
    if (normName.includes('southeast') || normName.includes('surrey') || normName.includes('kent') || normName.includes('oxford')) return 'GB_southeast';
    if (normName.includes('southwest') || normName.includes('bristol') || normName.includes('cornwall') || normName.includes('devon')) return 'GB_southwest';
    if (normName.includes('scotland') || normName.includes('edinburgh') || normName.includes('glasgow')) return 'GB_scotland';
    if (normName.includes('wales') || normName.includes('cardiff') || normName.includes('swansea')) return 'GB_wales';
    return `GB_${normName}`;
  }

  if (countryId === 'FR') {
    if (normName.includes('iledefrance') || normName.includes('paris') || normName === '11') return 'FR_iledefrance';
    if (normName.includes('hautsdefrance') || normName.includes('nord') || normName.includes('lille') || normName.includes('pasdecalais') || normName === '32') return 'FR_hautsdefrance';
    if (normName.includes('auvergne') || normName.includes('rhone') || normName.includes('lyon') || normName.includes('grenoble') || normName === '84') return 'FR_auvergnerhonealpes';
    if (normName.includes('grandest') || normName.includes('alsace') || normName.includes('lorraine') || normName.includes('strasbourg') || normName.includes('champagne') || normName === '44') return 'FR_grandest';
    if (normName.includes('nouvelleaquitaine') || normName.includes('bordeaux') || normName.includes('aquitaine') || normName.includes('poitou') || normName.includes('limousin') || normName === '75') return 'FR_nouvelleaquitaine';
    if (normName.includes('occitanie') || normName.includes('toulouse') || normName.includes('languedoc') || normName.includes('roussillon') || normName.includes('midi') || normName === '76') return 'FR_occitanie';
    if (normName.includes('provence') || normName.includes('marseille') || normName.includes('paca') || normName.includes('cotedazur') || normName.includes('nice') || normName === '93') return 'FR_provencealpescotedazur';
    if (normName.includes('paysdelaloire') || normName.includes('nantes') || normName.includes('loire') || normName === '52') return 'FR_paysdelaloire';
    if (normName.includes('bretagne') || normName.includes('brittany') || normName.includes('rennes') || normName.includes('brest') || normName === '53') return 'FR_bretagne';
    if (normName.includes('normandie') || normName.includes('normandy') || normName.includes('rouen') || normName.includes('caen') || normName === '28') return 'FR_normandie';
    if (normName.includes('bourgogne') || normName.includes('franchecomte') || normName.includes('burgundy') || normName.includes('dijon') || normName.includes('besancon') || normName === '27') return 'FR_bourgognefranchecomte';
    if (normName.includes('centrevaldeloire') || normName.includes('centre') || normName.includes('orleans') || normName.includes('tours') || normName === '24') return 'FR_centrevaldeloire';
    if (normName.includes('corse') || normName.includes('corsica') || normName.includes('ajaccio') || normName.includes('bastia') || normName === '94') return 'FR_corse';
    if (normName.includes('guadeloupe') || normName === '01' || normName === 'glp') return 'FR_guadeloupe';
    if (normName.includes('martinique') || normName === '02' || normName === 'mtq') return 'FR_martinique';
    if (normName.includes('frenchguiana') || normName.includes('guyane') || normName.includes('guiana') || normName === '03' || normName === 'guf') return 'FR_frenchguianaguyane';
    if (normName.includes('reunion') || normName.includes('lareunion') || normName === '04' || normName === 'reu') return 'FR_lareunion';
    if (normName.includes('mayotte') || normName === '06' || normName === 'myt') return 'FR_mayotte';
    if (normName.includes('etranger') || normName.includes('francaisdeletranger') || normName.includes('expat')) return 'FR_francaisdeletranger';
    if (normName.includes('algerie') || normName.includes('algeria') || normName.includes('oran') || normName.includes('constantine') || normName === 'dza') return 'FR_algeriefrancaisealgiersoranconstantine';
    return `FR_${normName}`;
  }

  if (countryId === 'RO') {
    return `RO_${normName}`;
  }

  if (countryId === 'HU') {
    return `HU_${normName}`;
  }

  if (countryId === 'SU') {
    if (normName.includes('russia') || normName.includes('moscow') || normName.includes('leningrad') || normName === 'rus') return 'SU_russiansfsrmoscowleningrad';
    if (normName.includes('ukrain') || normName.includes('kyiv') || normName.includes('kharkiv') || normName === 'ukr') return 'SU_ukrainianssrkyivkharkiv';
    if (normName.includes('belarus') || normName.includes('byelorussia') || normName.includes('minsk') || normName === 'blr') return 'SU_byelorussianssrminsk';
    if (normName.includes('kazakh') || normName.includes('almaata') || normName === 'kaz') return 'SU_kazakhssralmaata';
    if (normName.includes('uzbek') || normName.includes('tashkent') || normName === 'uzb') return 'SU_uzbekssrtashkent';
    if (normName.includes('georgia') || normName.includes('armenia') || normName.includes('azerbaijan') || normName.includes('transcaucas') || normName === 'geo' || normName === 'arm' || normName === 'aze') return 'SU_transcaucasianssrsgeorgiaarmeniaazerbaijan';
    if (normName.includes('estonia') || normName.includes('latvia') || normName.includes('lithuania') || normName.includes('baltic') || normName === 'est' || normName === 'lva' || normName === 'ltu') return 'SU_balticssrsestonialatvialithuania';
    if (normName.includes('turkmen') || normName.includes('tajik') || normName.includes('kyrgyz') || normName.includes('centralasia') || normName === 'tkm' || normName === 'tjk' || normName === 'kgz') return 'SU_centralasianssrsturkmenistantajikistankyrgyzstan';
    if (normName.includes('moldav') || normName.includes('moldova') || normName.includes('chisinau') || normName === 'mda') return 'SU_moldavianssrchisinau';
    return `SU_${normName}`;
  }

  if (countryId === 'YU') {
    if (normName.includes('kosovo') || normName === 'kos' || normName === 'kvx') return 'YU_autonomousregionofkosovoandmetohijapristina';
    if (normName.includes('vojvodina') || normName.includes('novisad')) return 'YU_autonomousprovinceofvojvodinanovisad';
    if (normName.includes('serbia') || normName.includes('belgrade') || normName.includes('nis') || normName === 'srb') return 'YU_prserbiabelgradenis';
    if (normName.includes('croatia') || normName.includes('zagreb') || normName.includes('split') || normName === 'hrv') return 'YU_prcroatiazagrebsplit';
    if (normName.includes('slovenia') || normName.includes('ljubljana') || normName === 'svn') return 'YU_prslovenialjubljana';
    if (normName.includes('bosnia') || normName.includes('herzegovina') || normName.includes('sarajevo') || normName === 'bih') return 'YU_prbosniaandherzegovinasarajevo';
    if (normName.includes('macedonia') || normName.includes('skopje') || normName === 'mkd') return 'YU_prmacedoniaskopje';
    if (normName.includes('montenegro') || normName.includes('titograd') || normName === 'mne') return 'YU_prmontenegrotitograd';
    return `YU_${normName}`;
  }

  if (countryId === 'CS') {
    if (normName.includes('prague') || normName.includes('centralbohemia') || normName === 'cze') return 'CS_praguecentralbohemia';
    if (normName.includes('moravia') || normName.includes('silesia') || normName.includes('brno') || normName.includes('ostrava')) return 'CS_moraviasilesiabrnoostrava';
    if (normName.includes('westernbohemia') || normName.includes('plzen') || normName.includes('usti')) return 'CS_westernnorthernbohemiaplzenusti';
    if (normName.includes('easternbohemia') || normName.includes('hradec')) return 'CS_easternbohemiahradeckralove';
    if (normName.includes('westernslovakia') || normName.includes('bratislava') || normName === 'svk') return 'CS_westernslovakiabratislavatrnava';
    if (normName.includes('easternslovakia') || normName.includes('kosice') || normName.includes('banska')) return 'CS_centraleasternslovakiabanskabystricakosice';
    return `CS_${normName}`;
  }

  if (countryId === 'DDR') {
    if (normName.includes('berlin')) return 'DDR_eastberlincapital';
    if (normName.includes('sachsen') || normName.includes('saxony') || normName.includes('dresden') || normName.includes('leipzig')) return 'DDR_saxonyleipzigdresden';
    if (normName.includes('thuringen') || normName.includes('thuringia') || normName.includes('erfurt') || normName.includes('weimar')) return 'DDR_thuringiaerfurtweimar';
    if (normName.includes('anhalt') || normName.includes('magdeburg') || normName.includes('halle')) return 'DDR_saxonyanhaltmagdeburghalle';
    if (normName.includes('brandenburg') || normName.includes('potsdam') || normName.includes('cottbus')) return 'DDR_brandenburgpotsdamcottbus';
    if (normName.includes('mecklenburg') || normName.includes('rostock') || normName.includes('schwerin')) return 'DDR_mecklenburgrostockschwerin';
    return `DDR_${normName}`;
  }

  if (countryId === 'PL') {
    if (normName.includes('warsaw') || normName.includes('mazow') || normName.includes('masovia') || normName === 'pol') return 'PL_warsawcapitalregionmasovia';
    if (normName.includes('slask') || normName.includes('silesia') || normName.includes('katowice')) return 'PL_silesiakatowiceindustrialbasin';
    if (normName.includes('krakow') || normName.includes('malopol') || normName.includes('lesser')) return 'PL_lesserpolandkrakow';
    if (normName.includes('poznan') || normName.includes('wielkopol') || normName.includes('greater')) return 'PL_greaterpolandpoznan';
    if (normName.includes('gdansk') || normName.includes('pomor') || normName.includes('pomerania')) return 'PL_pomeraniagdanskmaritime';
    if (normName.includes('wroclaw') || normName.includes('dolnosl')) return 'PL_lowersilesiawroclaw';
    if (normName.includes('lodz')) return 'PL_lodzmanufacturingcenter';
    return `PL_${normName}`;
  }

  if (countryId === 'RU') {
    return `RU_${normName}`;
  }

  if (countryId === 'UA') {
    if (normName.includes('kyiv') || normName.includes('kiev')) return 'UA_kyiv';
    if (normName.includes('kharkiv') || normName.includes('sumy') || normName.includes('poltava')) return 'UA_kharkiv';
    if (normName.includes('odesa') || normName.includes('odessa') || normName.includes('mykolaiv') || normName.includes('kherson')) return 'UA_odesa';
    if (normName.includes('dnipro') || normName.includes('zaporizhzhia') || normName.includes('kryvyi')) return 'UA_dnipro';
    if (normName.includes('lviv') || normName.includes('ivano') || normName.includes('ternopil') || normName.includes('volyn') || normName.includes('rivne')) return 'UA_lviv';
    if (normName.includes('donetsk') || normName.includes('luhansk') || normName.includes('donbas')) return 'UA_donbas';
    return `UA_${normName}`;
  }

  if (countryId === 'CL') {
    return `CL_${normName}`;
  }

  if (countryId === 'SE') {
    if (normName.includes('stockholm')) return 'SE_stockholmlan';
    if (normName.includes('vastra') || normName.includes('goteborg') || normName.includes('gothenburg')) return 'SE_vastragotaland';
    if (normName.includes('skane') || normName.includes('malmo')) return 'SE_skane';
    if (normName.includes('ostergotland') || normName.includes('jonkoping') || normName.includes('kronoberg') || normName.includes('kalmar') || normName.includes('blekinge') || normName.includes('halland') || normName.includes('gotland') || normName.includes('sodermanland')) return 'SE_svealandgotaland';
    if (normName.includes('norrbotten') || normName.includes('vasterbotten') || normName.includes('jamtland') || normName.includes('vasternorrland') || normName.includes('gavleborg') || normName.includes('dalarna') || normName.includes('varmland') || normName.includes('norre')) return 'SE_norrlandnorth';
    return `SE_${normName}`;
  }

  if (countryId === 'PT') {
    return `PT_${normName}`;
  }

  if (countryId === 'GR') {
    if (normName.includes('attica') || normName.includes('attiki') || normName.includes('athens') || normName.includes('piraeus')) return 'GR_atticaathenspiraeus';
    if (normName.includes('macedonia') || normName.includes('thessaloniki') || normName.includes('thrace') || normName.includes('kentriki')) return 'GR_centralmacedoniathessaloniki';
    if (normName.includes('crete') || normName.includes('kriti')) return 'GR_crete';
    if (normName.includes('thessaly') || normName.includes('thessalia') || normName.includes('epirus') || normName.includes('ipiros') || normName.includes('sterea')) return 'GR_thessalyepirus';
    if (normName.includes('peloponnese') || normName.includes('peloponnisos') || normName.includes('west greece') || normName.includes('dytiki')) return 'GR_peloponnesewestgreece';
    if (normName.includes('aegean') || normName.includes('ionian') || normName.includes('voreio') || normName.includes('notio') || normName.includes('ionia')) return 'GR_aegeanionianislands';
    return `GR_${normName}`;
  }

  if (countryId === 'IS') {
    return `IS_${normName}`;
  }

  if (countryId === 'TW') {
    if (normName.includes('taipei') || normName.includes('keelung')) return 'TW_greaternorthtaipei';
    if (normName.includes('taichung') || normName.includes('changhua') || normName.includes('miaoli') || normName.includes('nantou')) return 'TW_centraltaichung';
    if (normName.includes('kaohsiung') || normName.includes('tainan') || normName.includes('pingtung') || normName.includes('chiayi')) return 'TW_southkaohsiungtainan';
    if (normName.includes('yilan') || normName.includes('hualien') || normName.includes('taitung') || normName.includes('penghu') || normName.includes('kinmen') || normName.includes('matsu')) return 'TW_easthualientaitung';
    return `TW_${normName}`;
  }

  if (countryId === 'SA') {
    if (normName.includes('riyadh')) return 'SA_riyadhcapitalprovince';
    if (normName.includes('makkah') || normName.includes('mecca') || normName.includes('jeddah')) return 'SA_makkahjeddahwestern';
    if (normName.includes('eastern') || normName.includes('dammam') || normName.includes('khobar') || normName.includes('sharqiyah')) return 'SA_easternprovinceoilbasin';
    if (normName.includes('madinah') || normName.includes('medina') || normName.includes('tabuk') || normName.includes('jawf') || normName.includes('hudud')) return 'SA_medinatabuknorth';
    if (normName.includes('asir') || normName.includes('jizan') || normName.includes('najran') || normName.includes('bahah')) return 'SA_asirjizansouth';
    return `SA_${normName}`;
  }

  if (countryId === 'IR') {
    if (normName.includes('tehran') || normName.includes('alborz') || normName.includes('karaj') || normName.includes('qom')) return 'IR_tehrancapitalregion';
    if (normName.includes('khorasan') || normName.includes('mashhad') || normName.includes('semnan')) return 'IR_razavikhorasanmashhad';
    if (normName.includes('isfahan') || normName.includes('fars') || normName.includes('shiraz') || normName.includes('yazd') || normName.includes('kerman')) return 'IR_isfahanfarsheritage';
    if (normName.includes('azerbaijan') || normName.includes('tabriz') || normName.includes('ardabil') || normName.includes('zanjan') || normName.includes('gilan') || normName.includes('mazandaran')) return 'IR_northtabrizcaspian';
    if (normName.includes('khuzestan') || normName.includes('hormozgan') || normName.includes('bushehr') || normName.includes('sistan') || normName.includes('baluchestan') || normName.includes('kermanshah') || normName.includes('kurdistan') || normName.includes('lorestan') || normName.includes('ilam')) return 'IR_southkhuzestanoilgulf';
    return `IR_${normName}`;
  }

  if (countryId === 'IL') {
    if (normName.includes('tel aviv') || normName.includes('dan')) return 'IL_telavivmetropolitan';
    if (normName.includes('jerusalem') || normName.includes('yerushalayim')) return 'IL_jerusalemcapital';
    if (normName.includes('central') || normName.includes('merkaz') || normName.includes('petah') || normName.includes('rishon')) return 'IL_centralmerkazsharon';
    if (normName.includes('haifa') || normName.includes('north') || normName.includes('tzafon') || normName.includes('galilee') || normName.includes('golan')) return 'IL_haifanorthgalilee';
    if (normName.includes('south') || normName.includes('darom') || normName.includes('beer') || normName.includes('negev') || normName.includes('eilat')) return 'IL_southdaromnegev';
    return `IL_${normName}`;
  }

  if (countryId === 'PS') {
    if (normName.includes('gaza') || normName.includes('khan') || normName.includes('rafah')) return 'PS_gazastrip';
    if (normName.includes('jerusalem') || normName.includes('quds') || normName.includes('ramallah') || normName.includes('al-bireh') || normName.includes('bethlehem')) return 'PS_centralwestbankramallahquds';
    if (normName.includes('hebron') || normName.includes('khalil')) return 'PS_southernwestbankhebron';
    if (normName.includes('nablus') || normName.includes('jenin') || normName.includes('tulkarm') || normName.includes('qalqilya') || normName.includes('salfit') || normName.includes('tubas') || normName.includes('jericho')) return 'PS_northernwestbanknablusjenin';
    return `PS_${normName}`;
  }

  if (countryId === 'CN') {
    if (normName.includes('beijing') || normName.includes('tianjin') || normName.includes('hebei')) return 'CN_northchinabeijingtianjin';
    if (normName.includes('shanghai') || normName.includes('jiangsu') || normName.includes('zhejiang')) return 'CN_eastchinashanghai';
    if (normName.includes('guangdong') || normName.includes('guangxi') || normName.includes('canton')) return 'CN_southchinaguangdong';
    if (normName.includes('hubei') || normName.includes('hunan') || normName.includes('henan')) return 'CN_centralchinawuhan';
    if (normName.includes('sichuan') || normName.includes('chongqing')) return 'CN_southwestsichuan';
    if (normName.includes('heilongjiang') || normName.includes('jilin') || normName.includes('liaoning')) return 'CN_northeastmanchuria';
    if (normName.includes('shaanxi') || normName.includes('gansu') || normName.includes('xinjiang')) return 'CN_northwestchinayanansilkroad';
    return `CN_${normName}`;
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
  if (countryId === 'TR' || !countryId) {
    return coreMap[normName] || `TR_${normName}`;
  }
  return `${countryId}_${normName}`;
};

export const getFeatureName = (feature: any): string => {
  if (!feature) return '';
  if (feature.properties) {
    return feature.properties.name_latin || 
           feature.properties.NAME_LATIN || 
           feature.properties.name_en || 
           feature.properties.NAME_EN || 
           feature.properties.shapeName || 
           feature.properties.NAME_1 || 
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
           feature.properties.VARNAME_1 ||
           feature.properties.ADM1_EN ||
           feature.properties.adm1_name ||
           feature.properties.EER13NM || 
           feature.properties['hc-key'] || 
           feature.properties.admin || '';
  }
  return feature.name || '';
};
