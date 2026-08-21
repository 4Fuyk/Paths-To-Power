/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { Country, Region, Party, VoterGroup, SpeechCard, SpeechChoice } from '../types';
import { SPEECH_CARDS_POOL, getDeterministicMayorName } from '../constants/countries';
import { getPartyGovernorForRegion, syncRegionOwnersAndMayors } from '../utils/mayorUtils';
import { 
  Megaphone, MapPin, Coins, Users, Landmark, 
  HelpCircle, BarChart3, ChevronRight, CheckCircle, Flame,
  ZoomIn, ZoomOut
} from 'lucide-react';
import { normalizeName, getRegionIdFromNormalizedName, getFeatureName } from '../utils/mapUtils';

interface CampaignViewProps {
  country: Country;
  party: Party;
  onUpdateCountry: (updatedCountry: Country) => void;
  onUpdateParty: (updatedParty: Party) => void;
  onSpendTurn: () => void;
  darkMode: boolean;
}

// Map GIS Coordinates representing actual geographical locations in Turkey
const TURKEY_MAP_MUNICIPALITIES_GEOGRAPHIC = [
  { id: 'TR_ist', name: 'İstanbul', lat: 41.0082, lng: 28.9784 },
  { id: 'TR_ank', name: 'Ankara', lat: 39.9334, lng: 32.8597 },
  { id: 'TR_izm', name: 'İzmir', lat: 38.4192, lng: 27.1287 },
  { id: 'TR_bur', name: 'Bursa', lat: 40.1885, lng: 29.0610 },
  { id: 'TR_ant', name: 'Antalya', lat: 36.8969, lng: 30.7133 },
  { id: 'TR_ada', name: 'Adana', lat: 37.0000, lng: 35.3213 },
  { id: 'TR_kon', name: 'Konya', lat: 37.8714, lng: 32.4846 },
  { id: 'TR_gaz', name: 'Gaziantep', lat: 37.0662, lng: 37.3833 },
  { id: 'TR_san', name: 'Şanlıurfa', lat: 37.1591, lng: 38.7969 },
  { id: 'TR_tra', name: 'Trabzon', lat: 41.0015, lng: 39.7178 },
  { id: 'TR_diy', name: 'Diyarbakır', lat: 37.9144, lng: 40.2306 },
  { id: 'TR_hat', name: 'Hatay', lat: 36.4018, lng: 36.3498 },
  { id: 'TR_esk', name: 'Eskişehir', lat: 39.7767, lng: 30.5206 },
  { id: 'TR_siv', name: 'Sivas', lat: 39.7477, lng: 37.0179 }
];

const MAYOR_AVATARS: Record<string, string> = {
  'TR_ist': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ekrem_%C4%B0mamo%C4%9Flu_%28April_2024%29_%28cropped%29.jpg/320px-Ekrem_%C4%B0mamo%C4%9Flu_%28April_2024%29_%28cropped%29.jpg', // Ekrem İmamoğlu
  'TR_ank': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Mansur_Yava%C5%9F_2022.jpg/320px-Mansur_Yava%C5%9F_2022.jpg', // Mansur Yavaş
  'TR_izm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Cemil_Tugay_April_2024_%28cropped%29.jpg/320px-Cemil_Tugay_April_2024_%28cropped%29.jpg', // Cemil Tugay
  'TR_bur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Mustafa_Bozbey_%28cropped%29.jpg/320px-Mustafa_Bozbey_%28cropped%29.jpg', // Mustafa Bozbey
  'TR_ant': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Muhittin_B%C3%B6cek_2019.jpg', // Muhittin Böcek
  'TR_ada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Zeydan_Karalar.jpg/320px-Zeydan_Karalar.jpg', // Zeydan Karalar
  'TR_kon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/U%C4%9Fur_%C4%B0brahim_Altay_%28cropped%29.jpg/320px-U%C4%9Fur_%C4%B0brahim_Altay_%28cropped%29.jpg', // Uğur İbrahim Altay
  'TR_gaz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Fatma_%C5%9Eahin_2017_%28cropped%29.jpg/320px-Fatma_%C5%9Eahin_2017_%28cropped%29.jpg', // Fatma Şahin
  'TR_san': 'https://upload.wikimedia.org/wikipedia/commons/7/77/Mehmet_Kas%C4%B1m_G%C3%BClp%C4%B1nar_TBMM.jpg', // Mehmet Kasım Gülpınar
  'TR_tra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ahmet_Metin_Gen%C3%A7_%28cropped%29.jpg/320px-Ahmet_Metin_Gen%C3%A7_%28cropped%29.jpg', // Ahmet Metin Genç
  'TR_diy': 'https://upload.wikimedia.org/wikipedia/commons/0/07/Serra_Bucak.jpg', // Ayşe Serra Bucak Küçük
  'TR_hat': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Mehmet_%C3%96nt%C3%BCrk_TBMM.jpg', // Mehmet Öntürk
  'TR_esk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Ay%C5%9Fe_%C3%9Cnl%C3%BCce_April_2024_%28cropped%29.jpg/320px-Ay%C5%9Fe_%C3%9Cnl%C3%BCce_April_2024_%28cropped%29.jpg', // Ayşe Ünlüce
  'TR_siv': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Adem_Uzun_%28cropped%29.jpg', // Adem Uzun
};



const getPartyAcronym = (pName: string): string => {
  if (!pName) return '';
  const lower = pName.toLowerCase();
  if (lower.startsWith('cdu')) return 'CDU';
  if (lower.startsWith('afd')) return 'AFD';
  if (lower.startsWith('spd')) return 'SPD';
  if (lower.includes('grüne') || lower.includes('green')) return 'GRÜ';
  if (lower.includes('linke')) return 'LIN';
  if (lower.startsWith('bsw')) return 'BSW';
  if (lower.startsWith('fdp')) return 'FDP';
  if (lower.startsWith('ssw')) return 'SSW';
  
  // Default clean extraction
  const clean = pName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').slice(0, 3).toUpperCase();
};



const TURKEY_PLATE_CODES: Record<string, string> = {
  'adana': '01', 'adiyaman': '02', 'afyonkarahisar': '03', 'afyon': '03', 'agri': '04',
  'amasya': '05', 'ankara': '06', 'antalya': '07', 'artvin': '08', 'aydin': '09',
  'balikesir': '10', 'bilecik': '11', 'bingol': '12', 'bitlis': '13', 'bolu': '14',
  'burdur': '15', 'bursa': '16', 'canakkale': '17', 'cankiri': '18', 'corum': '19',
  'denizli': '20', 'diyarbakir': '21', 'edirne': '22', 'elazig': '23', 'erzincan': '24',
  'erzurum': '25', 'eskisehir': '26', 'gaziantep': '27', 'giresun': '28', 'gumushane': '29',
  'hakkari': '30', 'hatay': '31', 'isparta': '32', 'mersin': '33', 'icel': '33',
  'istanbul': '34', 'izmir': '35', 'kars': '36', 'kastamonu': '37', 'kayseri': '38',
  'kirklareli': '39', 'kirsehir': '40', 'kocaeli': '41', 'konya': '42', 'kutahya': '43',
  'malatya': '44', 'manisa': '45', 'kahramanmaras': '46', 'mardin': '47', 'mugla': '48',
  'mus': '49', 'nevsehir': '50', 'nigde': '51', 'ordu': '52', 'rize': '53',
  'sakarya': '54', 'samsun': '55', 'siirt': '56', 'sinop': '57', 'sivas': '58',
  'tekirdag': '59', 'tokat': '60', 'trabzon': '61', 'tunceli': '62', 'sanliurfa': '63',
  'usak': '64', 'van': '65', 'yozgat': '66', 'zonguldak': '67', 'aksaray': '68',
  'bayburt': '69', 'karaman': '70', 'kirikkale': '71', 'batman': '72', 'sirnak': '73',
  'bartin': '74', 'ardahan': '75', 'igdir': '76', 'yalova': '77', 'karabuk': '78',
  'kilis': '79', 'osmaniye': '80', 'duzce': '81'
};

const getPlateCodeForRegion = (region: any): string => {
  if (!region) return '06';
  const normName = normalizeName(region.name);
  let cityCode = TURKEY_PLATE_CODES[normName] || '';
  if (!cityCode) {
    const numericId = parseInt(region.id.replace(/\D/g, ''), 10);
    if (!isNaN(numericId) && numericId >= 1 && numericId <= 81) {
      cityCode = String(numericId).padStart(2, '0');
    } else {
      cityCode = '06';
    }
  }
  return String(cityCode).padStart(2, '0');
};

let cachedAllDistrictsGeoJson: any = null;
let allDistrictsGeoJsonPromise: Promise<any> | null = null;

export const CampaignView: React.FC<CampaignViewProps> = ({
  country,
  party,
  onUpdateCountry,
  onUpdateParty,
  onSpendTurn,
  darkMode,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(country.regions[0]);
  const [activeSpeechCard, setActiveSpeechCard] = useState<SpeechCard | null>(null);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);
  const [hoveredMapRegion, setHoveredMapRegion] = useState<Region | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [worldGeoJsonData, setWorldGeoJsonData] = useState<any>(null);
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json")
      .then(res => res.json())
      .then(data => setWorldGeoJsonData(data))
      .catch(err => console.error("Failed to load world geojson", err));
  }, []);
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState<any>(null);
  // Check for missing regions in geojson and add them dynamically
  useEffect(() => {
    if (!geoJsonData || !geoJsonData.features) return;
    
    let hasChanges = false;
    const newRegions = [...country.regions];
    
    const playerStart = 2;

    geoJsonData.features.forEach((feature: any) => {
       if (feature.properties?.isDistrict) return;

       const fName = getFeatureName(feature);
       if (!fName) return;
       
       const normName = normalizeName(fName);
       const regionId = getRegionIdFromNormalizedName(normName, country.id);
       if (!regionId) return; // Do NOT add unmapped sea/ocean features as regions!
       
       const exists = newRegions.find(r => r.id === regionId || normalizeName(r.id) === normName || normalizeName(r.name) === normName);
       
       if (!exists) {
         hasChanges = true;
         
         const supports: Record<string, number> = {};
         supports[party.id] = playerStart;
         
         const totalRivalBase = country.rivals.reduce((sum, r) => sum + r.baseSupport, 0);
         let sharedRemaining = 100 - playerStart;
         country.rivals.forEach((rival) => {
           const share = rival.baseSupport / totalRivalBase;
           supports[rival.id] = share * sharedRemaining;
         });
         
         // Normalize sum to 100
         const currentSum = Object.values(supports).reduce((s, v) => s + v, 0);
         if (Math.abs(currentSum - 100) > 0.1) {
           const factor = 100 / currentSum;
           Object.keys(supports).forEach(k => {
             supports[k] = supports[k] * factor;
           });
         }

         let leadingPartyId = party.id;
         let maxSupport = supports[party.id];
         Object.entries(supports).forEach(([pid, val]) => {
           if (val > maxSupport) {
             maxSupport = val;
             leadingPartyId = pid;
           }
         });

         newRegions.push({
            id: regionId,
            name: fName,
            seats: 5, // Default generic seat count
            voterDistribution: {
                "Working Class": 20,
                "Middle Class": 20,
                "Upper Class": 20,
                "Youth": 20,
                "Elderly": 10,
                "Rural": 10
            },
            supports: supports,
            infrastructure: 1,
            campaignLevel: 0,
            ownerPartyId: leadingPartyId,
            mayorName: ""
         });
       }
    });

    if (hasChanges) {
      onUpdateCountry({ ...country, regions: newRegions });
    }
  }, [geoJsonData]);

  const [loadingDistrictGeoJson, setLoadingDistrictGeoJson] = useState<boolean>(false);
  const [customAlert, setCustomAlert] = useState<{ title: string; message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const [activeViewLevel, setActiveViewLevel] = useState<'province' | 'district'>('province');
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const provinceCentersRef = React.useRef<Record<string, { lat: number; lng: number }>>({});
  const selectedRegionBoundsRef = React.useRef<L.LatLngBounds | null>(null);
  const lastSelectedRegionIdRef = React.useRef<string | null>(null);
  const lastFetchedCityCodeRef = React.useRef<string | null>(null);

  const regionLabel = country.id === 'DE' ? 'State' : country.id === 'US' ? 'Region' : 'Province';
  const regionsLabel = country.id === 'DE' ? 'States' : country.id === 'US' ? 'Regions' : 'Provinces';

  const getProvinceBoundsEstimate = (regName: string, center: { lat: number; lng: number }) => {
    const norm = regName.toLowerCase()
      .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z]/g, '');
    
    let spanLng = 0.8;
    let spanLat = 0.5;
    
    if (norm.includes('istanbul')) {
      spanLng = 1.6;
      spanLat = 0.5;
    } else if (norm.includes('ankara')) {
      spanLng = 1.5;
      spanLat = 1.0;
    } else if (norm.includes('izmir')) {
      spanLng = 1.2;
      spanLat = 1.0;
    } else if (norm.includes('antalya')) {
      spanLng = 2.4;
      spanLat = 0.8;
    } else if (norm.includes('sivas') || norm.includes('konya') || norm.includes('erzurum') || norm.includes('sanliurfa') || norm.includes('van')) {
      spanLng = 1.5;
      spanLat = 1.0;
    }
    
    return {
      xMin: center.lng - spanLng / 2,
      xMax: center.lng + spanLng / 2,
      yMin: center.lat - spanLat / 2,
      yMax: center.lat + spanLat / 2,
    };
  };

  const isPointInPolygon = (pt: [number, number], poly: number[][]): boolean => {
    const x = pt[0], y = pt[1];
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const selectEvenPoints = (candidates: [number, number][], count: number, center: [number, number]): [number, number][] => {
    if (candidates.length <= count) return candidates;
    const selected: [number, number][] = [];
    
    let bestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < candidates.length; i++) {
      const dx = candidates[i][0] - center[0];
      const dy = candidates[i][1] - center[1];
      const d = dx*dx + dy*dy;
      if (d < minDist) {
        minDist = d;
        bestIdx = i;
      }
    }
    selected.push(candidates[bestIdx]);
    
    while (selected.length < count) {
      let maxCDist = -1;
      let bestCandIdx = -1;
      for (let i = 0; i < candidates.length; i++) {
        const cand = candidates[i];
        let minSLink = Infinity;
        for (let j = 0; j < selected.length; j++) {
          const sel = selected[j];
          const dx = cand[0] - sel[0];
          const dy = cand[1] - sel[1];
          const d = dx*dx + dy*dy;
          if (d < minSLink) {
            minSLink = d;
          }
        }
        if (minSLink > maxCDist) {
          maxCDist = minSLink;
          bestCandIdx = i;
        }
      }
      if (bestCandIdx === -1) break;
      selected.push(candidates[bestCandIdx]);
    }
    return selected;
  };

  const getDeterministicDistricts = (reg: Region, center: { lat: number; lng: number }): any[] => {
    const seed = reg.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const myRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const TURKEY_REAL_DISTRICTS: Record<string, string[]> = {
      'istanbul': [
        'Silivri', 'Çatalca', 'Büyükçekmece', 'Beylikdüzü', 'Esenyurt', 'Arnavutköy',
        'Avcılar', 'Başakşehir', 'Küçükçekmece', 'Bağcılar', 'Bakırköy', 'Esenler',
        'Zeytinburnu', 'Güngören', 'Bahçelievler', 'Bayrampaşa', 'Gaziosmanpaşa', 'Sultangazi',
        'Fatih', 'Eyüpsultan', 'Beyoğlu', 'Şişli', 'Kağıthane', 'Beşiktaş', 'Sarıyer',
        'Beykoz', 'Üsküdar', 'Ümraniye', 'Kadıköy', 'Ataşehir', 'Çekmeköy', 'Sancaktepe',
        'Maltepe', 'Sultanbeyli', 'Kartal', 'Pendik', 'Tuzla', 'Şile', 'Adalar'
      ],
      'ankara': [
        'Nallıhan', 'Beypazarı', 'Güdül', 'Ayaş', 'Polatlı', 'Haymana',
        'Sincan', 'Etimesgut', 'Yenimahalle', 'Çankaya', 'Mamak', 'Altındağ',
        'Keçiören', 'Pursaklar', 'Gölbaşı', 'Akyurt', 'Çubuk', 'Kazan',
        'Elmadağ', 'Kızılcahamam', 'Şereflikoçhisar', 'Bala', 'Kalecik', 'Çamlıdere', 'Evren'
      ],
      'izmir': [
        'Çeşme', 'Karaburun', 'Urla', 'Seferihisar', 'Menderes', 'Selçuk',
        'Narlıdere', 'Güzelbahçe', 'Balçova', 'Gaziemir', 'Karabağlar', 'Konak',
        'Buca', 'Bornova', 'Bayraklı', 'Karşıyaka', 'Çiğli', 'Menemen',
        'Foça', 'Aliağa', 'Torbalı', 'Kemalpaşa', 'Tire', 'Ödemiş',
        'Bayındır', 'Bergama', 'Dikili', 'Kınık', 'Kiraz', 'Beydağ'
      ],
      'antalya': [
        'Kaş', 'Demre', 'Finike', 'Elmalı', 'Kumluca', 'Kemer',
        'Konyaaltı', 'Korkuteli', 'Kepez', 'Muratpaşa', 'Döşemealtı', 'Aksu',
        'Serik', 'Manavgat', 'İbradı', 'Akseki', 'Alanya', 'Gündoğmuş', 'Gazipaşa'
      ],
      'bursa': [
        'Karacabey', 'Mustafakemalpaşa', 'Mudanya', 'Nilüfer', 'Osmangazi', 'Yıldırım',
        'Gürsu', 'Kestel', 'Gemlik', 'Orhangazi', 'İnegöl', 'Yenişehir', 'İznik',
        'Keles', 'Orhaneli', 'Büyükorhan', 'Harmancık'
      ],
      'adana': [
        'Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam', 'Kozan', 'Ceyhan',
        'İmamoğlu', 'Karataş', 'Pozantı', 'Karaisalı', 'Feke', 'Aladağ',
        'Saimbeyli', 'Tufanbeyli', 'Yumurtalık'
      ],
      'sivas': [
        'Merkez', 'Şarkışla', 'Divriği', 'Zara', 'Kangal', 'Suşehri',
        'Yıldızeli', 'Gürün', 'Gemerek', 'Koyulhisar', 'Ulaş', 'Altınyayla',
        'Doğanşar', 'Gölova', 'Hafik', 'İmranlı', 'Akıncılar'
      ],
      'tokat': [
        'Merkez', 'Erbaa', 'Turhal', 'Niksar', 'Zile', 'Reşadiye',
        'Almus', 'Pazar', 'Yeşilyurt', 'Artova', 'Sulusaray', 'Başçiftlik'
      ],
      'konya': [
        'Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir', 'Beyşehir',
        'Seydişehir', 'Ilgın', 'Cihanbeyli', 'Kulu', 'Karapınar', 'Çumra',
        'Kadınhanı', 'Sarayönü', 'Bozkır', 'Yunak', 'Doğanhisar', 'Hüyük',
        'Altınekin', 'Hadim', 'Çeltik', 'Güneysınır', 'Emirgazi', 'Tuzlukçu',
        'Derebucak', 'Akören', 'Taşkent', 'Yalıhüyük', 'Derbent', 'Halkapınar', 'Ahırlı'
      ],
      'gaziantep': ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Oğuzeli', 'Araban', 'Nurdağı', 'Karkamış', 'Yavuzeli'],
      'sanliurfa': [
        'Haliliye', 'Eyyübiye', 'Karaköprü', 'Siverek', 'Viranşehir', 'Birecik',
        'Suruç', 'Akçakale', 'Ceylanpınar', 'Harran', 'Bozova', 'Hilvan', 'Halfeti'
      ],
      'trabzon': [
        'Ortahisar', 'Akçaabat', 'Araklı', 'Of', 'Yomra', 'Sürmene',
        'Maçka', 'Arsin', 'Vakfıkebir', 'Beşikdüzü', 'Tonya', 'Çaykara',
        'Çarşıbaşı', 'Düzköy', 'Hayrat', 'Köprübaşı', 'Şalpazarı', 'Dernekpazarı'
      ],
      'diyarbakir': [
        'Kayapınar', 'Bağlar', 'Yenişehir', 'Sur', 'Ergani', 'Bismil',
        'Silvan', 'Lice', 'Kulp', 'Hani', 'Dicle', 'Çermik', 'Eğil',
        'Çüngüş', 'Hazro', 'Kocaköy', 'Çınar'
      ],
      'hatay': [
        'Antakya', 'İskenderun', 'Defne', 'Samandağ', 'Kırıkhan', 'Reyhanlı',
        'Dörtyol', 'Erzin', 'Payas', 'Altınözü', 'Arsuz', 'Hassa', 'Belen',
        'Kumlu', 'Yayladağı'
      ],
      'eskisehir': [
        'Odunpazarı', 'Tepebaşı', 'Sivrihisar', 'Çifteler', 'Mahmudiye', 'Alpu',
        'Mihalıççık', 'Seyitgazi', 'Günyüzü', 'Beylikova', 'Han', 'İnönü',
        'Mihalgazi', 'Sarıcakaya'
      ],
      'afyon': [
        'Merkez', 'Sandıklı', 'Dinar', 'Bolvadin', 'Emirdağ', 'Çay',
        'Şuhut', 'Sinanpaşa', 'İhsaniye', 'Sultandağı', 'Başmakçı', 'Bayat',
        'Çobanlar', 'Dazkırı', 'Evciler', 'Hocalar', 'İscehisar', 'Kızılören'
      ],
      'afyonkarahisar': [
        'Merkez', 'Sandıklı', 'Dinar', 'Bolvadin', 'Emirdağ', 'Çay',
        'Şuhut', 'Sinanpaşa', 'İhsaniye', 'Sultandağı', 'Başmakçı', 'Bayat',
        'Çobanlar', 'Dazkırı', 'Evciler', 'Hocalar', 'İscehisar', 'Kızılören'
      ],
      'kayseri': [
        'Melikgazi', 'Kocasinan', 'Talas', 'Develi', 'Yahyalı', 'Bünyan',
        'Pınarbaşı', 'Tomarza', 'Yeşilhisar', 'Sarıoğlan', 'Akkışla', 'Felahiye',
        'Hacılar', 'İncesu', 'Özvatan', 'Sarız'
      ],
      'samsun': [
        'İlkadım', 'Atakum', 'Canik', 'Tekkeköy', 'Bafra', 'Çarşamba',
        'Vezirköprü', 'Havza', 'Alaçam', 'Terme', 'Ladik', 'Asarcık',
        '19 Mayıs', 'Ayvacık', 'Kavak', 'Salıpazarı', 'Yakakent'
      ],
      'kocaeli': ['İzmit', 'Gebze', 'Darıca', 'Gölcük', 'Körfez', 'Derince', 'Kartepe', 'Başiskele', 'Dilovası', 'Çayırova', 'Kandıra', 'Karamürsel'],
      'mersin': [
        'Yenişehir', 'Toroslar', 'Mezitli', 'Akdeniz', 'Tarsus', 'Silifke',
        'Anamur', 'Erdemli', 'Mut', 'Gülnar', 'Bozyazı', 'Aydıncık', 'Çamlıyayla'
      ],
      'malatya': [
        'Battalgazi', 'Yeşilyurt', 'Doğanşehir', 'Akçadağ', 'Darende', 'Hekimhan',
        'Pütürge', 'Yazıhan', 'Arapgir', 'Arguvan', 'Doğanyol', 'Kale', 'Kuluncak'
      ],
      'manisa': [
        'Şehzadeler', 'Yunusemre', 'Akhisar', 'Salihli', 'Turgutlu', 'Alaşehir',
        'Soma', 'Sarıgöl', 'Kırkağaç', 'Demirci', 'Kula', 'Gördes', 'Ahmetli',
        'Gölmarmara', 'Köprübaşı', 'Saruhanlı', 'Selendi'
      ],
      'kahramanmaras': [
        'Onikişubat', 'Dulkadiroğlu', 'Elbistan', 'Afşin', 'Pazarcık', 'Göksun',
        'Andırın', 'Çağlayancerit', 'Türkoğlu', 'Ekinözü', 'Nurhak'
      ],
      'erzurum': [
        'Yakutiye', 'Palandöken', 'Aziziye', 'Oltu', 'Horasan', 'Pasinler',
        'Karayazı', 'Hınıs', 'Tekman', 'Aşkale', 'Tortum', 'Çat', 'İspir',
        'Karaçoban', 'Köprüköy', 'Narman', 'Olur', 'Pazaryolu', 'Şenkaya', 'Uzundere'
      ],
      'van': [
        'İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Muradiye', 'Özalp',
        'Gevaş', 'Başkale', 'Çaldıran', 'Saray', 'Gürpınar', 'Bahçesaray', 'Çatak'
      ],
      'sakarya': [
        'Adapazarı', 'Serdivan', 'Erenler', 'Hendek', 'Akyazı', 'Karasu',
        'Sapanca', 'Geyve', 'Pamukova', 'Kocaali', 'Söğütlü', 'Ferizli',
        'Arifiye', 'Karapürçek', 'Kaynarca', 'Taraklı'
      ],
      'mugla': [
        'Menteşe', 'Bodrum', 'Fethiye', 'Marmaris', 'Milas', 'Ortaca',
        'Dalaman', 'Yatağan', 'Ula', 'Datça', 'Köyceğiz', 'Kavaklıdere', 'Seydikemer'
      ],
      'balikesir': [
        'Altıeylül', 'Karesi', 'Bandırma', 'Edremit', 'Ayvalık', 'Burhaniye',
        'Gönen', 'Susurluk', 'Dursunbey', 'Bigadiç', 'Sındırgı', 'Erdek',
        'Balya', 'Gömeç', 'Havran', 'İvrindi', 'Kepsut', 'Manyas', 'Marmara', 'Savaştepe'
      ],
      'denizli': [
        'Merkezefendi', 'Pamukkale', 'Acıpayam', 'Tavas', 'Buldan', 'Çivril',
        'Honaz', 'Sarayköy', 'Kale', 'Çameli', 'Güney', 'Babadağ', 'Baklan',
        'Bekilli', 'Beyağaç', 'Bozkurt', 'Çal', 'Çardak', 'Serinhisar'
      ],
      'tekirdag': [
        'Süleymanpaşa', 'Çorlu', 'Çerkezköy', 'Kapaklı', 'Ergene', 'Malkara',
        'Saray', 'Hayrabolu', 'Şarköy', 'Muratlı', 'Marmaraereğlisi'
      ],
      'aydin': [
        'Efeler', 'Kuşadası', 'Didim', 'Nazilli', 'Söke', 'Germencik',
        'İncirliova', 'Çine', 'Yenipazar', 'Karacasu', 'Koçarlı', 'Buharkent',
        'Bozdoğan', 'Karpuzlu', 'Köşk', 'Kuyucak', 'Sultanhisar'
      ],
      'canakkale': [
        'Merkez', 'Biga', 'Gelibolu', 'Çan', 'Ayvacık', 'Ezine', 'Lapseki', 'Yenice', 'Eceabat', 'Bozcaada', 'Gökçeada', 'Bayramiç'
      ],
      'edirne': ['Merkez', 'Keşan', 'Uzunköprü', 'İpsala', 'Havsa', 'Meriç', 'Enez', 'Lalapaşa', 'Süloğlu'],
      'ordu': [
        'Altınordu', 'Ünye', 'Fatsa', 'Kumru', 'Korgan', 'Perşembe',
        'Gölköy', 'Aybastı', 'Ulubey', 'Mesudiye', 'İkizce', 'Akkuş',
        'Çamaş', 'Çatalpınar', 'Çaybaşı', 'Gülyalı', 'Gürgentepe', 'Kabadüz', 'Kabataş'
      ],
      'zonguldak': ['Merkez', 'Ereğli', 'Alaplı', 'Çaycuma', 'Devrek', 'Kozlu', 'Kilimli', 'Gökçebey'],
      'batman': ['Merkez', 'Kozluk', 'Beşiri', 'Sason', 'Hasankeyf', 'Gercüş'],
      'rize': ['Merkez', 'Çayeli', 'Ardeşen', 'Pazar', 'Fındıklı', 'Güneysu', 'Kalkandere', 'İkizdere', 'Derepazarı'],
      'agri': ['Merkez', 'Patnos', 'Doğubayazıt', 'Diyadin', 'Eleşkirt', 'Tutak', 'Hamur', 'Taşlıçay'],
      'isparta': ['Merkez', 'Yalvaç', 'Eğirdir', 'Şarkikaraağaç', 'Gelendost', 'Senirkent', 'Uluborlu', 'Keçiborlu', 'Sütçüler'],
      'karabuk': ['Merkez', 'Safranbolu', 'Yenice', 'Eskipazar', 'Ovacık', 'Eflani'],
      'aksaray': ['Merkez', 'Ortaköy', 'Eskil', 'Gülağaç', 'Güzelyurt', 'Ağaçören', 'Sarıyahşi'],
      'yalova': ['Merkez', 'Çınarcık', 'Çiftlikköy', 'Altınova', 'Armutlu', 'Termal'],
      'bolu': ['Merkez', 'Gerede', 'Mudurnu', 'Göynük', 'Mengen', 'Yeniçağa', 'Seben', 'Dörtdivan'],
      'giresun': ['Merkez', 'Bulancak', 'Espiye', 'Görele', 'Tirebolu', 'Şebinkarisar', 'Keşap', 'Dereli', 'Eynesil', 'Alucra', 'Piraziz'],
      'kirklareli': ['Merkez', 'Lüleburgaz', 'Babaeski', 'Vize', 'Demirköy', 'Pınarhisar', 'Kofçaz', 'Pehlivanköy'],
      'siirt': ['Merkez', 'Kurtalan', 'Baykan', 'Şirvan', 'Eruh', 'Pervari', 'Tillo'],
      'sirnak': ['Merkez', 'Cizre', 'Silopi', 'İdil', 'Uludere', 'Beytüşşebap', 'Güçlükonak'],
      'hakkari': ['Merkez', 'Yüksekova', 'Şemdinli', 'Çukurca', 'Derecik'],
      'duzce': ['Merkez', 'Akçakoca', 'Gölyaka', 'Kaynaşlı', 'Yığılca', 'Çilimli', 'Gümüşova', 'Cumayeri'],
      'kars': ['Merkez', 'Sarıkamış', 'Kağızman', 'Selim', 'Digor', 'Akyaka', 'Arpaçay', 'Susuz'],
      'kastamonu': ['Merkez', 'Tosya', 'Taşköprü', 'Cide', 'İnebolu', 'Araç', 'Devrekani', 'Bozkurt', 'Daday', 'Abana'],
      'kirikkale': ['Merkez', 'Yahşihan', 'Bahşılı', 'Keskin', 'Delice', 'Sulakyurt', 'Karakeçili', 'Balışeyh'],
      'bartin': ['Merkez', 'Amasra', 'Ulus', 'Kurucaşile'],
      'ardahan': ['Merkez', 'Göle', 'Çıldır', 'Hanak', 'Posof', 'Damal'],
      'igdir': ['Merkez', 'Tuzluca', 'Aralık', 'Karakoyunlu'],
      'kilis': ['Merkez', 'Elbeyli', 'Musabeyli', 'Polateli'],
      'elazig': ['Merkez', 'Kovancılar', 'Karakoçan', 'Palu', 'Arıcak', 'Baskil', 'Maden', 'Sivrice', 'Keban', 'Alacakaya'],
      'nevsehir': ['Merkez', 'Ürgüp', 'Avanos', 'Gülşehir', 'Derinkuyu', 'Acıgöl', 'Kozaklı', 'Hacıbektaş'],
      'nigde': ['Merkez', 'Bor', 'Çiftlik', 'Ulukışla', 'Altunhisar', 'Çamardı'],
      'bilecik': ['Merkez', 'Bozüyük', 'Osmaneli', 'Söğüt', 'Pazaryeri', 'Gölpazarı', 'Yenipazar', 'İnhisar'],
      'bingol': ['Merkez', 'Genç', 'Solhan', 'Karlıova', 'Adaklı', 'Kiğı', 'Yedisu', 'Yayladere'],
      'bitlis': ['Merkez', 'Tatvan', 'Güroymak', 'Ahlat', 'Hizan', 'Mutki', 'Adilcevaz'],
      'corum': ['Merkez', 'Sungurlu', 'Osmancık', 'Alaca', 'İskilip', 'Bayat', 'Mecitözü', 'Ortaköy'],
      'amasya': ['Merkez', 'Merzifon', 'Suluova', 'Taşova', 'Gümüşhacıköy', 'Göynücek', 'Hamamözü'],
      'gumushane': ['Merkez', 'Kelkit', 'Şiran', 'Köse', 'Kürtün', 'Torul'],
      'artvin': ['Merkez', 'Hopa', 'Borçka', 'Arhavi', 'Yusufeli', 'Şavşat', 'Ardanuç', 'Murgul', 'Kemalpaşa'],
      'cankiri': ['Merkez', 'Orta', 'Çerkeş', 'Eskipazar', 'Ilgaz', 'Kurşunlu', 'Yapraklı', 'Eldivan', 'Şabanözü'],
      'adiyaman': ['Merkez', 'Kahta', 'Besni', 'Gölbaşı', 'Gerger', 'Sincik', 'Tut', 'Çelikhan', 'Samsat'],
      'sinop': ['Merkez', 'Boyabat', 'Gerze', 'Ayancık', 'Durağan', 'Türkeli', 'Erfelek', 'Saraydüzü', 'Dikmen'],
      'usak': ['Merkez', 'Banaz', 'Eşme', 'Sivaslı', 'Ulubey', 'Karahallı'],
      'yozgat': ['Merkez', 'Sorgun', 'Akdağmadeni', 'Yerköy', 'Sarıkaya', 'Boğazlıyan', 'Şefaatli', 'Çekerek', 'Aydıncık'],
      'tunceli': ['Merkez', 'Ovacık', 'Mazgirt', 'Pertek', 'Hozat', 'Pülümür', 'Nazımiye', 'Çemişgezek'],
      'bayburt': ['Merkez', 'Aydıntepe', 'Demirözü'],
      'karaman': ['Merkez', 'Ermenek', 'Sarıveliler', 'Ayrancı', 'Kazımkarabekir', 'Başyayla']
    };

    const normalizedName = reg.name.toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z]/g, '');

    let districtNames = TURKEY_REAL_DISTRICTS[normalizedName];

    if (!districtNames) {
      const key = Object.keys(TURKEY_REAL_DISTRICTS).find(k => normalizedName.includes(k) || k.includes(normalizedName));
      if (key) {
        districtNames = TURKEY_REAL_DISTRICTS[key];
      }
    }

    if (!districtNames || districtNames.length === 0) {
      const isUS = country.id === 'US';
      const isDE = country.id === 'DE';
      
      const suffixes = isUS ? [' County', ' City', ' District', ' Valley', ' Springs', ' Falls', ' Ridge', ' Creek', ' Haven'] :
                       isDE ? ['-Kreis', 'burg', 'dorf', 'stadt', 'berg', 'hausen', 'feld', 'wald', 'au'] :
                       ['dere', 'tepe', 'köy', 'ova', 'kent', 'hisar', 'başı', 'kale', 'pınar', 'yazı', 'geçit', 'bağ', 'yayla'];
      const prefixes = isUS ? ['New ', 'West ', 'East ', 'North ', 'South ', 'Oak ', 'Pine ', 'Cedar ', 'Lake ', 'River '] :
                       isDE ? ['Alt', 'Neu', 'Groß', 'Klein', 'Ober', 'Unter', 'Schwarz', 'Weiß', 'Rot', 'Grün'] :
                       ['Yeşil', 'Ak', 'Kara', 'Gök', 'Göz', 'Kızıl', 'Sarı', 'Yıldız', 'Kaya', 'Çamlı', 'Has', 'Ortak', 'Bağlar', 'Bayır'];
      
      const generatedList: string[] = isUS ? ['Capital District'] : isDE ? ['Zentrum'] : ['Merkez'];
      
      for (let i = 0; i < Math.max(3, Math.min(reg.seats || 4, 8)); i++) {
        const s1 = seed + i * 43;
        const s2 = seed + i * 87;
        const p = prefixes[Math.floor(myRandom(s1) * prefixes.length)];
        const suf = suffixes[Math.floor(myRandom(s2) * suffixes.length)];
        const generated = p + suf;
        if (!generatedList.includes(generated)) {
          generatedList.push(generated);
        }
      }
      districtNames = generatedList;
    }

    const REGIONAL_DISTRICT_COORDS: Record<string, Record<string, [number, number]>> = {
      'istanbul': {
        'Silivri': [0.08, 0.40],
        'Çatalca': [0.20, 0.65],
        'Büyükçekmece': [0.32, 0.35],
        'Esenyurt': [0.36, 0.45],
        'Beylikdüzü': [0.34, 0.28],
        'Arnavutköy': [0.38, 0.68],
        'Avcılar': [0.42, 0.35],
        'Başakşehir': [0.44, 0.50],
        'Küçükçekmece': [0.46, 0.38],
        'Bağcılar': [0.50, 0.45],
        'Bahçelievler': [0.50, 0.38],
        'Bakırköy': [0.49, 0.28],
        'Güngören': [0.52, 0.40],
        'Esenler': [0.51, 0.47],
        'Bayrampaşa': [0.53, 0.46],
        'Sultangazi': [0.51, 0.58],
        'Gaziosmanpaşa': [0.54, 0.52],
        'Eyüpsultan': [0.55, 0.65],
        'Zeytinburnu': [0.53, 0.33],
        'Fatih': [0.56, 0.35],
        'Beyoğlu': [0.58, 0.40],
        'Kağıthane': [0.58, 0.47],
        'Şişli': [0.59, 0.45],
        'Beşiktaş': [0.60, 0.42],
        'Sarıyer': [0.62, 0.68],
        'Beykoz': [0.70, 0.70],
        'Üsküdar': [0.64, 0.40],
        'Ümraniye': [0.68, 0.44],
        'Kadıköy': [0.65, 0.33],
        'Ataşehir': [0.68, 0.35],
        'Çekmeköy': [0.74, 0.48],
        'Sancaktepe': [0.73, 0.38],
        'Sultanbeyli': [0.76, 0.37],
        'Maltepe': [0.71, 0.28],
        'Kartal': [0.74, 0.25],
        'Pendik': [0.78, 0.28],
        'Tuzla': [0.82, 0.21],
        'Şile': [0.88, 0.65],
        'Adalar': [0.68, 0.20],
      },
      'ankara': {
        'Nallıhan': [0.05, 0.65],
        'Beypazarı': [0.18, 0.70],
        'Güdül': [0.32, 0.73],
        'Ayaş': [0.40, 0.62],
        'Polatlı': [0.22, 0.35],
        'Haymana': [0.42, 0.28],
        'Sincan': [0.45, 0.55],
        'Etimesgut': [0.49, 0.52],
        'Yenimahalle': [0.52, 0.57],
        'Çankaya': [0.55, 0.46],
        'Mamak': [0.59, 0.50],
        'Altındağ': [0.56, 0.55],
        'Keçiören': [0.55, 0.60],
        'Pursaklar': [0.58, 0.63],
        'Gölbaşı': [0.53, 0.38],
        'Akyurt': [0.68, 0.68],
        'Çubuk': [0.62, 0.85],
        'Kazan': [0.46, 0.68],
        'Elmadağ': [0.72, 0.48],
        'Kızılcahamam': [0.46, 0.88],
        'Şereflikoçhisar': [0.64, 0.12],
        'Bala': [0.68, 0.32],
        'Kalecik': [0.78, 0.74],
        'Çamlıdere': [0.25, 0.88],
        'Evren': [0.85, 0.12],
      },
      'izmir': {
        'Karaburun': [0.12, 0.75],
        'Çeşme': [0.05, 0.50],
        'Urla': [0.25, 0.45],
        'Seferihisar': [0.35, 0.32],
        'Menderes': [0.48, 0.34],
        'Selçuk': [0.58, 0.18],
        'Narlıdere': [0.38, 0.48],
        'Güzelbahçe': [0.34, 0.45],
        'Balçova': [0.41, 0.47],
        'Gaziemir': [0.46, 0.42],
        'Karabağlar': [0.44, 0.45],
        'Konak': [0.45, 0.51],
        'Buca': [0.51, 0.44],
        'Bornova': [0.56, 0.58],
        'Bayraklı': [0.48, 0.54],
        'Karşıyaka': [0.45, 0.57],
        'Çiğli': [0.41, 0.61],
        'Menemen': [0.44, 0.72],
        'Foça': [0.32, 0.70],
        'Aliağa': [0.45, 0.82],
        'Torbalı': [0.58, 0.36],
        'Kemalpaşa': [0.68, 0.52],
        'Tire': [0.70, 0.26],
        'Ödemiş': [0.85, 0.34],
        'Bayındır': [0.68, 0.36],
        'Bergama': [0.50, 0.94],
        'Dikili': [0.36, 0.90],
        'Kınık': [0.62, 0.95],
        'Kiraz': [0.93, 0.38],
        'Beydağ': [0.91, 0.28],
      },
      'antalya': {
        'Kaş': [0.08, 0.12],
        'Demre': [0.20, 0.18],
        'Finike': [0.28, 0.24],
        'Elmalı': [0.22, 0.46],
        'Kumluca': [0.36, 0.26],
        'Kemer': [0.45, 0.42],
        'Konyaaltı': [0.48, 0.48],
        'Korkuteli': [0.36, 0.65],
        'Kepez': [0.52, 0.54],
        'Muratpaşa': [0.53, 0.49],
        'Döşemealtı': [0.48, 0.68],
        'Aksu': [0.58, 0.52],
        'Serik': [0.68, 0.56],
        'Manavgat': [0.78, 0.54],
        'İbradı': [0.76, 0.74],
        'Akseki': [0.82, 0.78],
        'Alanya': [0.88, 0.38],
        'Gündoğmuş': [0.84, 0.52],
        'Gazipaşa': [0.94, 0.22],
      },
      'bursa': {
        'Karacabey': [0.10, 0.52],
        'Mustafakemalpaşa': [0.18, 0.34],
        'Mudanya': [0.38, 0.74],
        'Nilüfer': [0.42, 0.52],
        'Osmangazi': [0.48, 0.55],
        'Yıldırım': [0.53, 0.54],
        'Gürsu': [0.56, 0.57],
        'Kestel': [0.62, 0.52],
        'Gemlik': [0.50, 0.78],
        'Orhangazi': [0.52, 0.88],
        'İnegöl': [0.70, 0.40],
        'Yenişehir': [0.74, 0.60],
        'İznik': [0.78, 0.84],
        'Keles': [0.56, 0.30],
        'Orhaneli': [0.40, 0.32],
        'Büyükorhan': [0.26, 0.22],
        'Harmancık': [0.42, 0.16],
      },
      'adana': {
        'Seyhan': [0.45, 0.40],
        'Çukurova': [0.40, 0.48],
        'Yüreğir': [0.55, 0.40],
        'Sarıçam': [0.60, 0.50],
        'Kozan': [0.72, 0.72],
        'Ceyhan': [0.78, 0.42],
        'İmamoğlu': [0.62, 0.58],
        'Karataş': [0.52, 0.15],
        'Pozantı': [0.22, 0.78],
        'Karaisalı': [0.34, 0.58],
        'Feke': [0.68, 0.88],
      },
      'konya': {
        'Selçuklu': [0.42, 0.46],
        'Meram': [0.38, 0.42],
        'Karatay': [0.45, 0.44],
        'Ereğli': [0.82, 0.28],
        'Akşehir': [0.15, 0.65],
        'Beyşehir': [0.22, 0.32],
        'Seydişehir': [0.24, 0.22],
        'Ilgın': [0.28, 0.55],
        'Cihanbeyli': [0.48, 0.72],
        'Kulu': [0.55, 0.88],
        'Karapınar': [0.65, 0.35],
        'Çumra': [0.46, 0.30],
      },
      'gaziantep': {
        'Şahinbey': [0.38, 0.38],
        'Şehitkamil': [0.42, 0.48],
        'Nizip': [0.75, 0.45],
        'İslahiye': [0.10, 0.25],
        'Oğuzeli': [0.50, 0.22],
        'Araban': [0.68, 0.85],
        'Nurdağı': [0.12, 0.55],
        'Karkamış': [0.78, 0.20],
        'Yavuzeli': [0.55, 0.72],
      },
      'sanliurfa': {
        'Haliliye': [0.48, 0.48],
        'Eyyübiye': [0.46, 0.42],
        'Karaköprü': [0.45, 0.53],
        'Siverek': [0.72, 0.84],
        'Viranşehir': [0.78, 0.46],
        'Birecik': [0.15, 0.42],
        'Suruç': [0.28, 0.32],
        'Akçakale': [0.44, 0.20],
        'Ceylanpınar': [0.85, 0.26],
        'Harran': [0.52, 0.24],
        'Bozova': [0.25, 0.58],
      },
      'kocaeli': {
        'İzmit': [0.62, 0.55],
        'Gebze': [0.14, 0.48],
        'Darıca': [0.10, 0.32],
        'Gölcük': [0.48, 0.38],
        'Körfez': [0.38, 0.54],
        'Derince': [0.45, 0.55],
        'Kartepe': [0.78, 0.44],
        'Başiskele': [0.64, 0.38],
        'Dilovası': [0.25, 0.44],
        'Çayırova': [0.08, 0.48],
        'Kandıra': [0.72, 0.88],
        'Karamürsel': [0.34, 0.30],
      },
      'mersin': {
        'Yenişehir': [0.72, 0.42],
        'Toroslar': [0.75, 0.48],
        'Mezitli': [0.70, 0.40],
        'Akdeniz': [0.76, 0.43],
        'Tarsus': [0.88, 0.52],
        'Silifke': [0.48, 0.28],
        'Anamur': [0.05, 0.08],
        'Erdemli': [0.64, 0.36],
        'Mut': [0.38, 0.52],
        'Gülnar': [0.32, 0.24],
        'Bozyazı': [0.18, 0.12],
      },
      'diyarbakir': {
        'Kayapınar': [0.38, 0.48],
        'Bağlar': [0.40, 0.44],
        'Yenişehir': [0.42, 0.49],
        'Sur': [0.44, 0.46],
        'Ergani': [0.22, 0.68],
        'Bismil': [0.64, 0.32],
        'Silvan': [0.72, 0.54],
        'Lice': [0.58, 0.72],
        'Kulp': [0.76, 0.78],
        'Hani': [0.46, 0.68],
        'Dicle': [0.32, 0.72],
        'Çermik': [0.08, 0.60],
      },
      'hatay': {
        'Antakya': [0.48, 0.32],
        'İskenderun': [0.36, 0.58],
        'Defne': [0.44, 0.25],
        'Samandağ': [0.32, 0.20],
        'Kırıkhan': [0.55, 0.54],
        'Reyhanlı': [0.68, 0.34],
        'Dörtyol': [0.44, 0.82],
        'Erzin': [0.48, 0.94],
        'Payas': [0.40, 0.74],
        'Altınözü': [0.54, 0.12],
        'Arsuz': [0.22, 0.44],
        'Hassa': [0.62, 0.75],
      },
      'samsun': {
        'İlkadım': [0.52, 0.55],
        'Atakum': [0.46, 0.58],
        'Canik': [0.56, 0.52],
        'Tekkeköy': [0.62, 0.50],
        'Bafra': [0.32, 0.72],
        'Çarşamba': [0.72, 0.46],
        'Vezirköprü': [0.10, 0.38],
        'Havza': [0.22, 0.32],
        'Alaçam': [0.18, 0.78],
        'Terme': [0.85, 0.48],
        'Ladik': [0.38, 0.24],
        'Asarcık': [0.48, 0.36],
      },
      'trabzon': {
        'Ortahisar': [0.48, 0.50],
        'Akçaabat': [0.34, 0.52],
        'Araklı': [0.64, 0.42],
        'Of': [0.82, 0.38],
        'Yomra': [0.55, 0.46],
        'Sürmene': [0.72, 0.40],
        'Maçka': [0.45, 0.22],
        'Arsin': [0.58, 0.44],
        'Vakfıkebir': [0.16, 0.52],
        'Beşikdüzü': [0.08, 0.54],
        'Tonya': [0.12, 0.35],
        'Çaykara': [0.85, 0.12],
      },
      'eskisehir': {
        'Odunpazarı': [0.38, 0.52],
        'Tepebaşı': [0.36, 0.58],
        'Sivrihisar': [0.70, 0.35],
        'Çifteler': [0.48, 0.24],
        'Mahmudiye': [0.44, 0.32],
        'Alpu': [0.52, 0.62],
        'Mihalıççık': [0.72, 0.68],
        'Seyitgazi': [0.26, 0.34],
        'Günyüzü': [0.88, 0.32],
      },
      'mugla': {
        'Menteşe': [0.48, 0.64],
        'Bodrum': [0.05, 0.46],
        'Fethiye': [0.88, 0.22],
        'Marmaris': [0.34, 0.34],
        'Milas': [0.20, 0.68],
        'Ortaca': [0.64, 0.26],
        'Dalaman': [0.72, 0.24],
        'Yatağan': [0.36, 0.72],
        'Ula': [0.50, 0.52],
        'Datça': [0.14, 0.24],
        'Köyceğiz': [0.58, 0.38],
      }
    };

    const N = districtNames.length;

    // Retrieve GeoJSON feature from component's state
    let feat: any = null;
    if (geoJsonData && geoJsonData.features) {
      feat = geoJsonData.features.find((f: any) => {
        if (!f || !f.properties) return false;
        return normalizeName(getFeatureName(f)) === normalizedName;
      });
    }

    let mainRing: [number, number][] | null = null;
    let allRings: [number, number][][] = [];
    if (feat && feat.geometry && feat.geometry.coordinates) {
      const type = feat.geometry.type;
      if (type === 'Polygon') {
        allRings = [feat.geometry.coordinates[0]];
      } else if (type === 'MultiPolygon') {
        allRings = feat.geometry.coordinates.map((poly: any) => poly[0]).filter((r: any) => r && r.length >= 3);
      }
      
      if (allRings.length > 0) {
        let maxLen = 0;
        let mainIdx = 0;
        allRings.forEach((ring, idx) => {
          if (ring.length > maxLen) {
            maxLen = ring.length;
            mainIdx = idx;
          }
        });
        mainRing = allRings[mainIdx] as [number, number][];
      }
    }

    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    if (allRings.length > 0) {
      allRings.forEach(ring => {
        ring.forEach(([lng, lat]) => {
          if (lng < xMin) xMin = lng;
          if (lng > xMax) xMax = lng;
          if (lat < yMin) yMin = lat;
          if (lat > yMax) yMax = lat;
        });
      });
    } else {
      const bounds = getProvinceBoundsEstimate(reg.name, center);
      xMin = bounds.xMin;
      xMax = bounds.xMax;
      yMin = bounds.yMin;
      yMax = bounds.yMax;
    }

    const matchedProvKey = Object.keys(REGIONAL_DISTRICT_COORDS).find(
      (k) => normalizedName === k || normalizedName.includes(k) || k.includes(normalizedName)
    );
    const coords: [number, number][] = [];

    if (matchedProvKey) {
      const relCoords = REGIONAL_DISTRICT_COORDS[matchedProvKey];
      const rawCoords: [number, number][] = [];
      
      districtNames.forEach((name) => {
        const cleanName = name.toLowerCase()
          .replace(/ı/g, 'i')
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z]/g, '');

        let rel = relCoords[name];
        if (!rel) {
          const matchingKey = Object.keys(relCoords).find(k => {
            const cleanK = k.toLowerCase()
              .replace(/ı/g, 'i')
              .replace(/ğ/g, 'g')
              .replace(/ü/g, 'u')
              .replace(/ş/g, 's')
              .replace(/ö/g, 'o')
              .replace(/ç/g, 'c')
              .replace(/[^a-z]/g, '');
            return cleanK === cleanName || cleanK.includes(cleanName) || cleanName.includes(cleanK);
          });
          rel = matchingKey ? relCoords[matchingKey] : [0.5, 0.5];
        }
        const lng = xMin + rel[0] * (xMax - xMin);
        const lat = yMin + rel[1] * (yMax - yMin);
        rawCoords.push([lng, lat]);
      });

      if (mainRing && mainRing.length >= 3) {
        // Generate dense grid points inside the actual main province boundary
        const gridPoints: [number, number][] = [];
        const steps = 45;
        const dx = (xMax - xMin) / steps;
        const dy = (yMax - yMin) / steps;
        for (let ix = 0.5; ix < steps; ix += 1.0) {
          const gx = xMin + ix * dx;
          for (let iy = 0.5; iy < steps; iy += 1.0) {
            const gy = yMin + iy * dy;
            if (isPointInPolygon([gx, gy], mainRing)) {
              gridPoints.push([gx, gy]);
            }
          }
        }

        // Map rawCoords to final coords keeping precise locations if already inside
        const usedCoords: [number, number][] = [];
        rawCoords.forEach((raw) => {
          let finalCoord: [number, number] = raw;
          if (!isPointInPolygon(raw, mainRing)) {
            // Find closest available grid point
            let bestIdx = -1;
            let minDist = Infinity;
            gridPoints.forEach((gp, idx) => {
              // Avoid duplicates or extremely close selections if possible
              const isTooClose = usedCoords.some(uc => {
                const ucDx = uc[0] - gp[0];
                const ucDy = uc[1] - gp[1];
                return (ucDx * ucDx + ucDy * ucDy) < 1e-6;
              });
              if (isTooClose && gridPoints.length > N) return;

              const dx = gp[0] - raw[0];
              const dy = gp[1] - raw[1];
              const dist = dx * dx + dy * dy;
              if (dist < minDist) {
                minDist = dist;
                bestIdx = idx;
              }
            });

            if (bestIdx !== -1) {
              finalCoord = gridPoints[bestIdx];
            }
          }
          coords.push(finalCoord);
          usedCoords.push(finalCoord);
        });
      } else {
        coords.push(...rawCoords);
      }
    } else if (mainRing && mainRing.length >= 3) {
      const gridPoints: [number, number][] = [];
      const steps = 25;
      const dx = (xMax - xMin) / steps;
      const dy = (yMax - yMin) / steps;
      
      const polyForCheck = mainRing;
      for (let ix = 0.5; ix < steps; ix += 1.0) {
        const gx = xMin + ix * dx;
        for (let iy = 0.5; iy < steps; iy += 1.0) {
          const gy = yMin + iy * dy;
          if (isPointInPolygon([gx, gy], polyForCheck)) {
            gridPoints.push([gx, gy]);
          }
        }
      }

      if (gridPoints.length >= N) {
        const selected = selectEvenPoints(gridPoints, N, [center.lng, center.lat]);
        
        // Find the selected point closest to the province center
        const centerPt = [center.lng, center.lat];
        let closestIdx = 0;
        let minDist = Infinity;
        selected.forEach((pt, sIdx) => {
          const dx = pt[0] - centerPt[0];
          const dy = pt[1] - centerPt[1];
          const d = dx * dx + dy * dy;
          if (d < minDist) {
            minDist = d;
            closestIdx = sIdx;
          }
        });

        const remaining = selected.filter((_, sIdx) => sIdx !== closestIdx);
        // Sort remaining points stably: west to east, south to north
        remaining.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

        const mappedCoords: [number, number][] = [];
        for (let idx = 0; idx < N; idx++) {
          if (idx === 0) {
            mappedCoords.push(selected[closestIdx]);
          } else {
            mappedCoords.push(remaining[idx - 1] || selected[closestIdx]);
          }
        }
        coords.push(...mappedCoords);
      } else {
        for (let idx = 0; idx < N; idx++) {
          const pct = (idx + 0.5) / N;
          const lng = xMin + (0.05 + 0.9 * pct) * (xMax - xMin);
          const s = seed + idx * 79;
          const latOffset = (myRandom(s) - 0.5) * (yMax - yMin) * 0.45;
          const lat = center.lat + latOffset;
          coords.push([lng, lat]);
        }
      }
    } else {
      for (let idx = 0; idx < N; idx++) {
        const pct = (idx + 0.5) / N;
        const lng = xMin + (0.05 + 0.9 * pct) * (xMax - xMin);
        const s = seed + idx * 79;
        const latOffset = (myRandom(s) - 0.5) * (yMax - yMin) * 0.45;
        const lat = center.lat + latOffset;
        coords.push([lng, lat]);
      }
    }

    return districtNames.map((name, idx) => {
      const s = seed + idx * 79;
      const [lng, lat] = coords[idx] || [center.lng, center.lat];
      
      const supports: Record<string, number> = {};
      let total = 0;
      Object.entries(reg.supports).forEach(([pId, val]) => {
        const fluctuation = (myRandom(s + 500) - 0.5) * 8;
        supports[pId] = Math.max(0.1, (val as number) + fluctuation);
        total += supports[pId];
      });
      
      Object.keys(supports).forEach((pId) => {
        supports[pId] = parseFloat(((supports[pId] / total) * 100).toFixed(1));
      });
      
      let winner = 'AKP';
      let maxSupport = 0;
      Object.entries(supports).forEach(([pId, val]) => {
        if (val > maxSupport) {
          maxSupport = val;
          winner = pId;
        }
      });
      
      const mayorName = getDeterministicMayorName(name, country.id);
      
      return {
        name,
        population: Math.floor(12000 + myRandom(s + 2000) * 280000),
        supports,
        winnerParty: winner,
        mayorName,
        lat,
        lng,
        provinceId: reg.id
      };
    });
  };

  const getPolygonCentroid = (coords: number[][]): [number, number] => {
    let sumLng = 0;
    let sumLat = 0;
    const count = coords.length;
    if (count === 0) return [35.2433, 38.9637];
    for (let i = 0; i < count; i++) {
      sumLng += coords[i][0];
      sumLat += coords[i][1];
    }
    return [sumLng / count, sumLat / count];
  };

  const clipPolygon = (poly: [number, number][], ax: number, ay: number, c: number): [number, number][] => {
    const result: [number, number][] = [];
    if (poly.length === 0) return result;
    
    const evalPt = (pt: [number, number]) => ax * pt[0] + ay * pt[1] + c;
    
    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p0 = poly[(i - 1 + poly.length) % poly.length];
      
      const v1 = evalPt(p1);
      const v0 = evalPt(p0);
      
      const inside1 = v1 >= -1e-9;
      const inside0 = v0 >= -1e-9;
      
      if (inside1) {
        if (!inside0) {
          const t = v0 / (v0 - v1);
          result.push([
            p0[0] + t * (p1[0] - p0[0]),
            p0[1] + t * (p1[1] - p0[1])
          ]);
        }
        result.push(p1);
      } else if (inside0) {
        const t = v0 / (v0 - v1);
        result.push([
          p0[0] + t * (p1[0] - p0[0]),
          p0[1] + t * (p1[1] - p0[1])
        ]);
      }
    }
    
    return result;
  };

  const clipRing = (ring: number[][], ax: number, ay: number, c: number): number[][] => {
    let pts = [...ring].map(pt => [pt[0], pt[1]] as [number, number]);
    if (pts.length > 1 && 
        Math.abs(pts[0][0] - pts[pts.length - 1][0]) < 1e-9 && 
        Math.abs(pts[0][1] - pts[pts.length - 1][1]) < 1e-9) {
      pts.pop();
    }
    
    const clipped = clipPolygon(pts, ax, ay, c);
    if (clipped.length >= 3) {
      clipped.push([clipped[0][0], clipped[0][1]]);
      return clipped;
    }
    return [];
  };

  const distanceToSegment = (p: [number, number], a: [number, number], b: [number, number]) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt((p[0] - a[0])**2 + (p[1] - a[1])**2);
    let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = a[0] + t * dx;
    const projY = a[1] + t * dy;
    return Math.sqrt((p[0] - projX)**2 + (p[1] - projY)**2);
  };

  const isVertexOnOuterBoundary = (pt: [number, number], originalRings: number[][][]): boolean => {
    const eps = 0.0003; // ~30 meters tolerance
    for (const ring of originalRings) {
      for (let i = 0; i < ring.length - 1; i++) {
        const d = distanceToSegment(pt, ring[i] as [number, number], ring[i+1] as [number, number]);
        if (d < eps) return true;
      }
    }
    return false;
  };

  const subdivideAndCurveRing = (
    ring: [number, number][],
    allOriginalRings: number[][][],
    seed: number
  ): [number, number][] => {
    const finalRing: [number, number][] = [];
    const maxSegmentLen = 0.008; // Small segments for smooth bends
    
    const pts = [...ring];
    if (pts.length > 1 && 
        Math.abs(pts[0][0] - pts[pts.length - 1][0]) < 1e-9 && 
        Math.abs(pts[0][1] - pts[pts.length - 1][1]) < 1e-9) {
      pts.pop();
    }

    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 1) % pts.length];
      
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const numSegments = Math.max(1, Math.ceil(dist / maxSegmentLen));
      
      for (let s = 0; s < numSegments; s++) {
        const t1 = s / numSegments;
        const ptX = p1[0] + t1 * dx;
        const ptY = p1[1] + t1 * dy;
        const pt: [number, number] = [ptX, ptY];
        
        const isOnOuter = isVertexOnOuterBoundary(pt, allOriginalRings);
        
        if (isOnOuter) {
          finalRing.push(pt);
        } else {
          // Adjust only internal borders dynamically with deterministic high-fidelity waves
          const waveAmp = 0.0022; // Subtle, realistic curving
          // Frequency factors to keep the boundaries natural and highly winding
          const angle1 = ptX * 180 + ptY * 130 + seed;
          const angle2 = ptY * 220 - ptX * 150 + seed * 1.5;
          const angle3 = (ptX + ptY) * 310 - seed * 0.7;
          
          const shiftX = (Math.sin(angle1) * 0.6 + Math.cos(angle2) * 0.3 + Math.sin(angle3) * 0.1) * waveAmp;
          const shiftY = (Math.cos(angle1) * 0.6 + Math.sin(angle2) * 0.3 + Math.cos(angle3) * 0.1) * waveAmp;
          
          finalRing.push([ptX + shiftX, ptY + shiftY]);
        }
      }
    }
    
    if (finalRing.length > 0) {
      finalRing.push([finalRing[0][0], finalRing[0][1]]);
    }
    
    return finalRing;
  };

  
const getPolygonCenter = (feat: any) => {
  let minX = 180, maxX = -180, minY = 90, maxY = -90;
  let pts = 0;
  const processCoords = (coords: any[]) => {
    if (typeof coords[0] === 'number') {
      const lng = coords[0], lat = coords[1];
      if (lng < minX) minX = lng;
      if (lng > maxX) maxX = lng;
      if (lat < minY) minY = lat;
      if (lat > maxY) maxY = lat;
      pts++;
    } else {
      coords.forEach(processCoords);
    }
  };
  if (feat.geometry && feat.geometry.coordinates) {
    processCoords(feat.geometry.coordinates);
  }
  if (pts === 0) return null;
  return { lat: (minY + maxY) / 2, lng: (minX + maxX) / 2 };
};

  const subdivideProvinceGeoJson = (feature: any, reg: Region, districts: any[]): any[] => {
    if (!feature.geometry || !feature.geometry.coordinates) return [];
    
    const type = feature.geometry.type;
    let allOriginalRings: number[][][] = [];
    if (type === 'Polygon') {
      allOriginalRings = [feature.geometry.coordinates[0]];
    } else if (type === 'MultiPolygon') {
      allOriginalRings = feature.geometry.coordinates
        .map((poly: any) => poly[0])
        .filter((r: any) => r && r.length >= 3);
    }
    
    if (allOriginalRings.length === 0) return [];

    const N = districts.length;
    if (N === 0) return [];
    if (N === 1) {
      const distData = districts[0];
      return [{
        type: 'Feature',
        properties: {
          provinceId: reg.id,
          provinceName: reg.name,
          districtName: distData.name,
          isDistrict: true,
          population: distData.population,
          supports: distData.supports,
          winnerParty: distData.winnerParty,
          mayorName: distData.mayorName,
          center: [distData.lat, distData.lng]
        },
        geometry: feature.geometry
      }];
    }

    const subFeatures: any[] = [];
    const centroids = districts.map(d => [d.lng, d.lat] as [number, number]);

    for (let j = 0; j < N; j++) {
      const distData = districts[j];
      if (!distData) continue;

      let currentRings = allOriginalRings.map(ring => ring.map(pt => [pt[0], pt[1]] as [number, number]));
      const c_j = centroids[j];

      for (let k = 0; k < N; k++) {
        if (k === j) continue;
        const c_k = centroids[k];
        
        const mx = (c_j[0] + c_k[0]) / 2;
        const my = (c_j[1] + c_k[1]) / 2;
        
        const ax = c_j[0] - c_k[0];
        const ay = c_j[1] - c_k[1];
        
        const offset = -(ax * mx + ay * my);
        
        const nextRings: [number, number][][] = [];
        currentRings.forEach(ring => {
          const clipped = clipRing(ring, ax, ay, offset);
          if (clipped.length >= 3) {
            nextRings.push(clipped as [number, number][]);
          }
        });
        currentRings = nextRings;
      }

      // Fallback box if ring completely disappeared
      if (currentRings.length === 0) {
        const eps = 0.005;
        const fallbackBox = [
          [c_j[0] - eps, c_j[1] - eps],
          [c_j[0] + eps, c_j[1] - eps],
          [c_j[0] + eps, c_j[1] + eps],
          [c_j[0] - eps, c_j[1] + eps],
          [c_j[0] - eps, c_j[1] - eps]
        ];
        currentRings.push(fallbackBox as [number, number][]);
      }

      const seedCharSum = reg.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const processedRings = currentRings.map(ring => subdivideAndCurveRing(ring ?? [], allOriginalRings, seedCharSum));

      let geomType: 'Polygon' | 'MultiPolygon' = 'Polygon';
      let geomCoords: any = [processedRings[0]];
      if (processedRings.length > 1) {
        geomType = 'MultiPolygon';
        geomCoords = processedRings.map(r => [r]);
      }

      subFeatures.push({
        type: 'Feature',
        properties: {
          provinceId: reg.id,
          provinceName: reg.name,
          districtName: distData.name,
          isDistrict: true,
          population: distData.population,
          supports: distData.supports,
          winnerParty: distData.winnerParty,
          mayorName: distData.mayorName,
          center: [distData.lat, distData.lng]
        },
        geometry: {
          type: geomType,
          coordinates: geomCoords
        }
      });
    }

    return subFeatures;
  };

  // Fetch online Turkey GeoJSON on component load
  useEffect(() => {
    if (country.id !== 'TR') return;
    
    const provinceUrls = [
      'https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json',
      'https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json'
    ];

    const tryFetchProvinces = async () => {
      for (const url of provinceUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            setGeoJsonData(data);
            return;
          }
        } catch (err) {
          console.warn(`Fetch province map from ${url} failed:`, err);
        }
      }
      console.warn('All province GeoJSON fetch attempts failed. Falling back to point-markers.');
    };

    tryFetchProvinces();
  }, [country.id]);

  // Fetch online Germany GeoJSON on component load
  useEffect(() => {
    if (country.id !== 'DE') return;
    
    const germanyUrl = 'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json';

    const tryFetchGermany = async () => {
      try {
        const res = await fetch(germanyUrl);
        if (res.ok) {
          const data = await res.json();
          setGeoJsonData(data);
          return;
        }
      } catch (err) {
        console.warn(`Fetch Germany map from ${germanyUrl} failed:`, err);
      }
      console.warn('Germany GeoJSON fetch failed. Falling back to point-markers.');
    };

    tryFetchGermany();
  }, [country.id]);

  // Fetch online USA GeoJSON on component load
  useEffect(() => {
    if (country.id !== 'US') return;
    
    const usUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

    const tryFetchUS = async () => {
      try {
        const res = await fetch(usUrl);
        if (res.ok) {
          const data = await res.json();
          setGeoJsonData(data);
          return;
        }
      } catch (err) {
        console.warn(`Fetch USA map from ${usUrl} failed:`, err);
      }
      console.warn('USA GeoJSON fetch failed. Falling back to point-markers.');
    };

    tryFetchUS();
  }, [country.id]);

  // Fetch online GeoJSON for various countries on component load
  useEffect(() => {
        const geojsonMapUrls: Record<string, string> = {
      BR: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/brazil-states.geojson',
      JP: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/japan.geojson',
      EG: '/egypt-provinces.geojson',
      GB: 'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/eer.json',
      CA: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson',
      ZA: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/south-africa.geojson',
      IN: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/india.geojson',
      MX: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/mexico.geojson',
      ES: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/spain-communities.geojson',
      AU: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/australia.geojson',
      IT: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/italy-regions.geojson',
      ID: 'https://cdn.jsdelivr.net/gh/superpikar/indonesia-geojson@master/indonesia.geojson',
      KR: 'https://cdn.jsdelivr.net/gh/southkorea/southkorea-maps@master/kostat/2013/json/skorea_provinces_geo_simple.json',
      AR: 'https://raw.githubusercontent.com/Rodri1791/Regions_Argentina/main/Regiones_ArgentinasGJSON/provinciasargentina.geojson',
      FR: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/france-regions.geojson',
      RO: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/romania.geojson',
      HU: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/hungary.geojson',
      PL: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/poland.geojson',
      CN: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/china.geojson'
    };

    if (!geojsonMapUrls[country.id]) return;
    
    const url = geojsonMapUrls[country.id];

    const tryFetch = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setGeoJsonData(data);
          return;
        }
      } catch (err) {
        console.warn(`Fetch ${country.id} map from ${url} failed:`, err);
      }
      console.warn(`${country.id} GeoJSON fetch failed. Falling back to point-markers.`);
    };

    tryFetch();
  }, [country.id]);

  // Dedicated GeoJSON builder for historical 1950 nations (Soviet Union, Yugoslavia, Czechoslovakia, DDR)
  useEffect(() => {
    if (!worldGeoJsonData || !worldGeoJsonData.features) return;

    if (country.id === 'SU') {
      const suRepublicCodes: Record<string, string> = {
        RUS: 'Russian SFSR (Moscow & Leningrad)',
        UKR: 'Ukrainian SSR (Kyiv & Kharkiv)',
        BLR: 'Byelorussian SSR (Minsk)',
        KAZ: 'Kazakh SSR (Alma-Ata)',
        UZB: 'Uzbek SSR (Tashkent)',
        GEO: 'Transcaucasian SSRs (Georgia, Armenia, Azerbaijan)',
        ARM: 'Transcaucasian SSRs (Georgia, Armenia, Azerbaijan)',
        AZE: 'Transcaucasian SSRs (Georgia, Armenia, Azerbaijan)',
        EST: 'Baltic SSRs (Estonia, Latvia, Lithuania)',
        LVA: 'Baltic SSRs (Estonia, Latvia, Lithuania)',
        LTU: 'Baltic SSRs (Estonia, Latvia, Lithuania)',
        TKM: 'Central Asian SSRs (Turkmenistan, Tajikistan, Kyrgyzstan)',
        TJK: 'Central Asian SSRs (Turkmenistan, Tajikistan, Kyrgyzstan)',
        KGZ: 'Central Asian SSRs (Turkmenistan, Tajikistan, Kyrgyzstan)',
        MDA: 'Moldavian SSR (Chisinau)',
      };

      const features: any[] = [];
      worldGeoJsonData.features.forEach((f: any) => {
        const id3 = String(f.id || f.properties?.ISO_A3 || f.properties?.iso_a3 || '').toUpperCase();
        const mappedName = suRepublicCodes[id3];
        if (mappedName) {
          features.push({
            ...f,
            properties: {
              ...f.properties,
              name: mappedName,
              shapeName: mappedName,
              id: id3
            }
          });
        }
      });

      if (features.length > 0) {
        setGeoJsonData({ type: 'FeatureCollection', features });
      }
    } else if (country.id === 'YU') {
      const yuRepublicCodes: Record<string, string> = {
        SRB: 'People\'s Republic of Serbia (Belgrade & Vojvodina)',
        HRV: 'People\'s Republic of Croatia (Zagreb & Split)',
        SVN: 'People\'s Republic of Slovenia (Ljubljana)',
        BIH: 'People\'s Republic of Bosnia and Herzegovina (Sarajevo)',
        MKD: 'People\'s Republic of Macedonia (Skopje)',
        MNE: 'People\'s Republic of Montenegro (Titograd)',
        KOS: 'People\'s Republic of Serbia (Belgrade & Vojvodina)',
      };

      const features: any[] = [];
      worldGeoJsonData.features.forEach((f: any) => {
        const id3 = String(f.id || f.properties?.ISO_A3 || f.properties?.iso_a3 || '').toUpperCase();
        const mappedName = yuRepublicCodes[id3];
        if (mappedName) {
          features.push({
            ...f,
            properties: {
              ...f.properties,
              name: mappedName,
              shapeName: mappedName,
              id: id3
            }
          });
        }
      });

      if (features.length > 0) {
        setGeoJsonData({ type: 'FeatureCollection', features });
      }
    } else if (country.id === 'CS') {
      const csRepublicCodes: Record<string, string> = {
        CZE: 'Prague & Central Bohemia',
        SVK: 'Western Slovakia (Bratislava & Trnava)'
      };

      const features: any[] = [];
      worldGeoJsonData.features.forEach((f: any) => {
        const id3 = String(f.id || f.properties?.ISO_A3 || f.properties?.iso_a3 || '').toUpperCase();
        const mappedName = csRepublicCodes[id3];
        if (mappedName) {
          features.push({
            ...f,
            properties: {
              ...f.properties,
              name: mappedName,
              shapeName: mappedName,
              id: id3
            }
          });
        }
      });

      if (features.length > 0) {
        setGeoJsonData({ type: 'FeatureCollection', features });
      }
    } else if (country.id === 'DDR') {
      fetch('https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/germany.geojson')
        .then(res => res.json())
        .then(data => {
          if (data && data.features) {
            const eastGermanStates = ['Berlin', 'Brandenburg', 'Mecklenburg-Vorpommern', 'Sachsen', 'Sachsen-Anhalt', 'Thüringen'];
            const features = data.features.filter((f: any) => {
              const name = f.properties?.name || '';
              return eastGermanStates.some(s => name.includes(s));
            });
            setGeoJsonData({ type: 'FeatureCollection', features });
          }
        })
        .catch(err => console.warn('Failed to load DDR states:', err));
    }
  }, [country.id, worldGeoJsonData]);

  // Fetch online Turkey Districts GeoJSON on-demand or background
  useEffect(() => {
    if (country.id !== 'TR' || districtGeoJsonData || loadingDistrictGeoJson) return;

    setLoadingDistrictGeoJson(true);

    const loadDistricts = async () => {
      try {
        let allData = cachedAllDistrictsGeoJson;
        if (!allData) {
          if (!allDistrictsGeoJsonPromise) {
            allDistrictsGeoJsonPromise = (async () => {
              const res = await fetch('https://cdn.jsdelivr.net/gh/ttezer/turkiye-harita-verisi@master/dist/geojson/districts.geojson');
              if (!res.ok) {
                throw new Error(`Failed to fetch districts geojson: status ${res.status}`);
              }
              const data = await res.json();
              cachedAllDistrictsGeoJson = data;
              return data;
            })();
          }
          allData = await allDistrictsGeoJsonPromise;
        }

        if (allData && allData.features) {
          setDistrictGeoJsonData(allData);
          setLoadingDistrictGeoJson(false);
        } else {
          throw new Error('Districts GeoJSON features are undefined');
        }
      } catch (err) {
        console.warn(`All district GeoJSON fetch attempts failed. Using fallback subdivision.`, err);
        setLoadingDistrictGeoJson(false);
      }
    };

    loadDistricts();
  }, [country.id, districtGeoJsonData, loadingDistrictGeoJson]);

  // Sync selectedRegion if the country object changes underneath
  useEffect(() => {
    const updated = country.regions.find(r => r.id === selectedRegion.id);
    if (updated) {
      setSelectedRegion(updated);
    }
  }, [country, selectedRegion.id]);

  // Reset selected region/district when country changes
  useEffect(() => {
    if (country.regions && country.regions.length > 0) {
      setSelectedRegion(country.regions[0]);
    }
    setSelectedDistrict(null);
    setActiveViewLevel('province');
  }, [country.id]);

  // Leaflet refs for Turkey GIS Map
  const turkeyMapRef = React.useRef<HTMLDivElement>(null);
  const turkeyMapInstanceRef = React.useRef<L.Map | null>(null);
  const turkeyTileLayerRef = React.useRef<L.TileLayer | null>(null);
  const turkeyTerrainLayerRef = React.useRef<L.TileLayer | null>(null);
  const turkeyOceanLayerRef = React.useRef<L.TileLayer | null>(null);
  const turkeyMarkersRef = React.useRef<L.CircleMarker[]>([]);
  const turkeyGeoJsonLayerRef = React.useRef<L.Layer | null>(null);
  const provinceOverlayLayerRef = React.useRef<L.Layer | null>(null);
  const worldBgLayerRef = React.useRef<L.Layer | null>(null);
  const lastCountryIdRef = React.useRef<string | null>(null);
  const hasFitBoundsForCountryRef = React.useRef<string | null>(null);

  // Cleanup on component unmount or when leaving Turkey
  const cleanupTurkeyMap = () => {
    if (turkeyMapInstanceRef.current) {
      const map = turkeyMapInstanceRef.current;
      try {
         map.stop();
      } catch(e) {}
      try {
        map.closeTooltip();
      } catch (e) {}
      try {
        map.eachLayer((layer) => {
          try {
            if (typeof (layer as any).closeTooltip === 'function') {
              (layer as any).closeTooltip();
            }
          } catch (e) {}
          try {
            if (typeof (layer as any).unbindTooltip === 'function') {
              (layer as any).unbindTooltip();
            }
          } catch (e) {}
          try {
            if (typeof (layer as any).off === 'function') {
              (layer as any).off();
            }
          } catch (e) {}
        });
      } catch (e) {}
      try {
        map.off();
      } catch (e) {}
      
      try { if(map.stop) map.stop(); map.off(); map.remove(); } catch(e) {}

      turkeyMapInstanceRef.current = null;
      turkeyTileLayerRef.current = null;
      turkeyTerrainLayerRef.current = null;
      turkeyGeoJsonLayerRef.current = null;
      provinceOverlayLayerRef.current = null;
    worldBgLayerRef.current = null;
      turkeyMarkersRef.current = [];
    }
  };

  useEffect(() => {
    return () => {
      cleanupTurkeyMap();
    };
  }, []);

  // Update Map Tilings when DarkMode is toggled
  useEffect(() => {
    if (turkeyTileLayerRef.current) {
      const newUrl = darkMode
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';
      turkeyTileLayerRef.current.setUrl(newUrl);
    }
    if (turkeyTerrainLayerRef.current && turkeyMapInstanceRef.current) {
      turkeyTerrainLayerRef.current.setOpacity(darkMode ? 0.35 : 0.35);
      const pane = turkeyMapInstanceRef.current.getPane('terrainPane');
      if (pane) {
        pane.style.mixBlendMode = 'overlay';
      }
      
      const terrainImg = turkeyTerrainLayerRef.current.getContainer();
      if (terrainImg) {
        if (darkMode) {
          terrainImg.classList.remove('terrain-tile');
          terrainImg.classList.add('terrain-tile-dark');
        } else {
          terrainImg.classList.remove('terrain-tile-dark');
          terrainImg.classList.add('terrain-tile');
        }
      }
    }
  }, [darkMode]);

  // Main Turkey/Germany/Soviet/Yugoslavia/World Leaflet map builder and sync
  useEffect(() => {
    if (!country.regions || country.regions.length === 0 || !turkeyMapRef.current) {
      cleanupTurkeyMap();
      return;
    }

    const defaultCoordsMap: Record<string, [number, number, number]> = {
      TR: [38.9637, 35.2433, 6],
      DE: [51.1657, 10.4515, 6],
      DDR: [52.3, 12.6, 6.8],
      SU: [56.0, 52.0, 3.5],
      YU: [44.0, 18.5, 6.2],
      CS: [49.8, 15.5, 6.8],
      PL: [52.0, 19.5, 6.0],
      CN: [35.8, 104.2, 4.0],
      US: [37.0902, -95.7129, 4],
      BR: [-14.235, -51.9253, 4],
      JP: [36.2048, 138.2529, 5],
      EG: [26.8206, 30.8025, 5],
      GB: [54.3781, -3.4360, 5],
      FR: [46.2276, 2.2137, 5.5],
      RO: [45.9432, 24.9668, 6.2],
      HU: [47.1625, 19.5033, 6.8],
      IT: [41.8719, 12.5674, 5.5],
      ES: [40.4637, -3.7492, 5.5],
      IN: [20.5937, 78.9629, 4.5],
      CA: [56.1304, -106.3468, 3.5],
      AU: [-25.2744, 133.7751, 4.0],
      MX: [23.6345, -102.5528, 5.0],
      ID: [-0.7893, 113.9213, 4.5],
      KR: [35.9078, 127.7669, 6.5],
      AR: [-38.4161, -63.6167, 4.0],
      ZA: [-30.5595, 22.9375, 5.0],
    };

    if (!turkeyMapInstanceRef.current) {
      const coordEntry = defaultCoordsMap[country.id] || [38.9637, 35.2433, 5];
      let initialCenter: [number, number] = [coordEntry[0], coordEntry[1]];
      let initialZoom = coordEntry[2];
      
      let mapOptions: any = {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 2.0,
        maxZoom: 18,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
        maxBoundsViscosity: 1.0,
        maxBounds: [[-85, -180], [85, 180]],
        worldCopyJump: false,
      };
      const map = L.map(turkeyMapRef.current, mapOptions);

      const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';

      const tiles = L.tileLayer(tileUrl, {
        subdomains: 'abcd',
        maxZoom: 18,
        maxNativeZoom: 13,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
        className: 'base-map-tile'
      }).addTo(map);
      turkeyTileLayerRef.current = tiles;

      const terrainPane = map.createPane('terrainPane');
      terrainPane.style.zIndex = '450';
      terrainPane.style.pointerEvents = 'none';
      terrainPane.style.mixBlendMode = 'overlay';

      const terrainUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}';
      const terrain = L.tileLayer(terrainUrl, {
        opacity: darkMode ? 0.16 : 0.22,
        maxZoom: 18,
        maxNativeZoom: 13,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
        pane: 'terrainPane',
        className: darkMode ? 'terrain-tile-dark' : 'terrain-tile'
      }).addTo(map);
      turkeyTerrainLayerRef.current = terrain;

      turkeyMapInstanceRef.current = map;
    } else {
      if (turkeyTerrainLayerRef.current) {
        turkeyTerrainLayerRef.current.setOpacity(darkMode ? 0.16 : 0.22);
        const container = turkeyTerrainLayerRef.current.getContainer();
        if (container) {
          if (darkMode) {
            container.classList.remove('terrain-tile');
            container.classList.add('terrain-tile-dark');
          } else {
            container.classList.remove('terrain-tile-dark');
            container.classList.add('terrain-tile');
          }
        }
      }
    }

    const map = turkeyMapInstanceRef.current;

    // Pan and zoom to correct country coordinates on switch
    if (lastCountryIdRef.current !== country.id) {
      lastCountryIdRef.current = country.id;
      if (country.id === 'DE') {
        map.setView([51.1657, 10.4515], 6);
      } else if (country.id === 'DDR') {
        map.setView([52.3, 12.6], 6.8);
      } else if (country.id === 'SU') {
        map.setView([56.0, 52.0], 3.5);
      } else if (country.id === 'YU') {
        map.setView([44.0, 18.5], 6.2);
      } else if (country.id === 'CS') {
        map.setView([49.8, 15.5], 6.8);
      } else if (country.id === 'PL') {
        map.setView([52.0, 19.5], 6.0);
      } else if (country.id === 'CN') {
        map.setView([35.8, 104.2], 4.0);
      } else if (country.id === 'US') {
        map.setView([37.0902, -95.7129], 4);
      } else if (country.id === 'BR') {
        map.setView([-14.235, -51.9253], 4);
      } else if (country.id === 'JP') {
        map.setView([36.2048, 138.2529], 5);
      } else if (country.id === 'EG') {
        map.setView([26.8206, 30.8025], 5);
      } else if (country.id === 'GB') {
        map.setView([54.3781, -3.4360], 5);
      } else if (country.id === 'CA') {
        map.setView([56.1304, -106.3468], 3);
      } else if (country.id === 'ZA') {
        map.setView([-30.5595, 22.9375], 5);
      } else if (country.id === 'IN') {
        map.setView([20.5937, 78.9629], 4);
      } else if (country.id === 'MX') {
        map.setView([23.6345, -102.5528], 5);
      } else if (country.id === 'ES') {
        map.setView([40.4637, -3.7492], 5);
      } else if (country.id === 'AU') {
        map.setView([-25.2744, 133.7751], 4);
      } else if (country.id === 'AR') {
        map.setView([-38.4161, -63.6167], 4);
      } else if (country.id === 'IT') {
        map.setView([41.8719, 12.5674], 5);
      } else if (country.id === 'ID') {
        map.setView([-0.7893, 113.9213], 5);
      } else if (country.id === 'KR') {
        map.setView([35.9078, 127.7669], 6);
      } else if (country.id === 'FR') {
        map.setView([46.2276, 2.2137], 5.5);
      } else if (country.id === 'RO') {
        map.setView([45.9432, 24.9668], 6.2);
      } else if (country.id === 'HU') {
        map.setView([47.1625, 19.5033], 6.8);
      } else {
        map.setView([38.9637, 35.2433], 6);
      }
    }
    
    // Clear old layers/markers robustly
    try {
      map.closeTooltip();
    } catch (e) {}
    try {
      map.eachLayer((layer) => {
        if (layer !== turkeyTileLayerRef.current && layer !== turkeyTerrainLayerRef.current) {
          try {
            if (layer.unbindTooltip) layer.unbindTooltip();
            if (layer.unbindPopup) layer.unbindPopup();
            if (layer.off) layer.off();
            map.removeLayer(layer);
          } catch (e) {}
        }
      });
    } catch (e) {}
    turkeyGeoJsonLayerRef.current = null;
    provinceOverlayLayerRef.current = null;
    worldBgLayerRef.current = null;
    turkeyMarkersRef.current = [];

    // Check if we have loaded the full province shapes (GeoJSON)
    if (geoJsonData) {
      let displayGeoJson = geoJsonData;
      if (activeViewLevel === 'district') {
        if (districtGeoJsonData && districtGeoJsonData.features) {
          const mappedFeatures: any[] = [];
          districtGeoJsonData.features.forEach((feat: any) => {
            if (!feat || !feat.properties) return;
            
            const plateFromFeature = String(feat.properties.parent_id || feat.properties.id || '').match(/TR-[PD]-(\d+)/)?.[1];
            if (!plateFromFeature) return;

            const reg = country.regions.find(r => getPlateCodeForRegion(r) === plateFromFeature);
            if (!reg) return;
            
            // Prioritize district-specific properties to avoid matching province name
            const rawDistName = feat.properties.NAME_2 ||
              feat.properties.ilce_adi ||
              feat.properties.ILCE_ADI ||
              feat.properties.district ||
              feat.properties.name ||
              feat.properties.NAME ||
              '';
            
            let center = provinceCentersRef.current[reg.id] || { lat: 38.9637, lng: 35.2433 };
            const fallback = TURKEY_MAP_MUNICIPALITIES_GEOGRAPHIC.find(p => p.id === reg.id);
            if (fallback) center = { lat: fallback.lat, lng: fallback.lng };
            
            const dList = getDeterministicDistricts(reg, center);
            
            // Find matched district inside deterministic state utilizing normalized names
            const normDistName = normalizeName(String(rawDistName));
            let matchedD = dList.find(d => normalizeName(d.name) === normDistName);
            
            if (!matchedD) {
              matchedD = dList.find(d => {
                const dn = normalizeName(d.name);
                return dn.includes(normDistName) || normDistName.includes(dn);
              });
            }
            
            // Re-resolve or deterministic fallback for unmapped counties/villages
            if (!matchedD) {
              matchedD = {
                name: String(rawDistName),
                population: 45000,
                supports: { ...reg.supports },
                winnerParty: reg.ownerPartyId || 'AKP',
                mayorName: 'Meliha Kaplan',
                lat: center.lat,
                lng: center.lng,
                provinceId: reg.id
              };
            }
            
            mappedFeatures.push({
              ...feat,
              properties: {
                ...feat.properties,
                provinceId: reg.id,
                provinceName: reg.name,
                districtName: matchedD.name,
                isDistrict: true,
                population: matchedD.population,
                supports: matchedD.supports,
                winnerParty: matchedD.winnerParty,
                mayorName: matchedD.mayorName,
                center: [matchedD.lat, matchedD.lng],
                // Mirror properties to fulfill the user's fallback pattern
                name: matchedD.name,
                NAME_2: matchedD.name,
                ilce_adi: matchedD.name,
                ILCE_ADI: matchedD.name,
                district: matchedD.name
              }
            });
          });
          
          displayGeoJson = {
            type: 'FeatureCollection',
            features: mappedFeatures
          };
        } else {
          // Fallback to beautiful pseudo Voronoi subdivision if district map is still loading
          const districtFeatures: any[] = [];
          geoJsonData.features.forEach((feat: any) => {
            if (!feat || !feat.properties) return;
            const normName = normalizeName(getFeatureName(feat));
            const regionId = getRegionIdFromNormalizedName(normName, country.id);
            if (regionId) {
              const reg = country.regions.find(r => r.id === regionId || normalizeName(r.id) === regionId);
              if (reg) {
                const defaultCenter = country.id === 'DE' ? { lat: 51.1657, lng: 10.4515 } : country.id === 'US' ? { lat: 37.0902, lng: -95.7129 } : { lat: 38.9637, lng: 35.2433 };
                let center = provinceCentersRef.current[reg.id] || getPolygonCenter(feat) || defaultCenter;
                const fallback = TURKEY_MAP_MUNICIPALITIES_GEOGRAPHIC.find(p => p.id === reg.id);
                if (fallback) center = { lat: fallback.lat, lng: fallback.lng };
                const dList = getDeterministicDistricts(reg, center);
                const subs = subdivideProvinceGeoJson(feat, reg, dList);
                districtFeatures.push(...subs);
              } else {
                districtFeatures.push(feat);
              }
            } else {
              districtFeatures.push(feat);
            }
          });
          displayGeoJson = {
            type: 'FeatureCollection',
            features: districtFeatures
          };
        }
      }

      if (worldGeoJsonData && worldGeoJsonData.features) {
        const filteredFeatures = worldGeoJsonData.features.filter((f: any) => {
          const fName = String(f?.properties?.name || f?.properties?.NAME || f?.id || '').toLowerCase();
          const fId = String(f?.id || f?.properties?.ISO_A3 || '').toUpperCase();
          if (country.id === 'TR' && (fName.includes('turkey') || fName.includes('turkiye') || fId === 'TUR')) return false;
          if ((country.id === 'DE' || country.id === 'DDR') && (fName.includes('germany') || fId === 'DEU' || fId === 'DDR')) return false;
          if (country.id === 'US' && (fName.includes('united states') || fName.includes('usa') || fId === 'USA')) return false;
          if (country.id === 'SU' && (['RUS', 'UKR', 'BLR', 'KAZ', 'UZB', 'TKM', 'TJK', 'KGZ', 'GEO', 'ARM', 'AZE', 'MDA', 'EST', 'LVA', 'LTU', 'SUN'].includes(fId) || fName.includes('russia') || fName.includes('soviet'))) return false;
          if (country.id === 'YU' && (['SRB', 'HRV', 'SVN', 'BIH', 'MKD', 'MNE', 'KOS', 'KVX', 'YUG'].includes(fId) || fName.includes('yugoslavia') || fName.includes('serbia') || fName.includes('croatia') || fName.includes('kosovo') || fName.includes('bosnia') || fName.includes('slovenia') || fName.includes('macedonia') || fName.includes('montenegro'))) return false;
          if (country.id === 'CS' && (['CZE', 'SVK', 'CSK'].includes(fId) || fName.includes('czech') || fName.includes('slovak'))) return false;
          if (country.id === 'PL' && (fId === 'POL' || fName.includes('poland'))) return false;
          if (country.id === 'CN' && (fId === 'CHN' || fName.includes('china'))) return false;
          if (country.id === 'FR' && (fName.includes('france') || fId === 'FRA' || fId === 'DZA' || fId === 'MDG' || fId === 'GUF' || fName.includes('algeria') || fName.includes('madagascar'))) return false;
          if (country.id === 'GB' && (fName.includes('united kingdom') || fId === 'GBR' || fId === 'GB' || (['KEN', 'UGA', 'NGA', 'GHA', 'MYS', 'CYP', 'TZA', 'ZMB', 'ZWE', 'SLE'].includes(fId)))) return false;
          if (country.id === 'IT' && (fId === 'ITA' || fName.includes('italy') || fName.includes('italia'))) return false;
          return true;
        });

        worldBgLayerRef.current = L.geoJSON({ type: 'FeatureCollection', features: filteredFeatures } as any, {
          style: (feature: any) => {
            const fId = String(feature?.id || feature?.properties?.ISO_A3 || '').toUpperCase();
            const fName = String(feature?.properties?.name || feature?.properties?.NAME || '').toLowerCase();
            const isSovietUnion = ['RUS', 'UKR', 'BLR', 'KAZ', 'UZB', 'TKM', 'TJK', 'KGZ', 'GEO', 'ARM', 'AZE', 'MDA', 'EST', 'LVA', 'LTU', 'SUN'].includes(fId) || fName.includes('russia') || fName.includes('soviet');
            const isYugo = ['SRB', 'HRV', 'SVN', 'BIH', 'MKD', 'MNE', 'KOS', 'KVX', 'YUG'].includes(fId) || fName.includes('serbia') || fName.includes('croatia') || fName.includes('bosnia') || fName.includes('slovenia') || fName.includes('macedonia') || fName.includes('montenegro');
            const isCzecho = ['CZE', 'SVK', 'CSK'].includes(fId) || fName.includes('czech') || fName.includes('slovakia');
            const isHistoricalUnified = isSovietUnion || isYugo || isCzecho;

            return {
              fillColor: darkMode ? "#334155" : "#94a3b8",
              color: isHistoricalUnified ? (darkMode ? "#334155" : "#94a3b8") : "#ffffff",
              weight: isHistoricalUnified ? 0.2 : 0.8,
              opacity: 0.85,
              fillOpacity: 0.85,
              interactive: false
            };
          }
        }).addTo(map);
      }
      const geoLayer = L.geoJSON(displayGeoJson, {
        style: (feature) => {
          if (!feature || !feature.properties) return {};
          
          if (feature.properties.isDistrict) {
            const dWinner = feature.properties.winnerParty;
            const isMe = dWinner === party.id;
            const col = isMe ? party.color : getRivalColor(dWinner);
            
            const selectedProvincePlateCode = getPlateCodeForRegion(selectedRegion);
            const plateFromFeature = String(feature.properties.parent_id || feature.properties.id || '').match(/TR-[PD]-(\d+)/)?.[1];
            const isSelectedProvince = plateFromFeature === selectedProvincePlateCode;
            
            const isThisDistrictSelected = selectedDistrict && 
              selectedDistrict.name === feature.properties.districtName &&
              selectedDistrict.provinceId === feature.properties.provinceId;
            
            if (isThisDistrictSelected) {
              return {
                fillColor: col,
                fillOpacity: 0.95,
                color: '#ffffff',
                opacity: 1.0,
                weight: 2.5
              };
            }

            return {
              fillColor: isSelectedProvince ? col : '#888',
              fillOpacity: isSelectedProvince ? 0.75 : 0.15,
              color: '#ffffff',
              opacity: 1.0,
              weight: isSelectedProvince ? 1.2 : 0.5,
            };
          }

          const normName = normalizeName(getFeatureName(feature));
          let regionId = getRegionIdFromNormalizedName(normName, country.id);
          let reg = country.regions.find(r => r.id === regionId || normalizeName(r.id) === regionId);
          if (!reg) {
            reg = country.regions.find(r => normalizeName(r.id) === normName || normalizeName(r.name) === normName);
          }
          if (reg) {
            regionId = reg.id;
          }
          
          if (reg) {
              const isSelected = selectedRegion && selectedRegion.id === regionId;
              
              // Get leading party color
              let maxSupport = 0;
              let leadingPartyId = reg.ownerPartyId;
              Object.entries(reg.supports).forEach(([pid, val]) => {
                const valNum = val as number;
                if (valNum > maxSupport) {
                  maxSupport = valNum;
                  leadingPartyId = pid;
                }
              });

              const isMe = leadingPartyId === party.id;
              const col = isMe ? party.color : getRivalColor(leadingPartyId);

              return {
                fillColor: col,
                fillOpacity: isSelected ? 0.95 : 0.82,
                color: '#ffffff',
                opacity: 1.0,
                weight: isSelected ? 3.5 : 1.2,
              };
            }

          // Non-modeled provinces
          return {
            fillColor: darkMode ? '#111827' : '#f3f4f6',
            fillOpacity: 0.5,
            color: '#ffffff',
            opacity: 1.0,
            weight: 1.0,
          };
        },
        onEachFeature: (feature, layer) => {
          if (!feature || !feature.properties) return;

          if (feature.properties.isDistrict) {
            const props = feature.properties || {};
            const districtName =
              props.name ||
              props.NAME_2 ||
              props.ilce_adi ||
              props.ILCE_ADI ||
              props.district ||
              props.districtName ||
              'Unknown';

            // Log GeoJSON feature properties once as requested
            if (!(window as any).hasLoggedDistrictProps) {
              (window as any).hasLoggedDistrictProps = true;
              console.log('district props sample:', props);
            }

            const onDistrictClick = (dName: string, feat: any) => {
              try {
                map.closeTooltip();
              } catch (e) {}
              const parentReg = country.regions.find(r => r.id === feat.properties.provinceId);
              if (parentReg) {
                setSelectedRegion(parentReg);
                const dData = {
                  name: dName,
                  population: feat.properties.population,
                  supports: feat.properties.supports,
                  winnerParty: feat.properties.winnerParty,
                  mayorName: feat.properties.mayorName,
                  lat: feat.properties.center ? feat.properties.center[0] : 39,
                  lng: feat.properties.center ? feat.properties.center[1] : 35,
                  provinceId: feat.properties.provinceId
                };
                setSelectedDistrict(dData);
                setActiveViewLevel('district');
              }
            };

            // Click handler for district polygon
            layer.on('click', () => onDistrictClick(districtName, feature));

            // Mouseover highlights
            layer.on('mouseover', () => {
              if (map && map.hasLayer && map.hasLayer(layer)) {
                (layer as any).setStyle({
                  fillOpacity: 0.95,
                  weight: 3.2,
                  color: '#ffffff'
                });
                if ((layer as any).bringToFront) {
                  try {
                    (layer as any).bringToFront();
                  } catch (e) {}
                }
              }
            });

            layer.on('mouseout', () => {
              const dWinner = feature.properties.winnerParty;
              const isMe = dWinner === party.id;
              const col = isMe ? party.color : getRivalColor(dWinner);

              const selectedProvincePlateCode = getPlateCodeForRegion(selectedRegion);
              const plateFromFeature = String(feature.properties.parent_id || feature.properties.id || '').match(/TR-[PD]-(\d+)/)?.[1];
              const isSelectedProvince = plateFromFeature === selectedProvincePlateCode;

              const isThisDistrictSelected = selectedDistrict && 
                selectedDistrict.name === districtName &&
                selectedDistrict.provinceId === feature.properties.provinceId;
              
              if (isThisDistrictSelected) {
                (layer as any).setStyle({
                  fillColor: col,
                  fillOpacity: 0.95,
                  color: '#ffffff',
                  opacity: 0.95,
                  weight: 2.5
                });
              } else {
                (layer as any).setStyle({
                  fillColor: isSelectedProvince ? col : '#888',
                  fillOpacity: isSelectedProvince ? 0.75 : 0.15,
                  color: '#ffffff',
                  opacity: isSelectedProvince ? 0.75 : 0.15,
                  weight: isSelectedProvince ? 1.2 : 0.4
                });
              }
            });

            // Tooltips
            const supportHtmlList = Object.entries(feature.properties.supports as Record<string, number>)
              .sort(([, a], [, b]) => b - a)
              .map(([pid, val]) => {
                const isMe = pid === party.id;
                const pName = isMe ? party.name : getRivalName(pid);
                const pColor = isMe ? party.color : getRivalColor(pid);
                return `<div class="flex items-center justify-between gap-3 text-[10px] font-mono leading-tight mt-0.5" style="color: ${pColor}; font-weight: ${isMe ? 'bold' : 'normal'}">
                  <span>${pName}:</span>
                  <span>%${val.toFixed(1)}</span>
                </div>`;
              }).join('');

            layer.bindTooltip(`
              <div class="p-1.5 text-xs font-sans text-slate-100 flex flex-col gap-1">
                <strong class="block text-sm border-b border-slate-700/50 pb-1 text-white">${districtName}</strong>
                <div class="text-[10px] text-slate-400">${regionLabel}: <strong class="text-slate-300">${feature.properties.provinceName}</strong></div>
                <div class="text-[10px] text-slate-400">${country.id === 'US' ? 'Governor' : country.id === 'DE' ? 'Minister-President' : 'Mayor'}: <strong class="text-slate-300">${feature.properties.mayorName || 'N/A'}</strong></div>
                <div class="text-[10px] text-slate-400 font-mono">Population: <strong class="text-slate-300">${feature.properties.population.toLocaleString()}</strong></div>
                <div class="mt-1 pt-1 border-t border-slate-800/40">${supportHtmlList}</div>
              </div>
            `, {
              direction: 'top',
              sticky: true,
              opacity: 0.98,
              className: 'custom-map-tooltip'
            });

            return;
          }

          const normName = normalizeName(getFeatureName(feature));
          let regionId = getRegionIdFromNormalizedName(normName, country.id);

          let reg = country.regions.find(r => r.id === regionId || normalizeName(r.id) === regionId);
          if (!reg) {
            reg = country.regions.find(r => normalizeName(r.id) === normName || normalizeName(r.name) === normName);
          }
          if (reg) {
            regionId = reg.id;
          }
          if (!reg) return;

          // Save center coordinates dynamically
          if ((layer as any).getBounds) {
            try {
              const center = (layer as any).getBounds().getCenter();
              provinceCentersRef.current[regionId] = { lat: center.lat, lng: center.lng };
            } catch (e) {}
          }

          const isSelected = selectedRegion && selectedRegion.id === regionId;

          // Bring selected layer to absolute front to solve overlapping and border blending bugs
          if (isSelected && (layer as any).bringToFront) {
            setTimeout(() => {
              try {
                if (map && map.hasLayer && map.hasLayer(layer)) {
                  (layer as any).bringToFront();
                }
              } catch (e) {}
            }, 60);
          }

          // Interactive clicks
          layer.on('click', () => {
            try {
              map.closeTooltip();
            } catch (e) {}
            setSelectedRegion(reg);
            if ((layer as any).getBounds) {
              selectedRegionBoundsRef.current = (layer as any).getBounds();
            }
          });

          // Interactive mouseover for rich feedback
          layer.on('mouseover', () => {
            if (map && map.hasLayer && map.hasLayer(layer)) {
              (layer as any).setStyle({
                fillOpacity: 0.95,
                weight: 3.2,
                color: '#ffffff'
              });
              if ((layer as any).bringToFront) {
                try {
                  (layer as any).bringToFront();
                } catch (e) {}
              }
            }
          });
          
          layer.on('mouseout', () => {
            if (map && map.hasLayer && map.hasLayer(layer)) {
              const liveSelected = selectedRegion && selectedRegion.id === regionId;
              (layer as any).setStyle({
                fillOpacity: liveSelected ? 0.95 : 0.82,
                color: '#ffffff',
                weight: liveSelected ? 3.8 : 1.5
              });
              if (liveSelected && (layer as any).bringToFront) {
                try {
                  (layer as any).bringToFront();
                } catch (e) {}
              }
            }
          });

          // Rich dynamic support breakdown list for tooltips
          const rivalHtmlList = Object.entries(reg.supports)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .map(([pid, val]) => {
              const isMe = pid === party.id;
              const pName = isMe ? party.name : getRivalName(pid);
              const pColor = isMe ? party.color : getRivalColor(pid);
              const valNum = val as number;
              return `<div class="flex items-center justify-between gap-3 text-[10px] font-mono leading-tight mt-0.5" style="color: ${pColor}; font-weight: ${isMe ? 'bold' : 'normal'}">
                <span>${pName}:</span>
                <span>%${valNum.toFixed(1)}</span>
              </div>`;
            }).join('');

          layer.bindTooltip(`
            <div class="p-1.5 text-xs font-sans text-slate-100 flex flex-col gap-1">
              <strong class="block text-sm border-b border-slate-700/50 pb-1 text-white">${reg.name}</strong>
              <div class="text-[10px] text-slate-400">${country.id === 'US' ? 'Governor' : country.id === 'DE' ? 'Minister-President' : 'Mayor'}: <strong class="text-slate-200">${reg.mayorName || getPartyGovernorForRegion(reg.name, reg.ownerPartyId, country.id, party, country.rivals)}</strong></div>
              <div class="mt-1 pt-1 border-t border-slate-800/40">
                ${rivalHtmlList}
              </div>
            </div>
          `, {
            direction: 'top',
            sticky: true,
            opacity: 0.98,
            className: 'custom-map-tooltip'
          });
        }
      }).addTo(map);

      turkeyGeoJsonLayerRef.current = geoLayer;
      
      if (hasFitBoundsForCountryRef.current !== country.id) {
        try {
          map.fitBounds(geoLayer.getBounds(), { padding: [20, 20], animate: false });
          hasFitBoundsForCountryRef.current = country.id;
        } catch(e) {}
      }

      // In DISTRICTS mode we hide the province outlines layer entirely — only the district layer is drawn
      provinceOverlayLayerRef.current = null;
    worldBgLayerRef.current = null;
    } else {
      // Fallback: Render point check markers if geoJsonData hasn't finished loading over network yet
      const coordEntry = defaultCoordsMap[country.id] || [38.9637, 35.2433, 5];
      country.regions.forEach((reg, idx) => {
        let lat = 0;
        let lng = 0;
        const centerCoord = provinceCentersRef.current[reg.id];
        const geoProv = TURKEY_MAP_MUNICIPALITIES_GEOGRAPHIC.find(p => p.id === reg.id);

        if (centerCoord) {
          lat = centerCoord.lat;
          lng = centerCoord.lng;
        } else if (geoProv) {
          lat = geoProv.lat;
          lng = geoProv.lng;
        } else {
          const total = Math.max(1, country.regions.length);
          const angle = (idx / total) * 2 * Math.PI;
          const radius = 1.2 + (idx % 3) * 0.7;
          lat = coordEntry[0] + Math.sin(angle) * radius;
          lng = coordEntry[1] + Math.cos(angle) * radius * 1.35;
        }

        // Save center coordinates dynamically
        provinceCentersRef.current[reg.id] = { lat, lng };

        const isSelected = selectedRegion && selectedRegion.id === reg.id;
        
        let maxSupport = 0;
        let leadingPartyId = reg.ownerPartyId;
        Object.entries(reg.supports).forEach(([pid, val]) => {
          const numVal = val as number;
          if (numVal > maxSupport) {
            maxSupport = numVal;
            leadingPartyId = pid;
          }
        });

        let color = '#64748b';
        if (leadingPartyId === party.id) {
          color = party.color;
        } else {
          color = getRivalColor(leadingPartyId);
        }

        const marker = L.circleMarker([lat, lng], {
          radius: isSelected ? 14 : 9,
          fillColor: color,
          fillOpacity: isSelected ? 0.95 : 0.75,
          color: isSelected ? color : (darkMode ? '#1e293b' : '#cbd5e1'),
          weight: isSelected ? 3.0 : 1.2,
        });

        marker.on('click', () => {
          setSelectedRegion(reg);
        });

        const rivalHtmlList = Object.entries(reg.supports)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .map(([pid, val]) => {
            const isMe = pid === party.id;
            const pName = isMe ? party.name : getRivalName(pid);
            const pColor = isMe ? party.color : getRivalColor(pid);
            const valNum = val as number;
            return `<div class="flex items-center justify-between gap-3 text-[10px] font-mono leading-tight mt-0.5" style="color: ${pColor}; font-weight: ${isMe ? 'bold' : 'normal'}">
              <span>${pName}:</span>
              <span>%${valNum.toFixed(1)}</span>
            </div>`;
          }).join('');

        marker.bindTooltip(`
          <div class="p-1 px-1.5 text-xs font-sans text-slate-100 flex flex-col gap-1">
            <strong class="block text-sm border-b border-slate-700/50 pb-1 text-white">${reg.name}</strong>
            <div class="text-[10px] text-slate-400">${country.id === 'US' ? 'Governor' : country.id === 'DE' ? 'Minister-President' : 'Mayor'}: <strong class="text-slate-200">${reg.mayorName || getPartyGovernorForRegion(reg.name, reg.ownerPartyId, country.id, party, country.rivals)}</strong></div>
            <div class="mt-1 pt-1 border-t border-slate-800/40">
              ${rivalHtmlList}
            </div>
          </div>
        `, {
          direction: 'top',
          opacity: 0.98,
          className: 'custom-map-tooltip'
        });

        marker.addTo(map);
        turkeyMarkersRef.current.push(marker);
      });
    }

    // DISTRICT OVERLAY VIEW COGNITIVE FOCUS (Sets map viewport view in Turkish selected provinces)
    if (activeViewLevel === 'district' && selectedRegion) {
      if (lastSelectedRegionIdRef.current !== selectedRegion.id) {
        lastSelectedRegionIdRef.current = selectedRegion.id;
        let center = provinceCentersRef.current[selectedRegion.id] || { lat: 38.9637, lng: 35.2433 };
        const fallback = TURKEY_MAP_MUNICIPALITIES_GEOGRAPHIC.find(p => p.id === selectedRegion.id);
        if (fallback) {
          center = { lat: fallback.lat, lng: fallback.lng };
        }

        // Focus and zoom at a highly comfortable, natural level (7.5) instead of an abrupt 9.5
        // Disabled auto-zooming to preserve smooth navigation, just like in the province view ("direk normal olsun ildeki gibi")
        // map.setView([center.lat, center.lng], 7.5, { animate: true });
      }
    } else {
      lastSelectedRegionIdRef.current = null;
    }

    setTimeout(() => { try { if (turkeyMapInstanceRef.current) turkeyMapInstanceRef.current.invalidateSize(); } catch(e) {} }, 250);

  }, [country, selectedRegion, darkMode, worldGeoJsonData, geoJsonData, districtGeoJsonData, activeViewLevel, selectedDistrict]);

  const currency = country.id === 'TR' ? '₺' 
    : ['DE', 'IT', 'ES'].includes(country.id) ? '€' 
    : country.id === 'ZA' ? 'R' 
    : country.id === 'IN' ? '₹' 
    : country.id === 'ID' ? 'Rp' 
    : country.id === 'KR' ? '₩' 
    : '$';
  const handleLaunchDistrictCampaign = (type: 'townhall' | 'flyers') => {
    const finalCost = type === 'townhall' ? 15000 : 5000;
    if (party.budget < finalCost) {
      setCustomAlert({
        title: 'Insufficient Budget',
        message: `You need at least ${finalCost.toLocaleString()} ${currency} to launch this local campaign.`,
        type: 'warning'
      });
      return;
    }

    // Boost amount in district
    const districtBoost = type === 'townhall' 
      ? (6.0 + Math.random() * 4 + (party.traits.charisma * 0.5))
      : (3.0 + Math.random() * 3 + (party.traits.organization * 0.4));

    // Calculate sibling districts to see proportional weight of this district
    const center = provinceCentersRef.current[selectedRegion.id] || { lat: 38.9637, lng: 35.2433 };
    const fallback = TURKEY_MAP_MUNICIPALITIES_GEOGRAPHIC.find(p => p.id === selectedRegion.id);
    const resolvedCenter = fallback ? { lat: fallback.lat, lng: fallback.lng } : center;
    const allDistricts = getDeterministicDistricts(selectedRegion, resolvedCenter);
    const totalPopulation = allDistricts.reduce((sum, d) => sum + d.population, 0);
    const proportion = selectedDistrict.population / (totalPopulation || 1);

    // Dynamic shift proportional to the district's weight in the province
    const provinceBoost = districtBoost * proportion;

    // Shift in the district itself
    const updatedDistrictSupports = { ...selectedDistrict.supports };
    const oldPlayerSupport = updatedDistrictSupports[party.id] || 0;
    const newPlayerSupport = Math.min(95, oldPlayerSupport + districtBoost);
    const districtChange = newPlayerSupport - oldPlayerSupport;
    
    const otherParties = Object.keys(updatedDistrictSupports).filter(id => id !== party.id);
    const totalOthers = otherParties.reduce((sum: number, id) => sum + ((updatedDistrictSupports[id] as number) || 0), 0);
    if (totalOthers > 0) {
      otherParties.forEach(id => {
        const share = ((updatedDistrictSupports[id] as number) || 0) / totalOthers;
        updatedDistrictSupports[id] = Math.max(0.1, ((updatedDistrictSupports[id] as number) || 0) - (districtChange * share));
      });
    }
    updatedDistrictSupports[party.id] = newPlayerSupport;

    const finalSum: number = Object.values(updatedDistrictSupports).reduce((s: number, v: any): number => s + (v as number), 0) as number;
    if (Math.abs(finalSum - 100) > 0.1) {
      const scale: number = 100 / finalSum;
      Object.keys(updatedDistrictSupports).forEach(k => {
        updatedDistrictSupports[k] = (updatedDistrictSupports[k] as number) * scale;
      });
    }

    // Update parent region support
    const updatedRegion = boostRegionPlayerSupport(selectedRegion, provinceBoost);

    // Update state with nationwide spillover to other regions
    const updatedRegions = country.regions.map(r => {
      if (r.id === selectedRegion.id) {
        return updatedRegion;
      } else {
        // Flyer spillover: +0.08%, Townhall spillover: +0.25%
        const spillover = type === 'townhall' ? 0.25 : 0.08;
        return boostRegionPlayerSupport(r, spillover);
      }
    });
    const updatedCountry = { ...country, regions: updatedRegions };
    onUpdateCountry(updatedCountry);

    const updatedParty = {
      ...party,
      budget: party.budget - finalCost,
      influence: party.influence + (type === 'townhall' ? 2 : 1),
      members: party.members + Math.floor(districtBoost * 15)
    };
    onUpdateParty(updatedParty);
    

    // Sync selectedRegion & selectedDistrict
    setSelectedRegion(updatedRegion);
    setSelectedDistrict({
      ...selectedDistrict,
      supports: updatedDistrictSupports,
      winnerParty: Object.entries(updatedDistrictSupports).reduce((lead, [p, v]) => v > (updatedDistrictSupports[lead] || 0) ? p : lead, party.id)
    });

    setCustomAlert({
      title: 'Local Campaign Launched',
      message: `Successfully launched campaign in ${selectedDistrict.name}:\n• Local support rose by +${districtBoost.toFixed(1)}%\n• Province support rose by +${provinceBoost.toFixed(2)}% proportional to population weight.`,
      type: 'success'
    });
  };

  // Run a rally! (-$75k, triggers speech option)
  const handleStartRally = () => {
    const cost = 75000;
    if (party.budget < cost) {
      setCustomAlert({
        title: 'Insufficient Budget',
        message: 'You need at least ' + cost.toLocaleString() + ' ' + currency + ' to host a rally.',
        type: 'warning'
      });
      return;
    }

    const updatedParty = { ...party, budget: party.budget - cost };
    onUpdateParty(updatedParty);

    const randomIndex = Math.floor(Math.random() * SPEECH_CARDS_POOL.length);
    setActiveSpeechCard(SPEECH_CARDS_POOL[randomIndex]);
    setSpeechFeedback(null);
  };

  // Run a local digital advertisement campaign (-$40k, flat boost)
  const handleStartAdCampaign = (region: Region) => {
    const cost = 40000;
    if (party.budget < cost) {
      setCustomAlert({
        title: 'Insufficient Budget',
        message: 'You need at least ' + cost.toLocaleString() + ' ' + currency + ' to start an ad campaign.',
        type: 'warning'
      });
      return;
    }

    const boost = 3.5 + Math.floor(Math.random() * 3) + (party.traits.eloquence * 0.4);
    const updatedRegion = boostRegionPlayerSupport(region, boost);

    // Online ads have nationwide reach: +0.8% to +1.2% to all other regions
    const updatedRegions = country.regions.map(r => {
      if (r.id === region.id) {
        return updatedRegion;
      } else {
        const spillover = 0.8 + (party.traits.eloquence * 0.1);
        return boostRegionPlayerSupport(r, spillover);
      }
    });
    const updatedCountry = { ...country, regions: updatedRegions };
    onUpdateCountry(updatedCountry);

    const updatedParty = { 
      ...party, 
      budget: party.budget - cost,
      influence: party.influence + 4 
    };
    onUpdateParty(updatedParty);
    
    setSelectedRegion(updatedRegion);
  };

  // Build a physical party headquarters (-$110k, permanent infrastructure upgrade)
  const handleUpgradeInfrastructure = (region: Region) => {
    const cost = 110000;
    if (party.budget < cost) {
      setCustomAlert({
        title: 'Insufficient Budget',
        message: 'You need at least ' + cost.toLocaleString() + ' ' + currency + ' to establish a headquarters.',
        type: 'warning'
      });
      return;
    }

    if (region.infrastructure >= 5) {
      setCustomAlert({
        title: 'Headquarters Limit Reached',
        message: 'The party organization and infrastructure in this region is already at the maximum level (5/5)!',
        type: 'info'
      });
      return;
    }

    const updatedRegion = {
      ...region,
      infrastructure: Math.min(5, region.infrastructure + 1),
      campaignLevel: region.campaignLevel + 1
    };

    const extraBoost = 4;
    const finalRegion = boostRegionPlayerSupport(updatedRegion, extraBoost);

    // Establishing a headquarters shows organic party scaling: +0.5% nationwide spillover
    const updatedRegions = country.regions.map(r => {
      if (r.id === region.id) {
        return finalRegion;
      } else {
        return boostRegionPlayerSupport(r, 0.5);
      }
    });
    const updatedCountry = { ...country, regions: updatedRegions };
    onUpdateCountry(updatedCountry);

    const updatedParty = {
      ...party,
      budget: party.budget - cost,
      members: party.members + 800,
      influence: party.influence + 12
    };
    onUpdateParty(updatedParty);
    
    setSelectedRegion(finalRegion);
  };

  // Helper logic to shift supports from rivals to player
  const boostRegionPlayerSupport = (r: Region, amount: number): Region => {
    const supports = { ...r.supports };
    const playerSupport = supports[party.id] || 0;
    const targetSupport = Math.min(95, playerSupport + amount);
    const change = targetSupport - playerSupport;

    const otherParties = Object.keys(supports).filter(id => id !== party.id);
    const totalOtherSupport = otherParties.reduce((sum, id) => sum + (supports[id] || 0), 0);

    if (totalOtherSupport > 0) {
      otherParties.forEach(id => {
        const share = (supports[id] || 0) / totalOtherSupport;
        supports[id] = Math.max(0.1, (supports[id] || 0) - (change * share));
      });
    }
    supports[party.id] = targetSupport;

    const finalSum = Object.values(supports).reduce((s, v) => s + v, 0);
    if (Math.abs(finalSum - 100) > 0.1) {
      const scale = 100 / finalSum;
      Object.keys(supports).forEach(k => {
        supports[k] = supports[k] * scale;
      });
    }

    return { ...r, supports };
  };

  const handleSelectSpeechChoice = (choice: SpeechChoice) => {
    let finalFeedback = choice.impactText + ' ';
    const eloquenceMult = 1 + (party.traits.eloquence * 0.08);

    let updatedRegion = { ...selectedRegion };
    const supports = { ...updatedRegion.supports };

    let playerShift = 0;
    Object.entries(choice.voterImpacts).forEach(([vgroup, rate]) => {
      const voterRatio = selectedRegion.voterDistribution[vgroup as VoterGroup] || 10;
      const shiftPercent = (voterRatio / 100) * (rate as number) * (rate > 0 ? eloquenceMult : 1);
      playerShift += shiftPercent;
    });

    const currentSupport = supports[party.id] || 0;
    const nextSupport = Math.min(95, Math.max(1, currentSupport + playerShift));
    const finalChange = nextSupport - currentSupport;

    const rivals = Object.keys(supports).filter(id => id !== party.id);
    const rivalsTotal = rivals.reduce((sum, id) => sum + (supports[id] || 0), 0);
    if (rivalsTotal > 0) {
      rivals.forEach(id => {
        const portion = (supports[id] || 0) / rivalsTotal;
        supports[id] = Math.max(0.1, (supports[id] || 0) - (finalChange * portion));
      });
    }
    supports[party.id] = nextSupport;
    updatedRegion.supports = supports;

    // Rallies are high-profile national media events: +1.0% to +1.6% to all other regions
    const updatedRegions = country.regions.map(r => {
      if (r.id === selectedRegion.id) {
        return updatedRegion;
      } else {
        const spillover = 1.0 + (party.traits.eloquence * 0.15);
        return boostRegionPlayerSupport(r, spillover);
      }
    });
    const updatedCountry = { ...country, regions: updatedRegions };
    onUpdateCountry(updatedCountry);

    const finalBudget = Math.max(0, party.budget - choice.budgetCost);
    const finalInfluence = Math.max(0, party.influence + choice.influenceMod);
    const finalMembers = Math.max(100, party.members + Math.round(finalChange * 450));

    const updatedParty = {
      ...party,
      budget: finalBudget,
      influence: finalInfluence,
      members: finalMembers,
    };
    onUpdateParty(updatedParty);
    

    finalFeedback += ` Your regional support changed by %${finalChange >= 0 ? '+' : ''}${finalChange.toFixed(1)} under this demographic wave.`;
    setSpeechFeedback(finalFeedback);
    setSelectedRegion(updatedRegion);
  };

  const handleCloseSpeech = () => {
    setActiveSpeechCard(null);
    setSpeechFeedback(null);
  };

  const getRivalColor = (rivalId: string) => {
    const rival = country.rivals.find(r => r.id === rivalId);
    return rival ? rival.color : '#64748b';
  };

  const getRivalName = (id: string) => {
    if (id === party.id) return party.name + ' (You)';
    const r = country.rivals.find(riv => riv.id === id);
    return r ? r.name : 'Other';
  };

  return (
    <div className="flex flex-col gap-6 w-full py-2">
      <div className="flex justify-between items-center p-4 md:p-6 rounded-3xl border bg-slate-900/60 border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-white">Campaign & Operations</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Strategize, manage budget, and increase your local support.</p>
        </div>
        <button
          onClick={onSpendTurn}
          className="px-6 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all uppercase tracking-wide"
        >
          Advance Turn ⏩
        </button>
      </div>
      <style>{`
        /* Remove browser default focus outline rectangles on interactive SVG layers in Leaflet */
        .leaflet-container *,
        .leaflet-container *:focus,
        .leaflet-container *:active,
        .leaflet-container *:focus-visible,
        .leaflet-interactive,
        .leaflet-interactive:focus,
        .leaflet-interactive:active,
        .leaflet-interactive:focus-visible,
        path.leaflet-interactive,
        path.leaflet-interactive:focus,
        path.leaflet-interactive:active,
        path.leaflet-interactive:focus-visible,
        .leaflet-container svg path,
        .leaflet-container svg path:focus,
        .leaflet-container svg path:focus-visible,
        svg:focus,
        svg *,
        g,
        g:focus,
        path:focus {
          outline: none !important;
          outline-style: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .custom-map-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(51, 65, 85, 0.3) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
          color: #f1f5f9 !important;
          padding: 4px 8px !important;
        }
        .custom-map-tooltip::before {
          border-top-color: rgba(15, 23, 42, 0.95) !important;
        }
      `}</style>
      {/* 1. INTERACTIVE MAP SECTION (ALL SCENARIOS AND REGIONAL COUNTRIES) */}
      {Boolean(country.regions && country.regions.length > 0) && (
        <div className={`p-4 md:p-6 rounded-3xl border flex flex-col gap-5 relative overflow-hidden transition-all ${
          darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] tracking-widest font-mono text-indigo-400 font-bold uppercase">GEOGRAPHICAL MAP (2024 BASE)</span>
            <h3 className="text-xl font-bold tracking-tight">
              {country.id === 'US' ? `${country.name} Presidential & State Control GIS Map` : country.id === 'DE' ? `${country.name} Federal State Control GIS Map` : `${country.name} Regional Control GIS Map`}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click on a {country.id === 'DE' ? 'state' : country.id === 'US' ? 'state' : 'region'} directly on the geographic Leaflet map to select it. The colors represent leading candidate control, and its real-time polls appear instantly in the right-hand panel.
            </p>
          </div>

          {/* National Polling Averages */}
          <div className={`p-4 rounded-xl border flex flex-wrap gap-4 mt-2 ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-full text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">National Polling Averages</div>
            {(() => {
              const totals: Record<string, number> = {};
              let totalSeats = 0;
              country.regions.forEach(r => {
                totalSeats += r.seats;
                Object.entries(r.supports).forEach(([pid, val]) => {
                  if (!totals[pid]) totals[pid] = 0;
                  totals[pid] += (val as number) * r.seats;
                });
              });
              const results: { id: string; name: string; color: string; val: number }[] = [];
              Object.entries(totals).forEach(([pid, val]) => {
                const percentage = totalSeats > 0 ? val / totalSeats : 0;
                const isMe = pid === party.id;
                const pName = isMe ? party.name : getRivalName(pid);
                const pColor = isMe ? party.color : getRivalColor(pid);
                results.push({ id: pid, name: pName, color: pColor, val: percentage });
              });
              return results.sort((a, b) => b.val - a.val).map((poll) => (
                <div key={poll.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: poll.color }}></div>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{poll.name}</div>
                  <div className="text-sm font-mono text-slate-400">%{poll.val.toFixed(1)}</div>
                </div>
              ));
            })()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Map Container Column */}
            <div className="lg:col-span-8 h-[380px] relative rounded-2xl overflow-hidden border border-slate-500/10 shadow-lg">
              <div 
                ref={turkeyMapRef} 
                className="absolute inset-0 w-full h-full z-10" 
              />
              {/* Custom Map Control Panel: Zoom and View Modes */}
              <div id="custom-map-controls" className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur border border-slate-700/50 p-1.5 rounded-xl shadow-2xl">
                {/* Zoom In */}
                <button
                  id="btn-zoom-in"
                  onClick={() => {
                    turkeyMapInstanceRef.current?.zoomIn();
                  }}
                  title="Zoom In"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-750 text-white font-bold transition-all"
                >
                  <ZoomIn size={16} />
                </button>
                {/* Zoom Out */}
                <button
                  id="btn-zoom-out"
                  onClick={() => {
                    turkeyMapInstanceRef.current?.zoomOut();
                  }}
                  title="Zoom Out"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-755 text-white font-bold transition-all"
                >
                  <ZoomOut size={16} />
                </button>
                
                {/* Divider vertical bar */}
                <div className="w-px h-5 bg-slate-700/65 mx-1" />
                
                {/* Provinces Mode Button */}
                <button
                  id="btn-view-provinces"
                  onClick={() => {
                    setActiveViewLevel('province');
                    setSelectedDistrict(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all select-none ${
                    activeViewLevel === 'province'
                      ? 'bg-indigo-600 text-white font-extrabold shadow'
                      : 'text-slate-300 hover:text-slate-100 bg-slate-800/40 hover:bg-slate-800'
                  }`}
                >
                  {regionsLabel}
                </button>
                
                {/* Districts Mode Button */}
                <button
                  id="btn-view-districts"
                  onClick={() => {
                    let center = provinceCentersRef.current[selectedRegion.id] || { lat: 38.9637, lng: 35.2433 };
                    const fallback = TURKEY_MAP_MUNICIPALITIES_GEOGRAPHIC.find(p => p.id === selectedRegion.id);
                    if (fallback) center = { lat: fallback.lat, lng: fallback.lng };
                    const dList = getDeterministicDistricts(selectedRegion, center);
                    setSelectedDistrict(dList[0]);
                    setActiveViewLevel('district');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all select-none ${
                    activeViewLevel === 'district'
                      ? 'bg-indigo-600 text-white font-extrabold shadow'
                      : 'text-slate-300 hover:text-slate-100 bg-slate-800/40 hover:bg-slate-800'
                  }`}
                >
                  Districts
                </button>

                {/* Real-time high-fidelity boundaries status indicator */}
                {activeViewLevel === 'district' && (
                  <>
                    <div className="w-px h-5 bg-slate-700/65 mx-1" />
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono tracking-wide text-slate-400 bg-slate-900/60 rounded-md">
                      {loadingDistrictGeoJson ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                          <span>Borders loading...</span>
                        </>
                      ) : districtGeoJsonData ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-emerald-400">Wikipedia Borders</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-450 animate-pulse" />
                          <span className="text-amber-400/95">Voronoi fallback</span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Province Stats Sidebar Column */}
            <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-2xl bg-black/5 dark:bg-black/20 border border-slate-500/5 h-[380px] overflow-hidden">
              {activeViewLevel === 'province' ? (
                <div className="flex flex-col gap-3 h-full overflow-hidden">
                  {/* Header Info */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-500/10 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📍</span>
                      <div>
                        <h4 className="font-bold text-sm tracking-tight leading-tight">{selectedRegion.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {country.id === 'US' ? 'PRESIDENTIAL POLLING' : country.id === 'DE' ? 'STATE ELECTION STATISTICS' : 'MUNICIPAL STATISTICS'}
                        </p>
                      </div>
                    </div>
                    <div className="text-[10px] bg-slate-500/10 text-slate-400 px-2.5 py-0.5 rounded-full font-mono font-bold">
                      {selectedRegion.seats} Seats
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex gap-1 bg-slate-500/10 p-1 rounded-xl shrink-0">
                    <button
                      onClick={() => {
                        setActiveViewLevel('province');
                        setSelectedDistrict(null);
                      }}
                      className="flex-1 text-center py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all bg-indigo-600 text-white font-extrabold shadow"
                    >
                      {regionLabel} View
                    </button>
                    <button
                      onClick={() => {
                        let center = provinceCentersRef.current[selectedRegion.id] || { lat: 38.9637, lng: 35.2433 };
                        const fallback = TURKEY_MAP_MUNICIPALITIES_GEOGRAPHIC.find(p => p.id === selectedRegion.id);
                        if (fallback) center = { lat: fallback.lat, lng: fallback.lng };
                        const d = getDeterministicDistricts(selectedRegion, center);
                        setSelectedDistrict(d[0]);
                        setActiveViewLevel('district');
                      }}
                      className="flex-1 text-center py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all text-slate-400 hover:text-slate-200"
                    >
                      District Explorer
                    </button>
                  </div>

                  {/* List of Candidates and Percentages */}
                  <div className="flex-grow overflow-y-auto pr-1 space-y-2.5 min-h-0 py-0.5">
                    {Object.entries(selectedRegion.supports)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([pid, val]) => {
                        const isMe = pid === party.id;
                        const pName = isMe ? party.name : getRivalName(pid);
                        const pColor = isMe ? party.color : getRivalColor(pid);
                        const valNum = val as number;

                        // Find leader portrait
                        let leaderName = '';
                        let leaderPhoto = '';
                        if (isMe) {
                          leaderName = party.leader;
                          leaderPhoto = country.id === 'DE' ? '' : (party.photo || '');
                        } else {
                          const rival = country.rivals.find(r => r.id === pid);
                          if (rival) {
                            leaderName = rival.leader;
                            leaderPhoto = rival.photo || '';
                          } else {
                            leaderName = 'Alliance Representative';
                            leaderPhoto = '';
                          }
                        }

                        return (
                          <div 
                            key={pid} 
                            className={`flex items-center justify-between gap-3 p-2 rounded-xl transition-all border ${
                              isMe 
                                ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/30 font-semibold' 
                                : 'bg-slate-900/10 dark:bg-slate-950/20 border-slate-500/5'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Candidate Photo */}
                              <div className="relative shrink-0 select-none">
                                {leaderPhoto ? (
                                  <img
                                    src={leaderPhoto}
                                    alt={leaderName}
                                    referrerPolicy="no-referrer"
                                    className="w-9 h-9 rounded-full object-cover border-2 shadow-sm shrink-0"
                                    style={{ borderColor: pColor }}
                                  />
                                ) : (
                                  <div 
                                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white uppercase text-xs border shadow-sm shrink-0"
                                    style={{ backgroundColor: pColor, borderColor: pColor }}
                                  >
                                    {getPartyAcronym(pName)}
                                  </div>
                                )}
                              </div>
                              
                              <div className="min-w-0">
                                <div className="font-bold text-xs truncate leading-snug">{leaderName}</div>
                                <span className="text-[8px] font-mono opacity-85 px-1.5 py-0.2 rounded border uppercase tracking-wider block mt-0.5 w-fit" style={{ color: pColor, borderColor: `${pColor}25`, backgroundColor: `${pColor}10` }}>
                                  {pName}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-black font-mono" style={{ color: pColor }}>
                                %{valNum.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 h-full overflow-hidden w-full">
                  {/* District Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-500/10 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">🏬</span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate uppercase tracking-tight leading-none text-slate-100">{selectedRegion.name} Districts</h4>
                        <p className="text-[8px] text-indigo-400 font-bold font-mono tracking-wide mt-0.5 uppercase">DISTRICT EXPLORER</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveViewLevel('province');
                        setSelectedDistrict(null);
                      }}
                      className="text-[9px] bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-2 py-1 rounded-lg transition-all"
                    >
                      {regionLabel} View ⬅️
                    </button>
                  </div>

                  {/* Horizontal slider list of districts to select directly */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 select-none shrink-0 scrollbar-thin">
                    {getDeterministicDistricts(selectedRegion, provinceCentersRef.current[selectedRegion.id] || { lat: 38.9637, lng: 35.2433 }).map((d) => {
                      const isSel = selectedDistrict && 
                        selectedDistrict.name === d.name && 
                        selectedDistrict.provinceId === selectedRegion.id;
                      let pColor = '#64748b';
                      if (d.winnerParty === party.id) {
                        pColor = party.color;
                      } else {
                        pColor = getRivalColor(d.winnerParty);
                      }
                      return (
                        <button
                          key={d.name}
                          onClick={() => setSelectedDistrict(d)}
                          className={`px-2.5 py-1 rounded-xl border text-[9px] font-bold whitespace-nowrap transition-all shrink-0 ${
                            isSel 
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                              : 'bg-slate-900/10 dark:bg-slate-950/20 border-slate-500/10 text-slate-300 hover:bg-slate-500/10'
                          }`}
                          style={{ borderLeftWidth: '3px', borderLeftColor: pColor }}
                        >
                          {d.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* District polling details */}
                  {selectedDistrict ? (
                    <div className="flex flex-col justify-between flex-grow overflow-hidden min-h-0 gap-2">
                      <div className="flex-grow overflow-y-auto pr-1 space-y-1.5 min-h-0">
                        {/* Demographics Card */}
                        <div className="p-2 rounded-xl bg-slate-950/20 dark:bg-slate-950/40 border border-slate-500/5 space-y-1">
                          <div className="flex justify-between text-[10px] leading-none text-slate-400">
                            <span>Local District:</span>
                            <strong className="text-slate-100">{selectedDistrict.name}</strong>
                          </div>
                          <div className="flex justify-between text-[10px] leading-none text-slate-400">
                            <span>Voters Count:</span>
                            <strong className="text-slate-100">{selectedDistrict.population.toLocaleString()}</strong>
                          </div>
                          <div className="flex justify-between text-[10px] leading-none text-slate-400">
                            <span>{country.id === 'US' ? 'Governor:' : country.id === 'DE' ? 'Minister-President:' : 'Mayor:'}</span>
                            <strong className="text-slate-100">{selectedDistrict.mayorName}</strong>
                          </div>
                        </div>

                        {/* Candidate Breakdown */}
                        <div className="space-y-1">
                          {Object.entries(selectedDistrict.supports)
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .map(([pid, val]) => {
                              const isMe = pid === party.id;
                              const pName = isMe ? party.name : getRivalName(pid);
                              const pColor = isMe ? party.color : getRivalColor(pid);
                              const valNum = val as number;

                              return (
                                <div 
                                  key={pid} 
                                  className={`flex items-center justify-between p-1 px-2 rounded-lg border text-[10px] ${
                                    isMe 
                                      ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/30 font-semibold' 
                                      : 'bg-slate-900/10 dark:bg-slate-950/10 border-slate-500/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pColor }} />
                                    <span className="font-bold truncate text-slate-200">{pName}</span>
                                  </div>
                                  <span className="font-extrabold font-mono" style={{ color: pColor }}>%{valNum.toFixed(1)}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* District Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-500/10 shrink-0">
                        <button
                          onClick={() => handleLaunchDistrictCampaign('flyers')}
                          className="py-1 px-1 text-white rounded-lg text-[9px] font-bold text-center uppercase tracking-wide transition-all shadow flex flex-col items-center justify-center leading-tight"
                          style={{ backgroundColor: '#0f766e' }}
                        >
                          <span>📄 FLYER CAMPAIGN</span>
                          <span className="opacity-90 font-mono text-[8px] font-bold mt-0.5">-5k {currency}</span>
                        </button>
                        <button
                          onClick={() => handleLaunchDistrictCampaign('townhall')}
                          className="py-1 px-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-bold text-center uppercase tracking-wide transition-all shadow flex flex-col items-center justify-center leading-tight"
                        >
                          <span>🎤 NEW TOWNHALL</span>
                          <span className="opacity-90 font-mono text-[8px] font-bold mt-0.5">-15k {currency}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <span className="text-xl">🏬</span>
                      <p className="text-[10px] text-slate-400 mt-2">Select a local district circle on the map to explore details!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN LAYOUT PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {/* List of Regions in Country (Left Panel) */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-3">
          <div className={`p-4 rounded-3xl border ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-sm font-bold tracking-tight uppercase text-slate-400 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" /> Administrative Districts ({country.regions.length})
            </h3>

            <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
              {country.regions.map((region) => {
                const playerSupport = region.supports[party.id] || 0;
                const isCurrent = selectedRegion.id === region.id;

                return (
                  <button
                    id={`region-tab-${region.id}`}
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 relative cursor-pointer ${
                      isCurrent
                        ? darkMode
                          ? 'bg-slate-800 border-indigo-500/80 text-slate-100'
                          : 'bg-indigo-50/50 border-indigo-200 text-indigo-950 shadow-sm'
                        : darkMode
                        ? 'bg-slate-950/40 border-slate-850 hover:border-slate-750 hover:bg-slate-900/40 text-slate-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-bold truncate pr-3">{region.name}</span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.3 rounded bg-slate-500/10 text-slate-400 shrink-0">
                        {region.seats} Seats
                      </span>
                    </div>

                    {/* Supports color layout gauge bar */}
                    <div className="w-full flex h-2.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 mt-1">
                      {Object.entries(region.supports)
                        .sort(([idA], [idB]) => (idA === party.id ? -1 : idB === party.id ? 1 : 0)) // Player first
                        .map(([partyId, val]) => (
                          <div
                            key={partyId}
                            style={{
                              width: `${val}%`,
                              backgroundColor: partyId === party.id ? party.color : getRivalColor(partyId)
                            }}
                            className="h-full transition-all duration-300"
                            title={`${getRivalName(partyId)}: %${(val as number).toFixed(1)}`}
                          />
                        ))}
                    </div>

                    {/* Player current share label */}
                    <div className="flex justify-between items-center mt-1 text-[11px] font-mono">
                      <span className="font-semibold text-slate-400">Your Poll Position:</span>
                      <span className="font-bold text-xs" style={{ color: party.color }}>
                        %{playerSupport.toFixed(1)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Region Action cockpit (Right Panel) */}
        <div className="col-span-12 md:col-span-7 flex flex-col gap-4">
          {selectedRegion && !activeSpeechCard && (
            <div className={`p-6 rounded-3xl border flex flex-col h-full ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex justify-between items-start pb-4 border-b border-slate-500/10">
                <div>
                  <div className="text-[10px] tracking-wider text-indigo-400 font-mono flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> ACTIVE SELECTED CONSTITUENCY
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mt-1">{selectedRegion.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Headquarters Status: {selectedRegion.infrastructure}/5 | Seat Allocation: {selectedRegion.seats}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">
                      {country.id === 'US' ? 'Governor' : country.id === 'DE' ? 'Minister-President' : 'Local Mayor'}
                    </span>
                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border" style={{
                        backgroundColor: (selectedRegion.ownerPartyId === party.id || selectedRegion.ownerPartyId === 'player_party') ? party.color + '22' : getRivalColor(selectedRegion.ownerPartyId) + '22',
                        color: (selectedRegion.ownerPartyId === party.id || selectedRegion.ownerPartyId === 'player_party') ? party.color : getRivalColor(selectedRegion.ownerPartyId),
                        borderColor: (selectedRegion.ownerPartyId === party.id || selectedRegion.ownerPartyId === 'player_party') ? party.color + '44' : getRivalColor(selectedRegion.ownerPartyId) + '44'
                      }}>
                        {selectedRegion.ownerPartyId === party.id || selectedRegion.ownerPartyId === 'player_party' ? party.name : (country.rivals.find(r => r.id === selectedRegion.ownerPartyId)?.name || selectedRegion.ownerPartyId)}
                      </span>
                      <strong className="text-xs text-slate-200">
                        {selectedRegion.mayorName || getPartyGovernorForRegion(selectedRegion.name, selectedRegion.ownerPartyId, country.id, party, country.rivals)}
                      </strong>
                      {(selectedRegion.ownerPartyId === party.id || selectedRegion.ownerPartyId === 'player_party') && (
                        <button
                          onClick={() => {
                            const newName = prompt("Partinizin bu bölgedeki Belediye Başkanı / Vali adayının adını girin:", selectedRegion.mayorName || "");
                            if (newName && newName.trim()) {
                              const updatedRegions = country.regions.map(r => 
                                r.id === selectedRegion.id ? { ...r, mayorName: newName.trim() } : r
                              );
                              onUpdateCountry({ ...country, regions: updatedRegions });
                              setSelectedRegion({ ...selectedRegion, mayorName: newName.trim() });
                            }
                          }}
                          className="px-1.5 py-0.5 hover:bg-indigo-500/20 rounded text-indigo-400 text-[10px] font-mono border border-indigo-500/30 transition-colors"
                          title="Belediye Başkanını Değiştir / Atama Yap"
                        >
                          ✏️ Atama
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Voter demographics breakdown bars */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider font-mono mb-2.5 font-semibold">VOTER DEMOGRAPHICS (%)</h4>
                <div className="grid grid-cols-2 gap-35">
                  {Object.entries(selectedRegion.voterDistribution).map(([block, density]) => (
                    <div key={block} className="space-y-1 bg-slate-500/5 p-2 rounded-xl border border-slate-500/5">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-300">
                        <span>{block}</span>
                        <span className="font-mono text-indigo-400">% {density}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${density}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgraded Support List gauge chart explicitly labels */}
              <div className="mt-5 p-4 rounded-2xl bg-black/20 border border-slate-500/5">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider font-mono mb-3.5 font-medium uppercase">CURRENT LATEST POLLS & CANDIDATES</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {Object.entries(selectedRegion.supports)
                    .sort(([, valA], [, valB]) => (valB as number) - (valA as number)) // Sort by maximum support percentage!
                    .map(([pid, amt]) => {
                      const isPlayer = pid === party.id;
                      const rName = getRivalName(pid);
                      const color = isPlayer ? party.color : getRivalColor(pid);
                      
                      // Look up candidate stats
                      let leaderName = '';
                      let leaderPhoto = '';
                      if (isPlayer) {
                        leaderName = party.leader;
                        leaderPhoto = country.id === 'DE' ? '' : (party.photo || '');
                      } else {
                        const rival = country.rivals.find(r => r.id === pid);
                        if (rival) {
                          leaderName = rival.leader;
                          leaderPhoto = rival.photo || '';
                        } else {
                          leaderName = 'Alliance Representative';
                          leaderPhoto = '';
                        }
                      }

                      return (
                        <div key={pid} className="flex items-center gap-3 bg-slate-900/15 dark:bg-slate-950/25 p-2.5 rounded-xl border border-slate-500/5 min-w-0">
                          {/* Leader Portrait Circular Headshot / Monogram */}
                          <div className="relative shrink-0">
                            {!leaderPhoto ? (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white uppercase text-sm border-2 shadow-sm"
                                style={{ backgroundColor: color, borderColor: color }}
                              >
                                {getPartyAcronym(isPlayer ? party.name : rName)}
                              </div>
                            ) : (
                              <img 
                                src={leaderPhoto} 
                                alt={leaderName} 
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
                                style={{ borderColor: color }}
                              />
                            )}
                          </div>

                          {/* Details details */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold leading-tight truncate">{leaderName}</span>
                              <span className="text-[10px] font-mono font-bold text-right shrink-0" style={{ color }}>
                                %{(amt as number).toFixed(1)}
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono tracking-wide mt-0.5 uppercase flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                              {rName}
                            </div>

                            {/* Poll bar */}
                            <div className="h-1 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden mt-1 px-0.1">
                              <div className="h-full rounded-full" style={{ width: `${amt}%`, backgroundColor: color }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Campaign Options available */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-auto pt-5 border-t border-slate-500/10">
                {/* Op 1: Rally with speech card */}
                <button
                  id="rally-action-btn"
                  type="button"
                  onClick={handleStartRally}
                  className="p-3 rounded-2xl border flex flex-col items-center text-center justify-center gap-1 bg-slate-800 border-rose-500/30 hover:border-rose-500/65 hover:scale-102 transition-all group cursor-pointer"
                >
                  <Flame className="w-6 h-6 text-rose-500 group-hover:animate-bounce" />
                  <span className="text-[11px] font-extrabold tracking-wider mt-1 text-rose-250 uppercase">RALLY STATIONS</span>
                  <span className="text-[9px] text-rose-400 font-mono font-bold">Cost: {(75000).toLocaleString()} {currency}</span>
                  <span className="text-[8px] text-slate-400 leading-tight">Launches Speech dialogues stops.</span>
                </button>

                {/* Op 2: Digital Campaign */}
                <button
                  id="ad-action-btn"
                  type="button"
                  onClick={() => handleStartAdCampaign(selectedRegion)}
                  className="p-3 rounded-2xl border flex flex-col items-center text-center justify-center gap-1 bg-slate-800 border-emerald-500/30 hover:border-emerald-500/65 hover:scale-102 transition-all group cursor-pointer"
                >
                  <Megaphone className="w-6 h-6 text-emerald-500 group-hover:scale-110" />
                  <span className="text-[11px] font-extrabold tracking-wider mt-1 text-emerald-250 uppercase">DIGITAL ADS</span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold">Cost: {(40000).toLocaleString()} {currency}</span>
                  <span className="text-[8px] text-slate-400 leading-tight">Flat +3-5% local polls boost immediately!</span>
                </button>

                {/* Op 3: Local Party HQ offices */}
                <button
                  id="hq-action-btn"
                  type="button"
                  onClick={() => handleUpgradeInfrastructure(selectedRegion)}
                  className="p-3 rounded-2xl border flex flex-col items-center text-center justify-center gap-1 bg-slate-800 border-indigo-500/30 hover:border-indigo-500/65 hover:scale-102 transition-all group cursor-pointer"
                >
                  <Users className="w-6 h-6 text-indigo-400 group-hover:rotate-6" />
                  <span className="text-[11px] font-extrabold tracking-wider mt-1 text-indigo-250 uppercase">OPEN HQ FIELD</span>
                  <span className="text-[9px] text-indigo-400 font-mono font-bold">Cost: {(110000).toLocaleString()} {currency}</span>
                  <span className="text-[8px] text-slate-400 leading-tight">Upgrade infrastructure, adds permanent members and loyalty!</span>
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE CONSTITUENCY SPEECH INTERACTIVE WINDOW */}
          {activeSpeechCard && (
            <div className={`p-6 rounded-3xl border flex flex-col gap-4 animate-fade-in ${
              darkMode 
                ? 'bg-slate-950 border-rose-500/50 shadow-lg shadow-rose-950/10' 
                : 'bg-white border-rose-200 shadow-xl'
            }`}>
              <div className="flex items-center gap-2 pb-3 border-b border-rose-500/20">
                <span className="text-2xl animate-bounce">📢</span>
                <div>
                  <span className="text-[9px] tracking-widest font-mono text-rose-400 font-bold">CONSTITUENCY PODIUM / PRESS BRIEFING</span>
                  <h4 className="text-sm font-extrabold text-slate-100">{activeSpeechCard.topic}</h4>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-semibold italic bg-slate-900 p-4 rounded-xl border border-slate-800">
                "{activeSpeechCard.question}"
              </p>

              {/* Answer choice list */}
              {!speechFeedback ? (
                <div className="flex flex-col gap-3 mt-2">
                  {activeSpeechCard.choices.map((choice, idx) => (
                    <button
                      id={`speech-choice-${idx}`}
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSpeechChoice(choice)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-medium cursor-pointer flex flex-col gap-1.5 ${
                        darkMode
                          ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold flex items-center gap-1.5 text-slate-100">
                        <span className="text-indigo-400 font-mono">{idx + 1}.</span> {choice.text}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono pl-5">
                        Strategic Stance: {choice.impactText}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 animate-pulse" />
                  <div>
                    <h5 className="text-sm font-bold text-slate-250">Campaign Report</h5>
                    <p className="text-xs text-slate-450 leading-relaxed mt-1.5 max-w-lg">
                      {speechFeedback}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-2 border-t border-slate-800 pt-3">
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 font-mono">BUDGET EXPENDITURE</div>
                      <div className="text-sm font-bold font-mono text-rose-500">
                        - {currency}0
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 font-mono">ESTIMATED IMPACT</div>
                      <div className="text-sm font-bold font-mono text-emerald-400">
                        Progress Recorded
                      </div>
                    </div>
                  </div>

                  <button
                    id="close-speech-modal-btn"
                    onClick={handleCloseSpeech}
                    className="mt-4 px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-505 text-white shadow-lg transition-all cursor-pointer"
                  >
                    Leave Podium / Continue
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {customAlert && (
        <div className="fixed inset-0 z-[110] h-full w-full bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border p-5 flex flex-col gap-3 shadow-xl transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
              <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                {customAlert.type === 'success' && <span className="text-emerald-400">✓</span>}
                {customAlert.type === 'warning' && <span className="text-rose-500">⚠</span>}
                {customAlert.type === 'info' && <span className="text-blue-400">ℹ</span>}
                {customAlert.title}
              </h4>
            </div>
            <p className={`text-xs leading-relaxed py-1 whitespace-pre-line ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{customAlert.message}</p>
            <button
              onClick={() => setCustomAlert(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs cursor-pointer mt-2 text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Help method to find correct party representation
const hoveredRegionWinnerColor = (partyWinner: string | undefined): string => {
  if (partyWinner === 'DEM') return '#8b5cf6';
  if (partyWinner === 'YRP') return '#2563eb';
  if (partyWinner === 'MHP') return '#991b1b';
  return '#64748b';
};
