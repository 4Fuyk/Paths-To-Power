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
      'Nationalistler': nationalists,
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
      'Nationalistler': nationalists,
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


const US_STATES_SPEC = [
  { name: 'Alabama', seats: 9, winner: 'REP', governor: 'Kay Ivey' },
  { name: 'Alaska', seats: 3, winner: 'REP', governor: 'Mike Dunleavy' },
  { name: 'Arizona', seats: 11, winner: 'DEM_US', governor: 'Katie Hobbs' },
  { name: 'Arkansas', seats: 6, winner: 'REP', governor: 'Sarah Huckabee Sanders' },
  { name: 'California', seats: 54, winner: 'DEM_US', governor: 'Gavin Newsom' },
  { name: 'Colorado', seats: 10, winner: 'DEM_US', governor: 'Jared Polis' },
  { name: 'Connecticut', seats: 7, winner: 'DEM_US', governor: 'Ned Lamont' },
  { name: 'Delaware', seats: 3, winner: 'DEM_US', governor: 'Matt Meyer' },
  { name: 'District of Columbia', seats: 3, winner: 'DEM_US', governor: 'Muriel Bowser' },
  { name: 'Florida', seats: 30, winner: 'REP', governor: 'Ron DeSantis' },
  { name: 'Georgia', seats: 16, winner: 'REP', governor: 'Brian Kemp' },
  { name: 'Hawaii', seats: 4, winner: 'DEM_US', governor: 'Josh Green' },
  { name: 'Idaho', seats: 4, winner: 'REP', governor: 'Brad Little' },
  { name: 'Illinois', seats: 19, winner: 'DEM_US', governor: 'J. B. Pritzker' },
  { name: 'Indiana', seats: 11, winner: 'REP', governor: 'Mike Braun' },
  { name: 'Iowa', seats: 6, winner: 'REP', governor: 'Kim Reynolds' },
  { name: 'Kansas', seats: 6, winner: 'DEM_US', governor: 'Laura Kelly' },
  { name: 'Kentucky', seats: 8, winner: 'DEM_US', governor: 'Andy Beshear' },
  { name: 'Louisiana', seats: 8, winner: 'REP', governor: 'Jeff Landry' },
  { name: 'Maine', seats: 4, winner: 'DEM_US', governor: 'Janet Mills' },
  { name: 'Maryland', seats: 10, winner: 'DEM_US', governor: 'Wes Moore' },
  { name: 'Massachusetts', seats: 11, winner: 'DEM_US', governor: 'Maura Healey' },
  { name: 'Michigan', seats: 15, winner: 'DEM_US', governor: 'Gretchen Whitmer' },
  { name: 'Minnesota', seats: 10, winner: 'DEM_US', governor: 'Tim Walz' },
  { name: 'Mississippi', seats: 6, winner: 'REP', governor: 'Tate Reeves' },
  { name: 'Missouri', seats: 10, winner: 'REP', governor: 'Mike Parson' },
  { name: 'Montana', seats: 4, winner: 'REP', governor: 'Greg Gianforte' },
  { name: 'Nebraska', seats: 5, winner: 'REP', governor: 'Jim Pillen' },
  { name: 'Nevada', seats: 6, winner: 'REP', governor: 'Joe Lombardo' },
  { name: 'New Hampshire', seats: 4, winner: 'REP', governor: 'Chris Sununu' },
  { name: 'New Jersey', seats: 14, winner: 'DEM_US', governor: 'Phil Murphy' },
  { name: 'New Mexico', seats: 5, winner: 'DEM_US', governor: 'Michelle Lujan Grisham' },
  { name: 'New York', seats: 28, winner: 'DEM_US', governor: 'Kathy Hochul' },
  { name: 'North Carolina', seats: 16, winner: 'DEM_US', governor: 'Roy Cooper' },
  { name: 'North Dakota', seats: 3, winner: 'REP', governor: 'Kelly Armstrong' },
  { name: 'Ohio', seats: 17, winner: 'REP', governor: 'Mike DeWine' },
  { name: 'Oklahoma', seats: 7, winner: 'REP', governor: 'Kevin Stitt' },
  { name: 'Oregon', seats: 8, winner: 'DEM_US', governor: 'Tina Kotek' },
  { name: 'Pennsylvania', seats: 19, winner: 'DEM_US', governor: 'Josh Shapiro' },
  { name: 'Rhode Island', seats: 4, winner: 'DEM_US', governor: 'Dan McKee' },
  { name: 'South Carolina', seats: 9, winner: 'REP', governor: 'Henry McMaster' },
  { name: 'South Dakota', seats: 3, winner: 'REP', governor: 'Kristi Noem' },
  { name: 'Tennessee', seats: 11, winner: 'REP', governor: 'Bill Lee' },
  { name: 'Texas', seats: 40, winner: 'REP', governor: 'Greg Abbott' },
  { name: 'Utah', seats: 6, winner: 'REP', governor: 'Spencer Cox' },
  { name: 'Vermont', seats: 3, winner: 'REP', governor: 'Phil Scott' },
  { name: 'Virginia', seats: 13, winner: 'REP', governor: 'Glenn Youngkin' },
  { name: 'Washington', seats: 12, winner: 'DEM_US', governor: 'Jay Inslee' },
  { name: 'West Virginia', seats: 4, winner: 'REP', governor: 'Jim Justice' },
  { name: 'Wisconsin', seats: 10, winner: 'DEM_US', governor: 'Tony Evers' },
  { name: 'Wyoming', seats: 3, winner: 'REP', governor: 'Mark Gordon' }
];

export const getUSRegions = (): Region[] => {
  return US_STATES_SPEC.map((spec) => {
    const base: Record<string, number> = {
      REP: 40,
      DEM_US: 40,
      LP: 6,
      GP: 4
    };

    if (spec.winner === 'REP') {
      base.REP = 50 + Math.floor(Math.random() * 8);
      base.DEM_US = 35 + Math.floor(Math.random() * 5);
      base.LP = 5 + Math.floor(Math.random() * 3);
      base.GP = 2 + Math.floor(Math.random() * 2);
    } else {
      base.DEM_US = 50 + Math.floor(Math.random() * 8);
      base.REP = 35 + Math.floor(Math.random() * 5);
      base.GP = 5 + Math.floor(Math.random() * 3);
      base.LP = 2 + Math.floor(Math.random() * 2);
    }

    const total = Object.values(base).reduce((s, v) => s + v, 0);
    const scale = 100 / total;
    const supports: Record<string, number> = {};
    Object.entries(base).forEach(([pId, val]) => {
      supports[pId] = parseFloat((val * scale).toFixed(2));
    });

    const workers = 15 + Math.floor(Math.random() * 15);
    const youth = 15 + Math.floor(Math.random() * 15);
    const nationalists = 10 + Math.floor(Math.random() * 15);
    const liberals = 15 + Math.floor(Math.random() * 10);
    const traditionalists = 10 + Math.floor(Math.random() * 15);
    const shopkeepers = 100 - (workers + youth + nationalists + liberals + traditionalists);

    const voterDistribution = {
      'İşçiler': workers,
      'Gençler': youth,
      'Nationalistler': nationalists,
      'Liberaller': liberals,
      'Gelenekçiler': traditionalists,
      'Esnaflar': Math.max(2, shopkeepers),
    };

    const normalized = spec.name.toLowerCase()
      .replace(/[^a-z]/g, '');

    const id = `US_${normalized}`;

    return {
      id,
      name: spec.name,
      seats: spec.seats,
      voterDistribution,
      supports,
      infrastructure: 4 + Math.floor(Math.random() * 2),
      campaignLevel: 0,
      ownerPartyId: spec.winner,
      mayorName: spec.governor
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
  'Nationalistler': nationalists,
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
      'Nationalistler': 2,
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
      'Nationalistler': -4,
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
      'Nationalistler': 14,
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
      'Nationalistler': 0,
      'Gelenekçiler': -3,
    }
  },
  {
    id: `${countryId}_bill_5`,
    title: 'Ulaşım ve Altyapı Yatırımları Fonu',
    description: 'Yüksek hızlı tren hatları ve otoyol projelerine bütçe ayırarak lojistik gücü artıracak altyapı fonu.',
    category: 'Ekonomi',
    status: 'Bekliyor',
    budgetCost: 600000,
    influenceMod: 12,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': 10,
      'Gençler': 3,
      'Esnaflar': 8,
      'Liberaller': 2,
      'Nationalistler': 6,
      'Gelenekçiler': 4,
    }
  },
  {
    id: `${countryId}_bill_6`,
    title: 'Yapay Zeka ve Yüksek Teknoloji Teşvik Yasası',
    description: 'Yazılım, yapay zeka ve mikroçip geliştiren yerli girişimcilere hibe ve vergi kolaylığı sağlama paketi.',
    category: 'Sağlık / Eğitim',
    status: 'Bekliyor',
    budgetCost: 350000,
    influenceMod: 20,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': 0,
      'Gençler': 15,
      'Esnaflar': 4,
      'Liberaller': 12,
      'Nationalistler': 5,
      'Gelenekçiler': -4,
    }
  },
  {
    id: `${countryId}_bill_7`,
    title: 'Temiz Su Kaynakları ve Orman Koruma Kanunu',
    description: 'Su havzalarını güvenceye alan, su kirliliği yaratan sanayiye ağır cezalar getiren ekolojik kanun.',
    category: 'Sağlık / Eğitim',
    status: 'Bekliyor',
    budgetCost: 180000,
    influenceMod: 10,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': 2,
      'Gençler': 10,
      'Esnaflar': -2,
      'Liberaller': 5,
      'Nationalistler': 4,
      'Gelenekçiler': 2,
    }
  },
  {
    id: `${countryId}_bill_8`,
    title: 'Sınır Güvenliği ve Göç Denetimi Yasası',
    description: 'Sınır karakollarının teknolojik donanımını artırmayı ve yasa dışı göçü engellemek için bütçe ayırmayı hedefleyen yasa.',
    category: 'Güvenlik',
    status: 'Bekliyor',
    budgetCost: 400000,
    influenceMod: 22,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': 3,
      'Gençler': -3,
      'Esnaflar': 6,
      'Liberaller': -8,
      'Nationalistler': 18,
      'Gelenekçiler': 12,
    }
  },
  {
    id: `${countryId}_bill_9`,
    title: 'Sağlık Hizmetleri Modernizasyon Reformu',
    description: 'Şehir hastanelerinin teçhizatını artıran, hekim kadrolarını ve tıbbi hammadde stoklarını güçlendiren büyük reform.',
    category: 'Sağlık / Eğitim',
    status: 'Bekliyor',
    budgetCost: 550000,
    influenceMod: 15,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': 8,
      'Gençler': 6,
      'Esnaflar': 4,
      'Liberaller': -1,
      'Nationalistler': 5,
      'Gelenekçiler': 8,
    }
  },
  {
    id: `${countryId}_bill_10`,
    title: 'Yerel Esnaf ve KOBİ Koruma Vergi Yasası',
    description: 'Yıllık cirosu belirli limitlerin altındaki esnaf ve küçük işletmelere vergi muafiyeti getiren ekonomik yardım.',
    category: 'Ekonomi',
    status: 'Bekliyor',
    budgetCost: 200000,
    influenceMod: 18,
    yesVotesPercentage: 0,
    voterImpacts: {
      'İşçiler': -2,
      'Gençler': 4,
      'Esnaflar': 16,
      'Liberaller': 8,
      'Nationalistler': 6,
      'Gelenekçiler': 8,
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
    system: 'Coalition Government',
    population: '85 Million',
    primaryColor: '#dc2626', // Turkish Red
    rivals: [
      { id: 'CHP', name: 'CHP', leader: 'Özgür Özel', ideology: 'Social Democrat', symbol: 'Flame', color: '#e30613', baseSupport: 37, photo: 'https://thf.bing.com/th/id/OIP.tw1bDleSary6Ua4NxPIuvgHaEK?w=292&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=' },
      { id: 'AKP', name: 'AK Parti', leader: 'Recep Tayyip Erdoğan', ideology: 'Conservative', symbol: 'Scale', color: '#ff9e1b', baseSupport: 35, photo: 'https://thf.bing.com/th/id/OIP.OSuQe5LJxNif6UcSy0D9YAHaE7?w=242&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'DEM', name: 'DEM Parti', leader: 'Tuncer Bakırhan', ideology: 'Socialist', symbol: 'Sparkles', color: '#8b5cf6', baseSupport: 9, photo: 'https://thf.bing.com/th/id/OIP.37I-MTcx4uo8vRif0r3DmgHaEO?w=278&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'MHP', name: 'MHP', leader: 'Devlet Bahçeli', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#991b1b', baseSupport: 7, photo: 'https://thf.bing.com/th/id/OIP.uKLHt8YQ5W_ghAlMr7TR7AHaEK?w=280&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'YRP', name: 'Yeniden Refah Partisi (YRP)', leader: 'Fatih Erbakan', ideology: 'Conservative', symbol: 'Key', color: '#2563eb', baseSupport: 6, photo: 'https://thf.bing.com/th/id/OIP.jwt8F1waSse9KWS-sVyWKgHaEK?w=303&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'ZAFER', name: 'Zafer Partisi', leader: 'Ümit Özdağ', ideology: 'Nationalist', symbol: 'Anchor', color: '#c2410c', baseSupport: 4, photo: 'https://thf.bing.com/th/id/OIP.D6YUtsOdukEPYEv357621AHaEK?w=332&h=186&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'TIP', name: 'TİP', leader: 'Erkan Baş', ideology: 'Socialist', symbol: 'Heart', color: '#be123c', baseSupport: 2, photo: 'https://thf.bing.com/th/id/OIP.z4i5RbWcUnSCP01SVVXeNwHaE7?w=255&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'TKP', name: 'TKP', leader: 'Kemal Okuyan', ideology: 'Socialist', symbol: 'Compass', color: '#dc2626', baseSupport: 1, photo: 'https://tse4.mm.bing.net/th/id/OIP.SnPu5vlsLQCb_aLz9UxpwgHaEK?r=0&cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'SAADET', name: 'Saadet Partisi', leader: 'Mahmut Arıkan', ideology: 'Conservative', symbol: 'Award', color: '#1d4ed8', baseSupport: 1, photo: 'https://i.gazeteduvar.com.tr/2/1280/720/storage/files/images/2024/11/19/mahmud-w0bc_cover.jpg' },
      { id: 'DEVA', name: 'DEVA Partisi', leader: 'Ali Babacan', ideology: 'Liberal', symbol: 'Globe', color: '#06b6d4', baseSupport: 1, photo: 'https://thf.bing.com/th/id/OIP.NeK1Fpea9DEqrDm_IGfEjAHaEN?w=308&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'GELECEK', name: 'Gelecek Partisi', leader: 'Ahmet Davutoğlu', ideology: 'Conservative', symbol: 'Leaf', color: '#16a34a', baseSupport: 1, photo: 'https://thf.bing.com/th/id/OIP.nYYgkEuIUEjy_QGs_Ha-agHaEK?w=289&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'VATAN', name: 'Vatan Partisi', leader: 'Doğu Perinçek', ideology: 'Nationalist', symbol: 'Star', color: '#b91c1c', baseSupport: 1, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Do%C4%9Fu_Perin%C3%A7ek_in_Tasnim_News_Agency.jpg/250px-Do%C4%9Fu_Perin%C3%A7ek_in_Tasnim_News_Agency.jpg' },
    ],
    regions: getTurkeyRegions(),
    bills: createBills('TR'),
    campaignTurns: 53,
    electionCycleYears: 5,
    termLimit: 2,
  },
  {
    id: 'US',
    name: 'United States of America',
    description: 'The world\'s largest economic and military power, governed by a two-party system and federal states.',
    flag: '🇺🇸',
    seats: 538,
    parliamentName: 'Congress (House of Representatives & Senate)',
    system: 'Presidential System',
    population: '333 Million',
    primaryColor: '#2563eb', // Tailwind blue-600
    rivals: [
      { id: 'REP', name: 'Republican Party', leader: 'Donald Trump', ideology: 'Conservative', symbol: 'ShieldCheck', color: '#dc2626', baseSupport: 46, photo: 'https://thfvnext.bing.com/th/id/OIP.aJ8W1Jp1-oYx6H22l-m_dAHaE7?w=260&h=180&c=7&r=0&o=7&cb=thfvnextfalcon3&pid=1.7&rm=3' },
      { id: 'DEM_US', name: 'Democratic Party', leader: 'Kamala Harris', ideology: 'Social Democrat', symbol: 'Globe', color: '#2563eb', baseSupport: 45, photo: 'https://thfvnext.bing.com/th/id/OIP.iDEUHnU5PFy9zsOdzZL0VQHaEK?w=308&h=180&c=7&r=0&o=7&cb=thfvnextfalcon3&pid=1.7&rm=3' },
      { id: 'LP', name: 'Libertarian Party', leader: 'Chase Oliver', ideology: 'Liberal', symbol: 'Bird', color: '#eab308', baseSupport: 6, photo: 'https://thfvnext.bing.com/th/id/OIP.c_KBzJb73OaFQMUvfUuF0wHaE7?w=250&h=180&c=7&r=0&o=7&cb=thfvnextfalcon3&pid=1.7&rm=3' },
      { id: 'GP', name: 'Green Party', leader: 'Jill Stein', ideology: 'Ecologist', symbol: 'Leaf', color: '#16a34a', baseSupport: 3, photo: 'https://thfvnext.bing.com/th/id/OIF.THHEKT1ezKNhsLglk3uxDQ?w=260&h=180&c=7&r=0&o=7&cb=thfvnextfalcon3&pid=1.7&rm=3' },
    ],
    regions: getUSRegions(),
    bills: createBills('US'),
    campaignTurns: 53,
    electionCycleYears: 4,
    termLimit: 2,
  },
  {
    id: 'DE',
    name: 'Germany',
    description: 'The economic engine of the European Union, a parliamentary giant dominated by coalition culture.',
    flag: '🇩🇪',
    seats: 630,
    parliamentName: 'Bundestag',
    system: 'Coalition Government',
    population: '84 Million',
    primaryColor: '#1f2937', // Germany Slate
    rivals: [
      { id: 'CDU', name: 'CDU/CSU (Union)', leader: 'Friedrich Merz', ideology: 'Conservative', symbol: 'Building', color: '#000000', baseSupport: 28.5, startingSeats: 208, photo: 'https://thf.bing.com/th/id/OIP.C6IhExWdSFCEi8UMuMPLpgHaEs?w=265&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'AfD', name: 'AfD (Alternative für Deutschland)', leader: 'Alice Weidel', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#009EE0', baseSupport: 20.8, startingSeats: 152, photo: 'https://thf.bing.com/th/id/OIP.HMj4SiIh4c7KS6KMTvXSSAHaEu?w=236&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'SPD', name: 'SPD (Sozialdemokratische Partei)', leader: 'Lars Klingbeil', ideology: 'Social Democrat', symbol: 'Users', color: '#E3000F', baseSupport: 16.4, startingSeats: 120, photo: 'https://thf.bing.com/th/id/OIP.AtJS2ybczy_TBZrRMeiCJwHaE7?w=283&h=187&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'GRÜNE', name: 'GRÜNE (Bündnis 90/Die Grünen)', leader: 'Franziska Brantner', ideology: 'Ecologist', symbol: 'Leaf', color: '#46962B', baseSupport: 11.6, startingSeats: 85, photo: 'https://thf.bing.com/th/id/OIP.IyG5NwjRofDj4_FbuGZNRQHaEK?w=322&h=181&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'LINKE', name: 'Die Linke', leader: 'Heidi Reichinnek / Jan van Aken', ideology: 'Socialist', symbol: 'Heart', color: '#BE3075', baseSupport: 8.8, startingSeats: 64, photo: 'https://thf.bing.com/th/id/OIP.d4VFRFsa1VBK8V33hKRESAHaEK?w=327&h=184&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'BSW', name: 'BSW (Bündnis Sahra Wagenknecht)', leader: 'Sahra Wagenknecht', ideology: 'Socialist', symbol: 'Sparkles', color: '#8B1A4B', baseSupport: 4.9, startingSeats: 0, photo: 'https://thf.bing.com/th/id/OIP.tU_3IENu_tkFM8v2XC_MQgHaEK?w=314&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'FDP', name: 'FDP (Freie Demokraten)', leader: 'Christian Lindner', ideology: 'Liberal', symbol: 'Zap', color: '#FFED00', baseSupport: 4.3, startingSeats: 0, photo: 'https://thf.bing.com/th/id/OIP.t97fKXH73vpJGAMOigSoPwHaEK?w=333&h=187&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'SSW', name: 'SSW (Südschleswigscher Wählerverband)', leader: 'Stefan Seidler', ideology: 'Social Democrat', symbol: 'Anchor', color: '#003D8F', baseSupport: 0.5, startingSeats: 1, photo: 'https://thf.bing.com/th/id/OIP.ZMWMp-FO5VvshEQLlsaR0gHaEK?w=325&h=183&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' }
    ],
    regions: getGermanyRegions(),
    bills: createBills('DE'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'GB',
    name: 'United Kingdom',
    description: 'A centuries-old constitutional monarchy shaped by the first-past-the-post electoral system.',
    flag: '🇬🇧',
    seats: 650,
    parliamentName: 'House of Commons',
    system: 'First-Past-The-Post',
    population: '67 Million',
    primaryColor: '#7c3aed', // Tailwind violet-600
    rivals: [
      { id: 'LAB', name: 'Labour Party', leader: 'Keir Starmer', ideology: 'Social Democrat', symbol: 'Users', color: '#E4003B', baseSupport: 34, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Keir_Starmer_Official_Portrait_2024.jpg/250px-Keir_Starmer_Official_Portrait_2024.jpg' },
      { id: 'CON', name: 'Conservative Party', leader: 'Kemi Badenoch', ideology: 'Conservative', symbol: 'TreeDeciduous', color: '#0087DC', baseSupport: 24, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Kemi_Badenoch_Official_Portrait_2023.jpg/250px-Kemi_Badenoch_Official_Portrait_2023.jpg' },
      { id: 'REF', name: 'Reform UK', leader: 'Nigel Farage', ideology: 'Nationalist', symbol: 'Shield', color: '#12B6CF', baseSupport: 14, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Nigel_Farage_Official_Portrait_2024.jpg/250px-Nigel_Farage_Official_Portrait_2024.jpg' },
      { id: 'LD', name: 'Liberal Democrats', leader: 'Ed Davey', ideology: 'Liberal', symbol: 'Bird', color: '#FAA61A', baseSupport: 12, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Ed_Davey_Official_Portrait.jpg/250px-Ed_Davey_Official_Portrait.jpg' },
      { id: 'GRN', name: 'Green Party', leader: 'Carla Denyer', ideology: 'Ecologist', symbol: 'Leaf', color: '#02A95B', baseSupport: 6, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Carla_Denyer_May_2024.jpg/250px-Carla_Denyer_May_2024.jpg' },
      { id: 'SNP', name: 'SNP', leader: 'John Swinney', ideology: 'Social Democrat', symbol: 'Flag', color: '#FDF38E', baseSupport: 3, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/John_Swinney_Official_Portrait.jpg/250px-John_Swinney_Official_Portrait.jpg' }
    ],
    regions: [
      { id: 'North East', name: 'North East', seats: 29, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'LAB' },
      { id: 'North West', name: 'North West', seats: 73, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LAB' },
      { id: 'Yorkshire and The Humber', name: 'Yorkshire and The Humber', seats: 54, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LAB' },
      { id: 'East Midlands', name: 'East Midlands', seats: 47, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LAB' },
      { id: 'West Midlands', name: 'West Midlands', seats: 57, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LAB' },
      { id: 'Eastern', name: 'Eastern', seats: 61, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'CON' },
      { id: 'London', name: 'London', seats: 75, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 5, campaignLevel: 0, ownerPartyId: 'LAB' },
      { id: 'South East', name: 'South East', seats: 91, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 5, campaignLevel: 0, ownerPartyId: 'CON' },
      { id: 'South West', name: 'South West', seats: 58, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LD' },
      { id: 'Scotland', name: 'Scotland', seats: 57, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'SNP' },
      { id: 'Wales', name: 'Wales', seats: 32, voterDistribution: makeVoterGroup(25, 20, 15, 10, 10, 20), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'LAB' }
    ],
    bills: createBills('GB'),
    campaignTurns: 53,
    electionCycleYears: 5,
    termLimit: 2,
  },
  {
    id: 'BR',
    name: 'Brazil',
    description: 'A polarized federal republic dealing with immense urban and environmental challenges.',
    flag: '🇧🇷',
    seats: 513,
    parliamentName: 'Chamber of Deputies',
    system: 'Presidential System',
    population: '214 Million',
    primaryColor: '#16a34a', // Tailwind green-600
    rivals: [
      { id: 'PT', name: 'Workers\' Party (PT)', leader: 'Lula da Silva', ideology: 'Socialist', symbol: 'Star', color: '#c21807', baseSupport: 29, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Lula_em_2023.jpg/250px-Lula_em_2023.jpg' },
      { id: 'PL', name: 'Liberal Party (PL)', leader: 'Jair Bolsonaro', ideology: 'Conservative', symbol: 'Shield', color: '#22409A', baseSupport: 30, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jair_Bolsonaro_2024.jpg/250px-Jair_Bolsonaro_2024.jpg' },
      { id: 'UNIAO', name: 'União Brasil', leader: 'Antonio Rueda', ideology: 'Conservative', symbol: 'Users', color: '#0052A5', baseSupport: 15, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Antonio_Rueda_%28pol%C3%ADtico%29.jpg/250px-Antonio_Rueda_%28pol%C3%ADtico%29.jpg' },
      { id: 'MDB', name: 'MDB', leader: 'Baleia Rossi', ideology: 'Liberal', symbol: 'Compass', color: '#00A859', baseSupport: 11, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Deputado_Baleia_Rossi_%28cropped%29.jpg/250px-Deputado_Baleia_Rossi_%28cropped%29.jpg' },
      { id: 'PSD', name: 'PSD', leader: 'Gilberto Kassab', ideology: 'Social Democrat', symbol: 'Globe', color: '#FFA500', baseSupport: 10, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Gilberto_Kassab.jpg/250px-Gilberto_Kassab.jpg' },
      { id: 'PP', name: 'Progressistas', leader: 'Ciro Nogueira', ideology: 'Conservative', symbol: 'Landmark', color: '#0057A0', baseSupport: 5, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Ciro_Nogueira_%282021%29_%28cropped%29.jpg/250px-Ciro_Nogueira_%282021%29_%28cropped%29.jpg' }
    ],
    regions: [
      { id: 'Acre', name: 'Acre', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Alagoas', name: 'Alagoas', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Amapá', name: 'Amapá', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Amazonas', name: 'Amazonas', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Bahia', name: 'Bahia', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Ceará', name: 'Ceará', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Distrito Federal', name: 'Distrito Federal', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Espírito Santo', name: 'Espírito Santo', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Goiás', name: 'Goiás', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Maranhão', name: 'Maranhão', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Mato Grosso', name: 'Mato Grosso', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Mato Grosso do Sul', name: 'Mato Grosso do Sul', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Minas Gerais', name: 'Minas Gerais', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Pará', name: 'Pará', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Paraíba', name: 'Paraíba', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Paraná', name: 'Paraná', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Pernambuco', name: 'Pernambuco', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Piauí', name: 'Piauí', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Rio de Janeiro', name: 'Rio de Janeiro', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Rio Grande do Norte', name: 'Rio Grande do Norte', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Rio Grande do Sul', name: 'Rio Grande do Sul', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Rondônia', name: 'Rondônia', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Roraima', name: 'Roraima', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Santa Catarina', name: 'Santa Catarina', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'São Paulo', name: 'São Paulo', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Sergipe', name: 'Sergipe', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Tocantins', name: 'Tocantins', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' }
    ],
    bills: createBills('BR'),
    campaignTurns: 48,
    electionCycleYears: 4,
    termLimit: 2,
  },  {
    id: 'JP',
    name: 'Japan',
    description: 'An aging but technologically advanced parliamentary system with strong single-party dominance.',
    flag: '🇯🇵',
    seats: 465,
    parliamentName: 'National Diet (House of Reps)',
    system: 'Coalition Government',
    population: '125 Million',
    primaryColor: '#ef4444', // Tailwind red-500
    rivals: [
      { id: 'LDP', name: 'LDP', leader: 'Shigeru Ishiba', ideology: 'Conservative', symbol: 'Building', color: '#52B848', baseSupport: 26, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Ishiba_Shigeru.jpg/250px-Ishiba_Shigeru.jpg' },
      { id: 'CDP', name: 'CDP', leader: 'Yoshihiko Noda', ideology: 'Social Democrat', symbol: 'Users', color: '#004098', baseSupport: 21, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Yoshihiko_Noda_2024.jpg/250px-Yoshihiko_Noda_2024.jpg' },
      { id: 'KOMEITO', name: 'Komeito', leader: 'Keiichi Ishii', ideology: 'Conservative', symbol: 'Sun', color: '#EB6EA5', baseSupport: 10, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Keiichi_Ishii.jpg/250px-Keiichi_Ishii.jpg' },
      { id: 'ISHIN', name: 'Ishin no Kai', leader: 'Nobuyuki Baba', ideology: 'Nationalist', symbol: 'Shield', color: '#B6D300', baseSupport: 9, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Nobuyuki_Baba.jpg/250px-Nobuyuki_Baba.jpg' },
      { id: 'DPFP', name: 'DPFP', leader: 'Yuichiro Tamaki', ideology: 'Liberal', symbol: 'Bird', color: '#F6B132', baseSupport: 7, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Yuichiro_Tamaki.jpg/250px-Yuichiro_Tamaki.jpg' },
      { id: 'JCP', name: 'JCP', leader: 'Tomoko Tamura', ideology: 'Socialist', symbol: 'Star', color: '#DB001C', baseSupport: 6, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tomoko_Tamura.jpg/250px-Tomoko_Tamura.jpg' }
    ],
    regions: [
      { id: 'Aichi', name: 'Aichi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Akita', name: 'Akita', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Aomori', name: 'Aomori', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Chiba', name: 'Chiba', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Ehime', name: 'Ehime', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Fukui', name: 'Fukui', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Fukuoka', name: 'Fukuoka', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Fukushima', name: 'Fukushima', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Gifu', name: 'Gifu', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Gunma', name: 'Gunma', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Hiroshima', name: 'Hiroshima', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Hokkaido', name: 'Hokkaido', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Hyogo', name: 'Hyogo', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Ibaraki', name: 'Ibaraki', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Ishikawa', name: 'Ishikawa', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Iwate', name: 'Iwate', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kagawa', name: 'Kagawa', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kagoshima', name: 'Kagoshima', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kanagawa', name: 'Kanagawa', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kochi', name: 'Kochi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kumamoto', name: 'Kumamoto', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kyoto', name: 'Kyoto', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Mie', name: 'Mie', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Miyagi', name: 'Miyagi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Miyazaki', name: 'Miyazaki', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Nagano', name: 'Nagano', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Nagasaki', name: 'Nagasaki', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Nara', name: 'Nara', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Niigata', name: 'Niigata', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Oita', name: 'Oita', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Okayama', name: 'Okayama', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Okinawa', name: 'Okinawa', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Osaka', name: 'Osaka', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Saga', name: 'Saga', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Saitama', name: 'Saitama', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Shiga', name: 'Shiga', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Shimane', name: 'Shimane', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Shizuoka', name: 'Shizuoka', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Tochigi', name: 'Tochigi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Tokushima', name: 'Tokushima', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Tokyo', name: 'Tokyo', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Tottori', name: 'Tottori', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Toyama', name: 'Toyama', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Wakayama', name: 'Wakayama', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Yamagata', name: 'Yamagata', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Yamaguchi', name: 'Yamaguchi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Yamanashi', name: 'Yamanashi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' }
    ],
    bills: createBills('JP'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },  {
    id: 'EG',
    name: 'Egypt',
    description: 'A deeply historic nation managing vast population growth and economic transitions along the Nile.',
    flag: '🇪🇬',
    seats: 596,
    parliamentName: 'House of Representatives',
    system: 'Presidential System',
    population: '111 Million',
    primaryColor: '#b91c1c', // Tailwind red-700
    rivals: [
      { id: 'NFP', name: 'Nation\'s Future', leader: 'Abdel Wahab', ideology: 'Conservative', symbol: 'Building', color: '#105B35', baseSupport: 53, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Abdel-Wahab_Abdel-Razeq.jpg/250px-Abdel-Wahab_Abdel-Razeq.jpg' },
      { id: 'RPP', name: 'Republican People\'s', leader: 'Hazem Omar', ideology: 'Conservative', symbol: 'Users', color: '#1F2937', baseSupport: 8, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Hazem_Omar.jpg/250px-Hazem_Omar.jpg' },
      { id: 'WAFD', name: 'New Wafd Party', leader: 'Abdel Sanad Yamama', ideology: 'Liberal', symbol: 'Landmark', color: '#008000', baseSupport: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Dr._Abdel-Sanad_Yamama.jpg/250px-Dr._Abdel-Sanad_Yamama.jpg' },
      { id: 'HDP', name: 'Homeland Defenders', leader: 'Galal Haridy', ideology: 'Nationalist', symbol: 'Shield', color: '#2563EB', baseSupport: 4, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Galal_Haridy.jpg/250px-Galal_Haridy.jpg' },
      { id: 'MEP', name: 'Modern Egypt', leader: 'Nabil Deibis', ideology: 'Liberal', symbol: 'Briefcase', color: '#DC2626', baseSupport: 2, photo: 'https://thf.bing.com/th/id/OIP.TfX1K9wIok0lY246_n-uQwAAAA?w=197&h=196&c=7&r=0&o=7&pid=1.7' },
      { id: 'ESDP', name: 'ESDP', leader: 'Farid Zahran', ideology: 'Social Democrat', symbol: 'Compass', color: '#F97316', baseSupport: 1, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Farid_Zahran.jpg/250px-Farid_Zahran.jpg' }
    ],
    regions: [
      { id: 'Al Iskandariyah', name: 'Al Iskandariyah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Aswan', name: 'Aswan', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Asyut', name: 'Asyut', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Buhayrah', name: 'Al Buhayrah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Bani Suwayf', name: 'Bani Suwayf', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Qahirah', name: 'Al Qahirah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Ad Daqahliyah', name: 'Ad Daqahliyah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Dumyat', name: 'Dumyat', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Fayyum', name: 'Al Fayyum', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Gharbiyah', name: 'Al Gharbiyah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Jizah', name: 'Al Jizah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Isma`iliyah', name: 'Al Isma`iliyah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Kafr ash Shaykh', name: 'Kafr ash Shaykh', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Luxor', name: 'Luxor', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Matruh', name: 'Matruh', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Minya', name: 'Al Minya', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Minufiyah', name: 'Al Minufiyah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Wadi at Jadid', name: 'Al Wadi at Jadid', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Shamal Sina\'', name: 'Shamal Sina\'', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Bur Sa`id', name: 'Bur Sa`id', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Qalyubiyah', name: 'Al Qalyubiyah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Qina', name: 'Qina', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Al Bahr al Ahmar', name: 'Al Bahr al Ahmar', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Ash Sharqiyah', name: 'Ash Sharqiyah', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Suhaj', name: 'Suhaj', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Janub Sina\'', name: 'Janub Sina\'', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'As Suways', name: 'As Suways', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' }
    ],
    bills: createBills('EG'),
    campaignTurns: 53,
    electionCycleYears: 5,
    termLimit: 2,
  }
];

export const SPEECH_CARDS_POOL: SpeechCard[] = [
  {
    id: 'eco1',
    topic: 'Economy',
    question: 'How do you plan to tackle the rising inflation rates affecting daily goods?',
    choices: [
      { text: 'Increase subsidies for essential goods', impactText: 'Appeals to lower class, costs high budget', voterImpacts: { lowerClass: 5, upperClass: -2 }, budgetCost: 50000, influenceMod: 0 },
      { text: 'Implement strict fiscal austerity measures', impactText: 'Appeals to upper class and conservatives, lowers overall influence', voterImpacts: { upperClass: 5, lowerClass: -5, conservatives: 3 }, budgetCost: 0, influenceMod: -10 },
      { text: 'Focus on domestic production incentives', impactText: 'Balanced approach, moderate cost', voterImpacts: { lowerClass: 2, upperClass: 2 }, budgetCost: 20000, influenceMod: 5 }
    ]
  },
  {
    id: 'sec1',
    topic: 'National Security',
    question: 'With increasing border tensions, what is your stance on military spending?',
    choices: [
      { text: 'Increase military budget significantly', impactText: 'Strongly appeals to nationalists and conservatives', voterImpacts: { nationalists: 6, conservatives: 4, liberals: -3 }, budgetCost: 60000, influenceMod: 10 },
      { text: 'Maintain current budget, focus on efficiency', impactText: 'Appeals to moderates', voterImpacts: { liberals: 2, conservatives: -2 }, budgetCost: 0, influenceMod: 5 },
      { text: 'Reduce military spending, fund social programs', impactText: 'Appeals to liberals and lower class', voterImpacts: { liberals: 5, lowerClass: 4, nationalists: -6 }, budgetCost: -20000, influenceMod: 0 }
    ]
  },
  {
    id: 'soc1',
    topic: 'Social Policy',
    question: 'What is your vision for the future of our healthcare system?',
    choices: [
      { text: 'Push for universal free healthcare', impactText: 'High cost, massive appeal to lower/middle class', voterImpacts: { lowerClass: 6, upperClass: -3, liberals: 4 }, budgetCost: 80000, influenceMod: 15 },
      { text: 'Privatize aspects of the healthcare system', impactText: 'Appeals to upper class and conservatives, generates revenue', voterImpacts: { upperClass: 5, lowerClass: -5, conservatives: 3 }, budgetCost: -30000, influenceMod: -5 },
      { text: 'Increase funding for rural clinics only', impactText: 'Moderate cost, appeals to middle class', voterImpacts: { middleClass: 4 }, budgetCost: 25000, influenceMod: 5 }
    ]
  },
  {
    id: 'env1',
    topic: 'Environment',
    question: 'How will you balance industrial growth with environmental protection?',
    choices: [
      { text: 'Implement strict green energy regulations', impactText: 'Appeals to liberals, costs budget, angers conservatives', voterImpacts: { liberals: 5, conservatives: -4, upperClass: -2 }, budgetCost: 30000, influenceMod: 5 },
      { text: 'Prioritize industrial output and jobs', impactText: 'Appeals to lower class and conservatives, angers liberals', voterImpacts: { lowerClass: 4, conservatives: 3, liberals: -5 }, budgetCost: 0, influenceMod: 5 },
      { text: 'Subsidize clean technology research', impactText: 'High cost, balanced appeal', voterImpacts: { liberals: 3, middleClass: 2 }, budgetCost: 40000, influenceMod: 10 }
    ]
  }
];

export const generateName = (countryId: string): string => {
  const trFirst = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Mustafa', 'Ali', 'Zeynep', 'Hüseyin', 'Hatice', 'İbrahim'];
  const trLast = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir'];
  
  const deFirst = ['Thomas', 'Michael', 'Andreas', 'Sabine', 'Martina', 'Susanne', 'Christian', 'Stefan', 'Maria', 'Peter'];
  const deLast = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann'];

  const usFirst = ['James', 'John', 'Robert', 'Michael', 'William', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth'];
  const usLast = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  const brFirst = ['João', 'Maria', 'José', 'Ana', 'Antônio', 'Francisco', 'Carlos', 'Paulo', 'Pedro', 'Lucas'];
  const brLast = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes'];

  const jpFirst = ['Kenji', 'Hiroshi', 'Takashi', 'Minoru', 'Naoki', 'Yuki', 'Akira', 'Satoshi', 'Yumi', 'Megumi'];
  const jpLast = ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato'];

  const egFirst = ['Ahmed', 'Mohamed', 'Mahmoud', 'Mustafa', 'Youssef', 'Ibrahim', 'Ali', 'Omar', 'Amr', 'Hassan'];
  const egLast = ['Hassan', 'Ali', 'Mohamed', 'Ibrahim', 'Mahmoud', 'Salem', 'Hussein', 'Mostafa', 'Abdel', 'Fatah'];

  const gbFirst = ['Oliver', 'George', 'Harry', 'Jack', 'Jacob', 'Noah', 'Charlie', 'Muhammad', 'Thomas', 'Oscar'];
  const gbLast = ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright'];

  const sample = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (countryId === 'TR') return `${sample(trFirst)} ${sample(trLast)}`;
  if (countryId === 'DE') return `${sample(deFirst)} ${sample(deLast)}`;
  if (countryId === 'US') return `${sample(usFirst)} ${sample(usLast)}`;
  if (countryId === 'BR') return `${sample(brFirst)} ${sample(brLast)}`;
  if (countryId === 'JP') return `${sample(jpFirst)} ${sample(jpLast)}`;
  if (countryId === 'EG') return `${sample(egFirst)} ${sample(egLast)}`;
  if (countryId === 'GB') return `${sample(gbFirst)} ${sample(gbLast)}`;

  return `${sample(usFirst)} ${sample(usLast)}`;
};
