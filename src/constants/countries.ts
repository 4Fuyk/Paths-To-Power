/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, VoterGroup, Bill, RivalParty, Region, SpeechCard } from '../types';

const TURKEY_PROVINCES_SPEC = [
  { name: 'Adana', seats: 15, winner: 'CHP', mayor: 'Zeydan Karalar' },
  { name: 'Adıyaman', seats: 5, winner: 'CHP', mayor: 'Abdurrahman Tutdere' },
  { name: 'Afyonkarahisar', seats: 6, winner: 'CHP', mayor: 'Burcu Köksal' },
  { name: 'Ağrı', seats: 4, winner: 'DEM', mayor: 'Hazal Aras' },
  { name: 'Amasya', seats: 3, winner: 'CHP', mayor: 'Turgay Sevindi' },
  { name: 'Ankara', seats: 36, winner: 'CHP', mayor: 'Mansur Yavaş', supports: { CHP: 60.44, AKP: 31.68, YRP: 3.12, ZAFER: 1.51, DEM: 1.01, MHP: 0.1, TIP: 0.2, TKP: 0.1, SAADET: 0.5, DEVA: 0.4, GELECEK: 0.1, VATAN: 0.1 } },
  { name: 'Antalya', seats: 17, winner: 'CHP', mayor: 'Muhittin Böcek' },
  { name: 'Artvin', seats: 2, winner: 'CHP', mayor: 'Bilgehan Erdem' },
  { name: 'Aydın', seats: 8, winner: 'CHP', mayor: 'Özlem Çerçioğlu' },
  { name: 'Balıkesir', seats: 9, winner: 'CHP', mayor: 'Ahmet Akın' },
  { name: 'Bilecik', seats: 2, winner: 'CHP', mayor: 'Melek Mızrak Subaşı' },
  { name: 'Bingöl', seats: 3, winner: 'AKP', mayor: 'Erdal Arıkan' },
  { name: 'Bitlis', seats: 3, winner: 'AKP', mayor: 'Nesrullah Tanğlay' },
  { name: 'Bolu', seats: 3, winner: 'CHP', mayor: 'Tanju Özcan' },
  { name: 'Burdur', seats: 3, winner: 'CHP', mayor: 'Ali Orkun Ercengiz' },
  { name: 'Bursa', seats: 20, winner: 'CHP', mayor: 'Mustafa Bozbey' },
  { name: 'Çanakkale', seats: 4, winner: 'CHP', mayor: 'Muharrem Erkek' },
  { name: 'Çankırı', seats: 2, winner: 'MHP', mayor: 'İsmail Hakkı Esen' },
  { name: 'Çorum', seats: 4, winner: 'AKP', mayor: 'Halil İbrahim Aşgın' },
  { name: 'Denizli', seats: 7, winner: 'CHP', mayor: 'Bülent Nuri Çavuşoğlu' },
  { name: 'Diyarbakır', seats: 12, winner: 'DEM', mayor: 'Ayşe Serra Bucak Küçük', supports: { CHP: 3.50, AKP: 16.85, YRP: 3.65, DEM: 64.09, ZAFER: 0.5, MHP: 0.1, TIP: 0.3, TKP: 0.1, SAADET: 0.8, DEVA: 0.4, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'Edirne', seats: 4, winner: 'CHP', mayor: 'Filiz Gencan Akın' },
  { name: 'Elazığ', seats: 5, winner: 'AKP', mayor: 'Şahin Şerifoğulları' },
  { name: 'Erzincan', seats: 2, winner: 'MHP', mayor: 'Bekir Aksun' },
  { name: 'Erzurum', seats: 6, winner: 'AKP', mayor: 'Mehmet Sekmen' },
  { name: 'Eskişehir', seats: 7, winner: 'CHP', mayor: 'Ayşe Ünlüce', supports: { CHP: 51.02, AKP: 37.85, YRP: 2.12, ZAFER: 2.45, DEM: 1.15, MHP: 0.1, TIP: 0.8, TKP: 0.2, SAADET: 0.6, DEVA: 0.3, GELECEK: 0.1, VATAN: 0.1 } },
  { name: 'Gaziantep', seats: 14, winner: 'AKP', mayor: 'Fatma Şahin', supports: { CHP: 28.12, AKP: 38.83, YRP: 17.22, DEM: 5.48, ZAFER: 2.45, MHP: 0.1, TIP: 0.2, TKP: 0.1, SAADET: 1.1, DEVA: 0.8, GELECEK: 0.3, VATAN: 0.1 } },
  { name: 'Giresun', seats: 4, winner: 'CHP', mayor: 'Fuat Köse' },
  { name: 'Gümüşhane', seats: 2, winner: 'MHP', mayor: 'Vedat Soner Başer' },
  { name: 'Hakkari', seats: 3, winner: 'DEM', mayor: 'Mehmet Sıddık Akış' },
  { name: 'Hatay', seats: 11, winner: 'AKP', mayor: 'Mehmet Öntürk', supports: { CHP: 44.02, AKP: 44.48, TIP: 2.01, DEM: 1.5, YRP: 2.1, ZAFER: 1.2, MHP: 0.1, TKP: 0.1, SAADET: 0.5, DEVA: 0.3, GELECEK: 0.1, VATAN: 0.1 } },
  { name: 'Isparta', seats: 4, winner: 'AKP', mayor: 'Şükrü Başdeğirmen' },
  { name: 'Mersin', seats: 13, winner: 'CHP', mayor: 'Vahap Seçer' },
  { name: 'İstanbul', seats: 98, winner: 'CHP', mayor: 'Ekrem İmamoğlu', supports: { CHP: 51.15, AKP: 39.59, YRP: 2.61, ZAFER: 2.25, DEM: 2.12, MHP: 0.1, TIP: 0.5, TKP: 0.2, SAADET: 0.8, DEVA: 0.3, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'İzmir', seats: 28, winner: 'CHP', mayor: 'Cemil Tugay', supports: { CHP: 48.97, AKP: 37.06, DEM: 4.19, ZAFER: 2.52, YRP: 0.9, MHP: 0.1, TIP: 1.5, TKP: 0.4, SAADET: 0.6, DEVA: 0.4, GELECEK: 0.1, VATAN: 0.1 } },
  { name: 'Kars', seats: 3, winner: 'MHP', mayor: 'Ötüken Senger' },
  { name: 'Kastamonu', seats: 3, winner: 'CHP', mayor: 'Hasan Baltacı' },
  { name: 'Kayseri', seats: 10, winner: 'AKP', mayor: 'Memduh Büyükkılıç' },
  { name: 'Kırklareli', seats: 3, winner: 'MHP', mayor: 'Derya Bulut' },
  { name: 'Kırşehir', seats: 2, winner: 'CHP', mayor: 'Selahattin Ekicioğlu' },
  { name: 'Kocaeli', seats: 14, winner: 'AKP', mayor: 'Tahir Büyükakın' },
  { name: 'Konya', seats: 15, winner: 'AKP', mayor: 'Uğur İbrahim Altay', supports: { CHP: 12.86, AKP: 49.44, YRP: 23.44, ZAFER: 3.01, DEM: 3.42, MHP: 0.1, TIP: 0.1, TKP: 0.1, SAADET: 2.1, DEVA: 0.5, GELECEK: 0.7, VATAN: 0.1 } },
  { name: 'Kütahya', seats: 5, winner: 'CHP', mayor: 'Eyüp Kahveci' },
  { name: 'Malatya', seats: 6, winner: 'AKP', mayor: 'Sami Er' },
  { name: 'Manisa', seats: 10, winner: 'CHP', mayor: 'Ferdi Zeyrek' },
  { name: 'Kahramanmaraş', seats: 8, winner: 'AKP', mayor: 'Fırat Görgel' },
  { name: 'Mardin', seats: 6, winner: 'DEM', mayor: 'Ahmet Türk' },
  { name: 'Muğla', seats: 7, winner: 'CHP', mayor: 'Ahmet Aras' },
  { name: 'Muş', seats: 3, winner: 'DEM', mayor: 'Sırrı Söylemez' },
  { name: 'Nevşehir', seats: 3, winner: 'AKP', mayor: 'Rasim Arı' },
  { name: 'Niğde', seats: 3, winner: 'AKP', mayor: 'Emrah Özdemir' },
  { name: 'Ordu', seats: 6, winner: 'AKP', mayor: 'Mehmet Hilmi Güler' },
  { name: 'Osmaniye', seats: 4, winner: 'MHP', mayor: 'Ibrahim Çenet' },
  { name: 'Rize', seats: 3, winner: 'AKP', mayor: 'Rahmi Metin' },
  { name: 'Sakarya', seats: 8, winner: 'AKP', mayor: 'Yusuf Alemdar' },
  { name: 'Samsun', seats: 9, winner: 'AKP', mayor: 'Halit Doğan' },
  { name: 'Şanlıurfa', seats: 14, winner: 'YRP', mayor: 'Mehmet Kasım Gülpınar', supports: { CHP: 1.51, AKP: 33.64, YRP: 38.87, DEM: 21.16, ZAFER: 0.5, MHP: 0.1, TIP: 0.1, TKP: 0.1, SAADET: 0.9, DEVA: 0.3, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'Siirt', seats: 3, winner: 'DEM', mayor: 'Sofya Alağaş' },
  { name: 'Sinop', seats: 2, winner: 'CHP', mayor: 'Metin Gürbüz' },
  { name: 'Şırnak', seats: 4, winner: 'AKP', mayor: 'Mehmet Yarka' },
  { name: 'Sivas', seats: 5, winner: 'MHP', mayor: 'Adem Uzun', supports: { CHP: 7.35, AKP: 29.15, MHP: 43.32, YRP: 13.12, ZAFER: 1.5, DEM: 0.1, TIP: 0.1, TKP: 0.1, SAADET: 1.5, DEVA: 0.2, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'Tekirdağ', seats: 8, winner: 'CHP', mayor: 'Candan Yüceer' },
  { name: 'Tokat', seats: 5, winner: 'MHP', mayor: 'Mehmet Kemal Yazıcıoğlu' },
  { name: 'Trabzon', seats: 6, winner: 'AKP', mayor: 'Ahmet Metin Genç', supports: { CHP: 28.46, AKP: 51.48, YRP: 9.14, ZAFER: 2.12, DEM: 0.15, MHP: 0.1, TIP: 0.1, TKP: 0.1, SAADET: 1.5, DEVA: 0.4, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'Tunceli', seats: 1, winner: 'DEM', mayor: 'Cevdet Konak' },
  { name: 'Uşak', seats: 3, winner: 'CHP', mayor: 'Özkan Yalım' },
  { name: 'Van', seats: 8, winner: 'DEM', mayor: 'Abdullah Zeydan' },
  { name: 'Yalova', seats: 3, winner: 'CHP', mayor: 'Mehmet Gürel' },
  { name: 'Yozgat', seats: 4, winner: 'YRP', mayor: 'Kazım Arslan' },
  { name: 'Zonguldak', seats: 5, winner: 'CHP', mayor: 'Tahsin Erdem' },
  { name: 'Aksaray', seats: 4, winner: 'AKP', mayor: 'Evren Dinçer' },
  { name: 'Bayburt', seats: 1, winner: 'AKP', mayor: 'Mete Memiş' },
  { name: 'Karaman', seats: 3, winner: 'MHP', mayor: 'Savaş Kalaycı' },
  { name: 'Kırıkkale', seats: 3, winner: 'CHP', mayor: 'Ahmet Önal' },
  { name: 'Batman', seats: 5, winner: 'DEM', mayor: 'Gülüstan Sönük' },
  { name: 'Bartın', seats: 2, winner: 'CHP', mayor: 'Rıza Yalçınkaya' },
  { name: 'Ardahan', seats: 2, winner: 'CHP', mayor: 'Faruk Demir' },
  { name: 'Iğdır', seats: 2, winner: 'DEM', mayor: 'Mehmet Nuri Güneş' },
  { name: 'Karabük', seats: 3, winner: 'AKP', mayor: 'Özkan Çetinkaya' },
  { name: 'Kilis', seats: 2, winner: 'CHP', mayor: 'Hakan Bilecen' },
  { name: 'Düzce', seats: 3, winner: 'AKP', mayor: 'Faruk Özlü' }
];

export const getTurkeyRegions = (): Region[] => {
  return TURKEY_PROVINCES_SPEC.map((prov) => {
    let supports: Record<string, number> | undefined = prov.supports;
    if (!supports) {
      const base: Record<string, number> = {
        CHP: 18,
        AKP: 18,
        DEM: 2,
        MHP: 5,
        YRP: 4,
        ZAFER: 1.5,
        TIP: 0.5,
        TKP: 0.1,
        SAADET: 0.8,
        DEVA: 0.4,
        GELECEK: 0.2,
        VATAN: 0.1
      };

      if (prov.winner === 'DEM') {
        base.DEM = 58.5 + Math.floor(Math.random() * 6);
        base.AKP = 20 + Math.floor(Math.random() * 4);
        base.CHP = 3.5 + Math.floor(Math.random() * 2);
      } else if (prov.winner === 'CHP') {
        base.CHP = 44.5 + Math.floor(Math.random() * 5);
        base.AKP = 32 + Math.floor(Math.random() * 4);
      } else if (prov.winner === 'AKP') {
        base.AKP = 42.5 + Math.floor(Math.random() * 5);
        base.CHP = 26 + Math.floor(Math.random() * 4);
      } else if (prov.winner === 'MHP') {
        base.MHP = 40.5 + Math.floor(Math.random() * 5);
        base.AKP = 24 + Math.floor(Math.random() * 4);
        base.CHP = 16 + Math.floor(Math.random() * 4);
      } else if (prov.winner === 'YRP') {
        base.YRP = 38.5 + Math.floor(Math.random() * 5);
        base.AKP = 31 + Math.floor(Math.random() * 3);
        base.CHP = 9 + Math.floor(Math.random() * 2);
      }

      const total = Object.values(base).reduce((s, v) => s + v, 0);
      const scale = 100 / total;
      supports = {};
      Object.entries(base).forEach(([pId, val]) => {
        supports[pId] = parseFloat((val * scale).toFixed(2));
      });
    }

    const workers = 20 + Math.floor(Math.random() * 15);
    const youth = 15 + Math.floor(Math.random() * 15);
    const nationalists = 10 + Math.floor(Math.random() * 15);
    const liberals = 8 + Math.floor(Math.random() * 10);
    const traditionalists = 10 + Math.floor(Math.random() * 20);
    const shopkeepers = 100 - (workers + youth + nationalists + liberals + traditionalists);

    const voterDistribution = {
      'İşçiler': workers,
      'Gençler': youth,
      'Milliyetçiler': nationalists,
      'Liberaller': liberals,
      'Gelenekçiler': traditionalists,
      'Esnaflar': Math.max(2, shopkeepers),
    };

    const isEast = ['DEM'].includes(prov.winner) || ['Diyarbakır', 'Van', 'Mardin', 'Batman', 'Siirt', 'Hakkari', 'Şırnak'].includes(prov.name);
    const infrastructure = isEast ? 2 : ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'].includes(prov.name) ? 5 : 3;

    const normalized = prov.name.toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z]/g, '');

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

    const id = coreMap[normalized] || `TR_${normalized}`;

    return {
      id,
      name: prov.name,
      seats: prov.seats,
      voterDistribution,
      supports,
      infrastructure,
      campaignLevel: 0,
      ownerPartyId: prov.winner,
      mayorName: prov.mayor
    };
  });
};

const GERMANY_STATES_SPEC = [
  { name: 'Baden-Württemberg', seats: 83, winner: 'CDU' },
  { name: 'Bayern', seats: 99, winner: 'CDU' },
  { name: 'Berlin', seats: 28, winner: 'CDU' },
  { name: 'Brandenburg', seats: 19, winner: 'AfD' },
  { name: 'Bremen', seats: 5, winner: 'SPD' },
  { name: 'Hamburg', seats: 14, winner: 'SPD' },
  { name: 'Hessen', seats: 47, winner: 'CDU' },
  { name: 'Mecklenburg-Vorpommern', seats: 13, winner: 'AfD' },
  { name: 'Niedersachsen', seats: 60, winner: 'CDU' },
  { name: 'Nordrhein-Westfalen', seats: 136, winner: 'CDU' },
  { name: 'Rheinland-Pfalz', seats: 31, winner: 'CDU' },
  { name: 'Saarland', seats: 8, winner: 'CDU' },
  { name: 'Sachsen', seats: 31, winner: 'AfD' },
  { name: 'Sachsen-Anhalt', seats: 17, winner: 'AfD' },
  { name: 'Schleswig-Holstein', seats: 22, winner: 'CDU' },
  { name: 'Thüringen', seats: 17, winner: 'AfD' }
];

export const getGermanyRegions = (): Region[] => {
  return GERMANY_STATES_SPEC.map((spec) => {
    const base: Record<string, number> = {
      CDU: 25,
      AfD: 18,
      SPD: 14,
      GRÜNE: 10,
      LINKE: 7,
      BSW: 4,
      FDP: 3,
      SSW: 0
    };

    if (spec.winner === 'CDU') {
      base.CDU = 35 + Math.floor(Math.random() * 5);
      base.AfD = 18 + Math.floor(Math.random() * 3);
      base.SPD = 14 + Math.floor(Math.random() * 3);
      base.GRÜNE = 11 + Math.floor(Math.random() * 3);
      base.LINKE = 7 + Math.floor(Math.random() * 2);
    } else if (spec.winner === 'AfD') {
      base.AfD = 34 + Math.floor(Math.random() * 5);
      base.CDU = 22 + Math.floor(Math.random() * 3);
      base.SPD = 12 + Math.floor(Math.random() * 2);
      base.GRÜNE = 7 + Math.floor(Math.random() * 2);
      base.LINKE = 11 + Math.floor(Math.random() * 3);
    } else if (spec.winner === 'SPD') {
      base.SPD = 31 + Math.floor(Math.random() * 5);
      base.CDU = 22 + Math.floor(Math.random() * 3);
      base.GRÜNE = 14 + Math.floor(Math.random() * 3);
      base.AfD = 13 + Math.floor(Math.random() * 3);
      base.LINKE = 7 + Math.floor(Math.random() * 2);
    }

    if (spec.name === 'Schleswig-Holstein') {
      base.SSW = 6;
    }

    const total = Object.values(base).reduce((s, v) => s + v, 0);
    const scale = 100 / total;
    const supports: Record<string, number> = {};
    Object.entries(base).forEach(([pId, val]) => {
      supports[pId] = parseFloat((val * scale).toFixed(2));
    });

    const workers = 18 + Math.floor(Math.random() * 15);
    const youth = 16 + Math.floor(Math.random() * 15);
    const nationalists = 8 + Math.floor(Math.random() * 12);
    const liberals = 12 + Math.floor(Math.random() * 10);
    const traditionalists = 12 + Math.floor(Math.random() * 15);
    const shopkeepers = 100 - (workers + youth + nationalists + liberals + traditionalists);

    const voterDistribution = {
      'İşçiler': workers,
      'Gençler': youth,
      'Milliyetçiler': nationalists,
      'Liberaller': liberals,
      'Gelenekçiler': traditionalists,
      'Esnaflar': Math.max(2, shopkeepers),
    };

    const isEast = ['Brandenburg', 'Mecklenburg-Vorpommern', 'Sachsen', 'Sachsen-Anhalt', 'Thüringen'].includes(spec.name);
    const infrastructure = isEast ? 3 : ['Nordrhein-Westfalen', 'Bayern', 'Baden-Württemberg', 'Hamburg', 'Berlin'].includes(spec.name) ? 5 : 4;

    const normalized = spec.name.toLowerCase()
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z]/g, '');

    const id = `DE_${normalized}`;

    return {
      id,
      name: spec.name,
      seats: spec.seats,
      voterDistribution,
      supports,
      infrastructure,
      campaignLevel: 0,
      ownerPartyId: spec.winner,
      mayorName: spec.winner === 'CDU' ? 'Christian Schmidt' : spec.winner === 'AfD' ? 'Uwe Schulz' : 'Lukas Schneider'
    };
  });
};


// Helper to generate a baseline distribution of voters for a region
const makeVoterGroup = (
  workers: number,
  youth: number,
  nationalists: number,
  liberals: number,
  traditionalists: number,
  shopkeepers: number
): Record<VoterGroup, number> => ({
  'İşçiler': workers,
  'Gençler': youth,
  'Milliyetçiler': nationalists,
  'Liberaller': liberals,
  'Gelenekçiler': traditionalists,
  'Esnaflar': shopkeepers,
});

// Mock Bills for countries
const createBills = (countryId: string): Bill[] => [
  {
    id: `${countryId}_bill_1`,
    title: countryId === 'TR' ? 'Erken Emeklilik ve Sosyal Güvence Paketi' : 'Sosyal Güvenlik Güçlendirme Tasarısı',
    description: 'İşçi ve dar gelirli kesime yönelik erken emeklilik ve asgari refah yardımlarını kapsıyor.',
    category: 'Ekonomi',
    status: 'Bekliyor',
    budgetCost: 450000,
    influenceMod: 15,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': 8,
      'Gençler': 2,
      'Esnaflar': -4,
      'Liberaller': -5,
      'Milliyetçiler': 2,
      'Gelenekçiler': 4,
    }
  },
  {
    id: `${countryId}_bill_2`,
    title: 'Dijital Özgürlükler ve Sosyal Medya Yasası',
    description: 'Bireysel veri gizliliğini artıran ve internet kısıtlamalarını büyük ölçüde kaldıran bir yasa teklifi.',
    category: 'Özgürlükler',
    status: 'Bekliyor',
    budgetCost: 50000,
    influenceMod: 25,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': 1,
      'Gençler': 12,
      'Esnaflar': 2,
      'Liberaller': 10,
      'Milliyetçiler': -4,
      'Gelenekçiler': -8,
    }
  },
  {
    id: `${countryId}_bill_3`,
    title: 'Milli Savunma Sanayii Teşvik Paketi',
    description: 'Savunma harcamalarını %25 artırarak yerli askeri ve güvenlik teknolojilerini desteklemeyi hedefleyen yasa.',
    category: 'Güvenlik',
    status: 'Bekliyor',
    budgetCost: 750000,
    influenceMod: 30,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': 4,
      'Gençler': -2,
      'Esnaflar': 2,
      'Liberaller': -6,
      'Milliyetçiler': 14,
      'Gelenekçiler': 8,
    }
  },
  {
    id: `${countryId}_bill_4`,
    title: 'Ekolojik Tarım ve Yeşil Enerji Girişimi',
    description: 'Çevre dostu üretim tekniklerini seçen işletmelere vergi muafiyeti ve hibe desteği sunan tasarı.',
    category: 'Sağlık / Eğitim',
    status: 'Bekliyor',
    budgetCost: 280000,
    influenceMod: 10,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': -2,
      'Gençler': 9,
      'Esnaflar': 4,
      'Liberaller': 6,
      'Milliyetçiler': 0,
      'Gelenekçiler': -3,
    }
  }
];

export const PLAYABLE_COUNTRIES: Country[] = [
  {
    id: 'TR',
    name: 'Turkey',
    description: 'An Eurasian power bridging East and West, featuring dynamic municipal results and a highly competitive multiparty electorate.',
    flag: '🇹🇷',
    seats: 600,
    parliamentName: 'Grand National Assembly of Turkey (TBMM)',
    system: 'Hükümet Koalisyonu',
    population: '85 Million',
    primaryColor: '#dc2626', // Turkish Red
    rivals: [
      { id: 'CHP', name: 'CHP', leader: 'Özgür Özel', ideology: 'Sosyal Demokrat', symbol: 'Flame', color: '#e30613', baseSupport: 37, photo: 'https://thf.bing.com/th/id/OIP.tw1bDleSary6Ua4NxPIuvgHaEK?w=292&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=' },
      { id: 'AKP', name: 'AK Parti', leader: 'Recep Tayyip Erdoğan', ideology: 'Muhafazakar', symbol: 'Scale', color: '#ff9e1b', baseSupport: 35, photo: 'https://thf.bing.com/th/id/OIP.OSuQe5LJxNif6UcSy0D9YAHaE7?w=242&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'DEM', name: 'DEM Parti', leader: 'Tuncer Bakırhan', ideology: 'Sosyalist', symbol: 'Sparkles', color: '#8b5cf6', baseSupport: 9, photo: 'https://thf.bing.com/th/id/OIP.37I-MTcx4uo8vRif0r3DmgHaEO?w=278&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'MHP', name: 'MHP', leader: 'Devlet Bahçeli', ideology: 'Milliyetçi', symbol: 'ShieldAlert', color: '#991b1b', baseSupport: 7, photo: 'https://thf.bing.com/th/id/OIP.uKLHt8YQ5W_ghAlMr7TR7AHaEK?w=280&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'YRP', name: 'Yeniden Refah Partisi (YRP)', leader: 'Fatih Erbakan', ideology: 'Muhafazakar', symbol: 'Key', color: '#2563eb', baseSupport: 6, photo: 'https://thf.bing.com/th/id/OIP.jwt8F1waSse9KWS-sVyWKgHaEK?w=303&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'ZAFER', name: 'Zafer Partisi', leader: 'Ümit Özdağ', ideology: 'Milliyetçi', symbol: 'Anchor', color: '#c2410c', baseSupport: 4, photo: 'https://thf.bing.com/th/id/OIP.D6YUtsOdukEPYEv357621AHaEK?w=332&h=186&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'TIP', name: 'TİP', leader: 'Erkan Baş', ideology: 'Sosyalist', symbol: 'Heart', color: '#be123c', baseSupport: 2, photo: 'https://thf.bing.com/th/id/OIP.z4i5RbWcUnSCP01SVVXeNwHaE7?w=255&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'TKP', name: 'TKP', leader: 'Kemal Okuyan', ideology: 'Sosyalist', symbol: 'Compass', color: '#dc2626', baseSupport: 1, photo: 'https://tse4.mm.bing.net/th/id/OIP.SnPu5vlsLQCb_aLz9UxpwgHaEK?r=0&cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'SAADET', name: 'Saadet Partisi', leader: 'Mahmut Arıkan', ideology: 'Muhafazakar', symbol: 'Award', color: '#1d4ed8', baseSupport: 1, photo: 'https://i.gazeteduvar.com.tr/2/1280/720/storage/files/images/2024/11/19/mahmud-w0bc_cover.jpg' },
      { id: 'DEVA', name: 'DEVA Partisi', leader: 'Ali Babacan', ideology: 'Liberal', symbol: 'Globe', color: '#06b6d4', baseSupport: 1, photo: 'https://thf.bing.com/th/id/OIP.NeK1Fpea9DEqrDm_IGfEjAHaEN?w=308&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'GELECEK', name: 'Gelecek Partisi', leader: 'Ahmet Davutoğlu', ideology: 'Muhafazakar', symbol: 'Leaf', color: '#16a34a', baseSupport: 1, photo: 'https://thf.bing.com/th/id/OIP.nYYgkEuIUEjy_QGs_Ha-agHaEK?w=289&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'VATAN', name: 'Vatan Partisi', leader: 'Doğu Perinçek', ideology: 'Milliyetçi', symbol: 'Star', color: '#b91c1c', baseSupport: 1, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Do%C4%9Fu_Perin%C3%A7ek_in_Tasnim_News_Agency.jpg/250px-Do%C4%9Fu_Perin%C3%A7ek_in_Tasnim_News_Agency.jpg' },
    ],
    regions: getTurkeyRegions(),
    bills: createBills('TR'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'US',
    name: 'Amerika Birleşik Devletleri',
    description: 'İki partili sistemin ve federal eyaletlerin yönettiği, dünyanın en büyük ekonomik ve askeri gücü.',
    flag: '🇺🇸',
    seats: 538,
    parliamentName: 'Kongre (Temsilciler Meclisi & Senato)',
    system: 'Başkanlık Sistemi',
    population: '333 Milyon',
    primaryColor: '#2563eb', // Tailwind blue-600
    rivals: [
      { id: 'US_rival_1', name: 'Cumhuriyetçi Kanat', leader: 'Eleanor Sterling', ideology: 'Muhafazakar', symbol: 'ShieldCheck', color: '#dc2626', baseSupport: 44 },
      { id: 'US_rival_2', name: 'Demokratik Uyanış', leader: 'Julian Vance', ideology: 'Sosyal Demokrat', symbol: 'Globe', color: '#2563eb', baseSupport: 42 },
      { id: 'US_rival_3', name: 'Özgürlükçü İttifak', leader: 'Garry Moss', ideology: 'Liberal', symbol: 'Bird', color: '#eab308', baseSupport: 6 },
    ],
    regions: [
      { id: 'US_reg_1', name: 'Doğu Yakası (Northeast)', seats: 120, voterDistribution: makeVoterGroup(12, 28, 6, 24, 14, 16), supports: {}, infrastructure: 5, campaignLevel: 0 },
      { id: 'US_reg_2', name: 'Pasifik Yakası (West Coast)', seats: 110, voterDistribution: makeVoterGroup(10, 32, 5, 23, 10, 20), supports: {}, infrastructure: 5, campaignLevel: 0 },
      { id: 'US_reg_3', name: 'Endüstriyel Merkez (Midwest)', seats: 140, voterDistribution: makeVoterGroup(34, 15, 18, 10, 15, 8), supports: {}, infrastructure: 3, campaignLevel: 0 },
      { id: 'US_reg_4', name: 'Güney Eyaletleri (The South)', seats: 168, voterDistribution: makeVoterGroup(18, 12, 26, 12, 24, 8), supports: {}, infrastructure: 3, campaignLevel: 0 },
    ],
    bills: createBills('US'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'DE',
    name: 'Almanya',
    description: 'Avrupa Birliği\'nin ekonomik lokomotifi olan, koalisyon kültürünün hakim olduğu parlamenter dev.',
    flag: '🇩🇪',
    seats: 630,
    parliamentName: 'Bundestag (Federal Meclis)',
    system: 'Hükümet Koalisyonu',
    population: '84 Milyon',
    primaryColor: '#1f2937', // Germany Slate
    rivals: [
      { id: 'CDU', name: 'CDU/CSU (Union)', leader: 'Friedrich Merz', ideology: 'Muhafazakar', symbol: 'Building', color: '#000000', baseSupport: 28.5, startingSeats: 208, photo: 'https://thf.bing.com/th/id/OIP.C6IhExWdSFCEi8UMuMPLpgHaEs?w=265&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'AfD', name: 'AfD (Alternative für Deutschland)', leader: 'Alice Weidel', ideology: 'Milliyetçi', symbol: 'ShieldAlert', color: '#009EE0', baseSupport: 20.8, startingSeats: 152, photo: 'https://thf.bing.com/th/id/OIP.HMj4SiIh4c7KS6KMTvXSSAHaEu?w=236&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'SPD', name: 'SPD (Sozialdemokratische Partei)', leader: 'Lars Klingbeil', ideology: 'Sosyal Demokrat', symbol: 'Users', color: '#E3000F', baseSupport: 16.4, startingSeats: 120, photo: 'https://thf.bing.com/th/id/OIP.AtJS2ybczy_TBZrRMeiCJwHaE7?w=283&h=187&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'GRÜNE', name: 'GRÜNE (Bündnis 90/Die Grünen)', leader: 'Franziska Brantner', ideology: 'Ekolojist', symbol: 'Leaf', color: '#46962B', baseSupport: 11.6, startingSeats: 85, photo: 'https://thf.bing.com/th/id/OIP.IyG5NwjRofDj4_FbuGZNRQHaEK?w=322&h=181&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'LINKE', name: 'Die Linke', leader: 'Heidi Reichinnek / Jan van Aken', ideology: 'Sosyalist', symbol: 'Heart', color: '#BE3075', baseSupport: 8.8, startingSeats: 64, photo: 'https://thf.bing.com/th/id/OIP.d4VFRFsa1VBK8V33hKRESAHaEK?w=327&h=184&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'BSW', name: 'BSW (Bündnis Sahra Wagenknecht)', leader: 'Sahra Wagenknecht', ideology: 'Sosyalist', symbol: 'Sparkles', color: '#8B1A4B', baseSupport: 4.9, startingSeats: 0, photo: 'https://thf.bing.com/th/id/OIP.tU_3IENu_tkFM8v2XC_MQgHaEK?w=314&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'FDP', name: 'FDP (Freie Demokraten)', leader: 'Christian Lindner', ideology: 'Liberal', symbol: 'Zap', color: '#FFED00', baseSupport: 4.3, startingSeats: 0, photo: 'https://thf.bing.com/th/id/OIP.t97fKXH73vpJGAMOigSoPwHaEK?w=333&h=187&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'SSW', name: 'SSW (Südschleswigscher Wählerverband)', leader: 'Stefan Seidler', ideology: 'Sosyal Demokrat', symbol: 'Anchor', color: '#003D8F', baseSupport: 0.5, startingSeats: 1, photo: 'https://thf.bing.com/th/id/OIP.ZMWMp-FO5VvshEQLlsaR0gHaEK?w=325&h=183&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' }
    ],
    regions: getGermanyRegions(),
    bills: createBills('DE'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'GB',
    name: 'Birleşik Krallık',
    description: 'Dar bölge seçim sistemiyle (First-past-the-post) şekillenen, asırlık monarşik cumhuriyet geleneği.',
    flag: '🇬🇧',
    seats: 650,
    parliamentName: 'Chelsea & Westminster (Avam Kamarası)',
    system: 'Dar Bölge Meclisi',
    population: '67 Milyon',
    primaryColor: '#7c3aed', // Tailwind violet-600
    rivals: [
      { id: 'GB_rival_1', name: 'Muhafazakar Düzen Partisi', leader: 'Sir James Sterling', ideology: 'Muhafazakar', symbol: 'Building', color: '#0284c7', baseSupport: 36 },
      { id: 'GB_rival_2', name: 'Ulusal İşçi Cephesi', leader: 'Rachel Brown', ideology: 'Sosyal Demokrat', symbol: 'Hammer', color: '#e11d48', baseSupport: 34 },
      { id: 'GB_rival_3', name: 'Eko-Doğa Federasyonu', leader: 'Alistair Green', ideology: 'Ekolojist', symbol: 'Trees', color: '#15803d', baseSupport: 12 },
    ],
    regions: [
      { id: 'GB_reg_1', name: 'Büyük Londra Bölgesi', seats: 180, voterDistribution: makeVoterGroup(10, 35, 5, 25, 8, 17), supports: {}, infrastructure: 5, campaignLevel: 0 },
      { id: 'GB_reg_2', name: 'İngiltere Kırsalı (Midlands)', seats: 220, voterDistribution: makeVoterGroup(20, 12, 22, 15, 21, 10), supports: {}, infrastructure: 4, campaignLevel: 0 },
      { id: 'GB_reg_3', name: 'İskoçya Eyaleti', seats: 120, voterDistribution: makeVoterGroup(22, 28, 8, 18, 12, 12), supports: {}, infrastructure: 3, campaignLevel: 0 },
      { id: 'GB_reg_4', name: 'Galler ve Kuzey İrlanda', seats: 130, voterDistribution: makeVoterGroup(25, 22, 12, 12, 15, 14), supports: {}, infrastructure: 3, campaignLevel: 0 },
    ],
    bills: createBills('GB'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'BR',
    name: 'Brezilya',
    description: 'Federal parlamentonun aşırı kutuplu rekabetinde, ormanların ve dev kentsel alanların yönetimi.',
    flag: '🇧🇷',
    seats: 513,
    parliamentName: 'Ulusal Kongre',
    system: 'Hükümet Koalisyonu',
    population: '214 Milyon',
    primaryColor: '#059669', // Tailwind emerald-600
    rivals: [
      { id: 'BR_rival_1', name: 'Sosyal Özgürlük Birliği', leader: 'Carlos Silva', ideology: 'Sosyalist', symbol: 'Users', color: '#ef4444', baseSupport: 39 },
      { id: 'BR_rival_2', name: 'Vatan Muhafızları', leader: 'General Roberto', ideology: 'Milliyetçi', symbol: 'Sword', color: '#16a34a', baseSupport: 35 },
      { id: 'BR_rival_3', name: 'Merkez Kalkınma Partisi', leader: 'Isabela Santos', ideology: 'Liberal', symbol: 'ChevronUp', color: '#eab308', baseSupport: 14 },
    ],
    regions: [
      { id: 'BR_reg_1', name: 'Güney ve Metropoller (São Paulo)', seats: 190, voterDistribution: makeVoterGroup(18, 25, 12, 20, 13, 12), supports: {}, infrastructure: 4, campaignLevel: 0 },
      { id: 'BR_reg_2', name: 'Kuzey ve Amazon Havzası', seats: 120, voterDistribution: makeVoterGroup(34, 15, 5, 12, 22, 12), supports: {}, infrastructure: 1, campaignLevel: 0 },
      { id: 'BR_reg_3', name: 'Kuzeydoğu Tarım Havzası', seats: 110, voterDistribution: makeVoterGroup(28, 18, 6, 14, 24, 10), supports: {}, infrastructure: 2, campaignLevel: 0 },
      { id: 'BR_reg_4', name: 'Orta-Batı Federal Bölge', seats: 93, voterDistribution: makeVoterGroup(15, 14, 26, 15, 18, 12), supports: {}, infrastructure: 3, campaignLevel: 0 },
    ],
    bills: createBills('BR'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'JP',
    name: 'Japonya',
    description: 'Geleneklerine bağlı, teknolojiyi zirvede yaşayan ve yaşlanan bir nüfus yapısına sahip pasifik adalar grubu.',
    flag: '🇯🇵',
    seats: 465,
    parliamentName: 'Milli Diyet (Temsilciler Meclisi)',
    system: 'Hükümet Koalisyonu',
    population: '125 Milyon',
    primaryColor: '#0284c7', // Tailwind sky-600
    rivals: [
      { id: 'JP_rival_1', name: 'Ata Yurdu Liberal Demokratlar', leader: 'Shinzo Sato', ideology: 'Muhafazakar', symbol: 'Building2', color: '#1e3a8a', baseSupport: 43 },
      { id: 'JP_rival_2', name: 'Yıkım ve Yenilikçi İttifak', leader: 'Yuki Tanaka', ideology: 'Liberal', symbol: 'Cpu', color: '#ec4899', baseSupport: 25 },
      { id: 'JP_rival_3', name: 'Yeşil Ada Kolektifi', leader: 'Hiroshi Sato', ideology: 'Ekolojist', symbol: 'Wind', color: '#059669', baseSupport: 18 },
    ],
    regions: [
      { id: 'JP_reg_1', name: 'Kanto (Tokyo Megakenti)', seats: 180, voterDistribution: makeVoterGroup(11, 38, 4, 25, 8, 14), supports: {}, infrastructure: 5, campaignLevel: 0 },
      { id: 'JP_reg_2', name: 'Kansai ve Chubu (Osaka)', seats: 140, voterDistribution: makeVoterGroup(16, 20, 12, 20, 16, 16), supports: {}, infrastructure: 4, campaignLevel: 0 },
      { id: 'JP_reg_3', name: 'Tohoku ve Hokkaido (Kuzey)', seats: 80, voterDistribution: makeVoterGroup(24, 12, 18, 10, 24, 12), supports: {}, infrastructure: 3, campaignLevel: 0 },
      { id: 'JP_reg_4', name: 'Kyushu ve Shikoku (Güney)', seats: 65, voterDistribution: makeVoterGroup(20, 15, 20, 12, 22, 11), supports: {}, infrastructure: 3, campaignLevel: 0 },
    ],
    bills: createBills('JP'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'EG',
    name: 'Mısır',
    description: 'Köklü Akdeniz ve Nil medeniyeti, yoğun genç nüfum ve bölgesel kalkınma odaklı ticaret yolları.',
    flag: '🇪🇬',
    seats: 596,
    parliamentName: 'Halk Meclisi',
    system: 'Hükümet Koalisyonu',
    population: '110 Milyon',
    primaryColor: '#d97706', // Tailwind amber-600
    rivals: [
      { id: 'EG_rival_1', name: 'Ulusal Vatan Hareketi', leader: 'Mustafa El-Kadir', ideology: 'Muhafazakar', symbol: 'Pyramid', color: '#b45309', baseSupport: 38 },
      { id: 'EG_rival_2', name: 'Sosyal Yardımlaşma Partisi', leader: 'Fatma Mansur', ideology: 'Sosyal Demokrat', symbol: 'HeartHandshake', color: '#f43f5e', baseSupport: 32 },
      { id: 'EG_rival_3', name: 'Mavi Akdeniz Liberal İnisiyatifi', leader: 'Rami El-Masri', ideology: 'Liberal', symbol: 'Anchor', color: '#0369a1', baseSupport: 16 },
    ],
    regions: [
      { id: 'EG_reg_1', name: 'Kahire ve Nil Deltası', seats: 280, voterDistribution: makeVoterGroup(22, 28, 12, 18, 10, 10), supports: {}, infrastructure: 4, campaignLevel: 0 },
      { id: 'EG_reg_2', name: 'İskenderiye ve Kuzey Kıyısı', seats: 120, voterDistribution: makeVoterGroup(18, 24, 10, 26, 12, 10), supports: {}, infrastructure: 4, campaignLevel: 0 },
      { id: 'EG_reg_3', name: 'Yukarı Nil (Luksor & Asvan)', seats: 110, voterDistribution: makeVoterGroup(15, 12, 22, 8, 33, 10), supports: {}, infrastructure: 2, campaignLevel: 0 },
      { id: 'EG_reg_4', name: 'Süveyş ve Sinai Bölgesi', seats: 86, voterDistribution: makeVoterGroup(26, 18, 18, 14, 14, 10), supports: {}, infrastructure: 3, campaignLevel: 0 },
    ],
    bills: createBills('EG'),
    campaignTurns: 53,
    electionCycleYears: 5,
  }
];

// List of available delegate names to generate on general congress (Kurultay)
export const DELEGATE_NAMES_POOL = [
  'Deniz Şahin', 'Berk Yılmaz', 'Sedef Kaya', 'Yiğit Özdemir', 'Aslı Doğan',
  'Caner Yıldız', 'Gizem Şimşek', 'Uğur Çelik', 'Ecem Demir', 'Murat Arslan',
  'Selin Öztürk', 'Emre Koç', 'Büşra Aydın', 'Taylan Bulut', 'Merve Polat',
  'Oğuzhan Kıraç', 'Banu Çevik', 'Fatih Güler', 'Eda Yavuz', 'Serkan Aktaş'
];

export const NAMES_BY_COUNTRY: Record<string, { first: string[]; last: string[] }> = {
  TR: { first: ['Berk','Ahmet','Mehmet','Ayşe','Zeynep','Mustafa','Emre','Elif','Deniz','Sedef','Yiğit','Aslı','Caner','Gizem','Uğur','Ecem','Murat','Selin','Büşra','Taylan','Merve','Oğuzhan','Banu','Fatih','Eda','Serkan'], last: ['Yılmaz','Demir','Kaya','Şahin','Çelik','Öztürk','Şimşek','Arslan','Koç','Aydın','Bulut','Polat','Kıraç','Çevik','Güler','Yavuz','Aktaş'] },
  BR: { first: ['João','Carlos','Maria','Ana','Pedro','Lucas','Rafael','Isabela','Roberto','Fernanda','Gabriel','Camila'], last: ['Silva','Santos','Oliveira','Souza','Costa','Pereira','Rodrigues','Almeida','Nascimento','Lima'] },
  US: { first: ['John','Michael','Sarah','Emily','David','Jessica','Eleanor','Julian','Garry','Robert','Mary','James'], last: ['Smith','Johnson','Williams','Brown','Jones','Miller','Sterling','Vance','Moss','Davis','Wilson'] },
  DE: { first: ["Hans","Michael","Andreas","Thomas","Stefan","Klaus","Anna","Sabine","Julia","Katrin","Lukas","Maximilian"], last: ["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Hoffmann","Schulz","Bauer","Richter"] },
  FR: { first: ['Jean','Pierre','Marie','Sophie','Louis','Camille','François','Lucas','Chloé','Emma','Antoine','Léa'], last: ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau'] },
  GB: { first: ['James','Oliver','Emma','Charlotte','Harry','Alistair','Rachel','Thomas','William','Emily','George'], last: ['Smith','Jones','Taylor','Brown','Wilson','Sterling','Green','Davies','Evans','Thomas'] },
  JP: { first: ['Hiroshi','Takashi','Yuki','Sakura','Kenji','Shinzo','Tanaka','Sato','Haruto','Mei','Yuto','Yua'], last: ['Sato','Suzuki','Takahashi','Tanaka','Watanabe','Ito','Nakamura','Kobayashi','Saito','Yamamoto'] },
  EG: { first: ['Mustafa','Fatma','Rami','Ahmed','Mohamed','Ali','Youssef','Ibrahim','Aisha','Mariam','Omar'], last: ['El-Kadir','Mansur','El-Masri','Hassan','Ali','Sayed','Mahmoud','Khalil','Soliman','Salem'] }
};

export function generateName(countryCode: string): string {
  const pool = NAMES_BY_COUNTRY[countryCode] ?? NAMES_BY_COUNTRY.US;
  const f = pool.first[Math.floor(Math.random() * pool.first.length)];
  const l = pool.last[Math.floor(Math.random() * pool.last.length)];
  return `${f} ${l}`;
}

// Mock speech cards for campaigning
export const SPEECH_CARDS_POOL: SpeechCard[] = [
  {
    id: 'speech_1',
    topic: 'Asgari Ücret ve Çalışma Hayatı',
    question: 'Sanayi bölgelerinde işçi sendikaları asgari ücretin enflasyon oranının %15 üzerinde artırılmasını ve haftalık çalışma süresinin 40 saate düşürülmesini talep ediyor. Hükümete nasıl sesleneceksiniz?',
    choices: [
      {
        text: 'İşçilerin alın teri kutsaldır! Çalışma süresini düşürecek, maaşları katlayacağız!',
        impactText: 'İşçiler ve Gençlerden tam destek aldınız. Ancak Liberal ve Esnaf çevreleri tepkili.',
        voterImpacts: { 'İşçiler': 15, 'Gençler': 8, 'Liberaller': -10, 'Esnaflar': -8 },
        budgetCost: 0,
        influenceMod: 10
      },
      {
        text: 'Serbest piyasa dengelerini korumalıyız. Asgari ücreti enflasyon sınırında tutup üretkenliği artıracak teşvikler vereceğiz.',
        impactText: 'Liberaller ve Esnaflar memnun. Solcu/İşçi kesiminde hayal kırıklığı.',
        voterImpacts: { 'Liberaller': 16, 'Esnaflar': 12, 'İşçiler': -8, 'Gençler': -4 },
        budgetCost: 0,
        influenceMod: 12
      },
      {
        text: 'İşçi ve esnafımızı karşı karşıya getirmeyen ortak akıllı bir milli kalkınma planı açıklayacağız.',
        impactText: 'Dengeli ve ılımlı bir yaklaşım. Milliyetçi ve Gelenekçi oylarda istikrarlı artış.',
        voterImpacts: { 'Milliyetçiler': 8, 'Gelenekçiler': 6, 'İşçiler': 2, 'Liberaller': 2 },
        budgetCost: 50000,
        influenceMod: 5
      }
    ]
  },
  {
    id: 'speech_2',
    topic: 'Eğitim Sistemi ve Teknoloji',
    question: 'Eğitim müfredatında din dersi saatlerinin artırılmasını isteyen gruplarla, kodlama ve kuantum teknolojileri odaklı laik eğitim talep eden gençlik dernekleri tartışıyor. Duruşunuz nedir?',
    choices: [
      {
        text: 'Gelecek teknolojide! Müfredatı tamamen yapay zeka, fen ve özgür düşünce odağında dijitalleştireceğiz.',
        impactText: 'Gençler ve Liberaller coştu. Muhafazakar/Gelenekçi kesimler sert tepki gösteriyor.',
        voterImpacts: { 'Gençler': 18, 'Liberaller': 12, 'Gelenekçiler': -15, 'Milliyetçiler': -5 },
        budgetCost: 150000,
        influenceMod: 15
      },
      {
        text: 'Milli ve manevi değerlerimiz her şeyin önündedir. Köklü ahlak eğitimi ile teknolojiyi birleştiren bir müfredat kuracağız.',
        impactText: 'Muhafazakar ve Gelenekçilerden tam not. Gençler ve seküler seçmenler mutsuz.',
        voterImpacts: { 'Gelenekçiler': 16, 'Milliyetçiler': 10, 'Gençler': -12, 'Liberaller': -10 },
        budgetCost: 80000,
        influenceMod: 15
      },
      {
        text: 'Bireysel gelişim özgürlüğünü korurken iki tarafın taleplerini de gözeten esnek, kulüp odaklı eğitim modeli geliştireceğiz.',
        impactText: 'Her iki gruptan da ılımlı destek. Tarafsız bir duruş.',
        voterImpacts: { 'Esnaflar': 6, 'Gençler': 4, 'Liberaller': 2, 'Gelenekçiler': 1 },
        budgetCost: 120000,
        influenceMod: 10
      }
    ]
  },
  {
    id: 'speech_3',
    topic: 'Göçmen Politikası ve Sınır Güvenliği',
    question: 'Son dönemdeki düzensiz göç dalgası halk arasında ciddi güvenlik endişelerine yol açtı. Milliyetçi gruplar sınırların tamamen kapatılmasını istiyor. Çözümünüz nedir?',
    choices: [
      {
        text: 'Sınırlarımız namusumuzdur! Sınır koruma bütçesini artıracak ve yasadışı göçü derhal sonlandıracağız.',
        impactText: 'Milliyetçiler ve Gelenekçiler güçlü bir şekilde destekledi. Liberal seçmenler rahatsız.',
        voterImpacts: { 'Milliyetçiler': 20, 'Gelenekçiler': 10, 'Liberaller': -12, 'Gençler': -4 },
        budgetCost: 200000,
        influenceMod: 20
      },
      {
        text: 'İnsani krizlere göz yumamayız. Uluslararası entegrasyon yasaları ve kontrollü çalışma vizeleri ile göçü ekonomik zenginliğe çevireceğiz.',
        impactText: 'Liberaller ve İşçilerin bir kısmı destekliyor. Milliyetçiler son derece öfkeli.',
        voterImpacts: { 'Liberaller': 18, 'Gençler': 6, 'Milliyetçiler': -18, 'Gelenekçiler': -10 },
        budgetCost: 100000,
        influenceMod: 15
      },
      {
        text: 'Kaçak göçe göz açtırmayacak, ancak meşru kalifiye iş gücünü seçerek ülke ekonomisine dahil edeceğiz. Güvenli geri dönüş planı da hazırlayacağız.',
        impactText: 'Çok popüler bir orta yol. Hem milliyetçiler hem esnaflar bunu rasyonel buluyor.',
        voterImpacts: { 'Milliyetçiler': 10, 'Esnaflar': 10, 'Liberaller': 4, 'İşçiler': 2 },
        budgetCost: 150000,
        influenceMod: 18
      }
    ]
  },
  {
    id: 'speech_4',
    topic: 'İklim Değişikliği ve Ağır Sanayi',
    question: 'Yeşil dönüşüm savunucuları kömür santrallerinin derhal kapatılmasını istiyor. Ancak sendikalar binlerce madencinin işsiz kalacağını söylüyor. Hangi taraftasınız?',
    choices: [
      {
        text: 'Gezegenimizi kurtarmalıyız! Kömür santrallerini kapatıp tamamen yeşil ve temiz rüzgar/güneş enerjisine geçiyoruz.',
        impactText: 'Ekoloji severler, Gençler ve Liberaller hayran kaldı. Sendikalar ve işçiler protesto ediyor.',
        voterImpacts: { 'Liberaller': 14, 'Gençler': 20, 'İşçiler': -16, 'Esnaflar': -4 },
        budgetCost: 300000,
        influenceMod: 12
      },
      {
        text: 'Önce her hanenin mutfağı ve istihdamı! Enerji bağımsızlığımızı ve işçimizin ekmeğini korumak için yerli kömür madenlerimizi tam destekleyeceğiz.',
        impactText: 'İşçiler, Milliyetçiler ve Gelenekçiler ayakta alkışlıyor. Gençler hayal kırıklığı yaşıyor.',
        voterImpacts: { 'İşçiler': 18, 'Milliyetçiler': 12, 'Gelenekçiler': 8, 'Gençler': -15 },
        budgetCost: 150000,
        influenceMod: 15
      },
      {
        text: 'Adil Geçiş Planı! Madenleri kademeli kapatırken, her bir madencimize devlet garantili yeşil enerji teknisyeni eğitimi ve işi sağlayacağız.',
        impactText: 'Müthiş bir vizyon. Bütün gruplar bu barışçıl ve adil çözüme ısındı.',
        voterImpacts: { 'İşçiler': 10, 'Gençler': 12, 'Liberaller': 6, 'Esnaflar': 6 },
        budgetCost: 250000,
        influenceMod: 20
      }
    ]
  }
];
