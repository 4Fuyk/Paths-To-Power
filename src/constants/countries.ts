/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, VoterGroup, Bill, RivalParty, Region, SpeechCard } from '../types';

const TURKEY_PROVINCES_SPEC = [
  { name: 'Adana', seats: 15, winner: 'CHP', mayorName: 'Zeydan Karalar' },
  { name: 'Adıyaman', seats: 5, winner: 'CHP', mayorName: 'Abdurrahman Tutdere' },
  { name: 'Afyonkarahisar', seats: 6, winner: 'CHP', mayorName: 'Burcu Köksal' },
  { name: 'Ağrı', seats: 4, winner: 'DEM', mayorName: 'Hazal Aras' },
  { name: 'Amasya', seats: 3, winner: 'CHP', mayorName: 'Turgay Sevindi' },
  { name: 'Ankara', seats: 36, winner: 'CHP', mayorName: 'Mansur Yavaş', supports: { CHP: 60.44, AKP: 31.68, YRP: 3.12, ZAFER: 1.51, DEM: 1.01, MHP: 0.1, TIP: 0.2, TKP: 0.1, SAADET: 0.5, DEVA: 0.4, GELECEK: 0.1, VATAN: 0.1 } },
  { name: 'Antalya', seats: 17, winner: 'CHP', mayorName: 'Muhittin Böcek' },
  { name: 'Artvin', seats: 2, winner: 'CHP', mayorName: 'Bilgehan Erdem' },
  { name: 'Aydın', seats: 8, winner: 'CHP', mayorName: 'Özlem Çerçioğlu' },
  { name: 'Balıkesir', seats: 9, winner: 'CHP', mayorName: 'Ahmet Akın' },
  { name: 'Bilecik', seats: 2, winner: 'CHP', mayorName: 'Melek Mızrak Subaşı' },
  { name: 'Bingöl', seats: 3, winner: 'AKP', mayorName: 'Erdal Arıkan' },
  { name: 'Bitlis', seats: 3, winner: 'AKP', mayorName: 'Nesrullah Tanğlay' },
  { name: 'Bolu', seats: 3, winner: 'CHP', mayorName: 'Tanju Özcan' },
  { name: 'Burdur', seats: 3, winner: 'CHP', mayorName: 'Ali Orkun Ercengiz' },
  { name: 'Bursa', seats: 20, winner: 'CHP', mayorName: 'Mustafa Bozbey' },
  { name: 'Çanakkale', seats: 4, winner: 'CHP', mayorName: 'Muharrem Erkek' },
  { name: 'Çankırı', seats: 2, winner: 'MHP', mayorName: 'İsmail Hakkı Esen' },
  { name: 'Çorum', seats: 4, winner: 'AKP', mayorName: 'Halil İbrahim Aşgın' },
  { name: 'Denizli', seats: 7, winner: 'CHP', mayorName: 'Bülent Nuri Çavuşoğlu' },
  { name: 'Diyarbakır', seats: 12, winner: 'DEM', mayorName: 'Ayşe Serra Bucak Küçük', supports: { CHP: 3.50, AKP: 16.85, YRP: 3.65, DEM: 64.09, ZAFER: 0.5, MHP: 0.1, TIP: 0.3, TKP: 0.1, SAADET: 0.8, DEVA: 0.4, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'Edirne', seats: 4, winner: 'CHP', mayorName: 'Filiz Gencan Akın' },
  { name: 'Elazığ', seats: 5, winner: 'AKP', mayorName: 'Şahin Şerifoğulları' },
  { name: 'Erzincan', seats: 2, winner: 'MHP', mayorName: 'Bekir Aksun' },
  { name: 'Erzurum', seats: 6, winner: 'AKP', mayorName: 'Mehmet Sekmen' },
  { name: 'Eskişehir', seats: 7, winner: 'CHP', mayorName: 'Ayşe Ünlüce', supports: { CHP: 51.02, AKP: 37.85, YRP: 2.12, ZAFER: 2.45, DEM: 1.15, MHP: 0.1, TIP: 0.8, TKP: 0.2, SAADET: 0.6, DEVA: 0.3, GELECEK: 0.1, VATAN: 0.1 } },
  { name: 'Gaziantep', seats: 14, winner: 'AKP', mayorName: 'Fatma Şahin', supports: { CHP: 28.12, AKP: 38.83, YRP: 17.22, DEM: 5.48, ZAFER: 2.45, MHP: 0.1, TIP: 0.2, TKP: 0.1, SAADET: 1.1, DEVA: 0.8, GELECEK: 0.3, VATAN: 0.1 } },
  { name: 'Giresun', seats: 4, winner: 'CHP', mayorName: 'Fuat Köse' },
  { name: 'Gümüşhane', seats: 2, winner: 'MHP', mayorName: 'Vedat Soner Başer' },
  { name: 'Hakkari', seats: 3, winner: 'DEM', mayorName: 'Mehmet Sıddık Akış' },
  { name: 'Hatay', seats: 11, winner: 'AKP', mayorName: 'Mehmet Öntürk', supports: { CHP: 44.02, AKP: 44.48, TIP: 2.01, DEM: 1.5, YRP: 2.1, ZAFER: 1.2, MHP: 0.1, TKP: 0.1, SAADET: 0.5, DEVA: 0.3, GELECEK: 0.1, VATAN: 0.1 } },
  { name: 'Isparta', seats: 4, winner: 'AKP', mayorName: 'Şükrü Başdeğirmen' },
  { name: 'Mersin', seats: 13, winner: 'CHP', mayorName: 'Vahap Seçer' },
  { name: 'İstanbul', seats: 98, winner: 'CHP', mayorName: 'Ekrem İmamoğlu', supports: { CHP: 51.15, AKP: 39.59, YRP: 2.61, ZAFER: 2.25, DEM: 2.12, MHP: 0.1, TIP: 0.5, TKP: 0.2, SAADET: 0.8, DEVA: 0.3, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'İzmir', seats: 28, winner: 'CHP', mayorName: 'Cemil Tugay', supports: { CHP: 48.97, AKP: 37.06, DEM: 4.19, ZAFER: 2.52, YRP: 0.9, MHP: 0.1, TIP: 1.5, TKP: 0.4, SAADET: 0.6, DEVA: 0.4, GELECEK: 0.1, VATAN: 0.1 } },
  { name: 'Kars', seats: 3, winner: 'MHP', mayorName: 'Ötüken Senger' },
  { name: 'Kastamonu', seats: 3, winner: 'CHP', mayorName: 'Hasan Baltacı' },
  { name: 'Kayseri', seats: 10, winner: 'AKP', mayorName: 'Memduh Büyükkılıç' },
  { name: 'Kırklareli', seats: 3, winner: 'MHP', mayorName: 'Derya Bulut' },
  { name: 'Kırşehir', seats: 2, winner: 'CHP', mayorName: 'Selahattin Ekicioğlu' },
  { name: 'Kocaeli', seats: 14, winner: 'AKP', mayorName: 'Tahir Büyükakın' },
  { name: 'Konya', seats: 15, winner: 'AKP', mayorName: 'Uğur İbrahim Altay', supports: { CHP: 12.86, AKP: 49.44, YRP: 23.44, ZAFER: 3.01, DEM: 3.42, MHP: 0.1, TIP: 0.1, TKP: 0.1, SAADET: 2.1, DEVA: 0.5, GELECEK: 0.7, VATAN: 0.1 } },
  { name: 'Kütahya', seats: 5, winner: 'CHP', mayorName: 'Eyüp Kahveci' },
  { name: 'Malatya', seats: 6, winner: 'AKP', mayorName: 'Sami Er' },
  { name: 'Manisa', seats: 10, winner: 'CHP', mayorName: 'Ferdi Zeyrek' },
  { name: 'Kahramanmaraş', seats: 8, winner: 'AKP', mayorName: 'Fırat Görgel' },
  { name: 'Mardin', seats: 6, winner: 'DEM', mayorName: 'Ahmet Türk' },
  { name: 'Muğla', seats: 7, winner: 'CHP', mayorName: 'Ahmet Aras' },
  { name: 'Muş', seats: 3, winner: 'DEM', mayorName: 'Sırrı Söylemez' },
  { name: 'Nevşehir', seats: 3, winner: 'AKP', mayorName: 'Rasim Arı' },
  { name: 'Niğde', seats: 3, winner: 'AKP', mayorName: 'Emrah Özdemir' },
  { name: 'Ordu', seats: 6, winner: 'AKP', mayorName: 'Mehmet Hilmi Güler' },
  { name: 'Osmaniye', seats: 4, winner: 'MHP', mayorName: 'Ibrahim Çenet' },
  { name: 'Rize', seats: 3, winner: 'AKP', mayorName: 'Rahmi Metin' },
  { name: 'Sakarya', seats: 8, winner: 'AKP', mayorName: 'Yusuf Alemdar' },
  { name: 'Samsun', seats: 9, winner: 'AKP', mayorName: 'Halit Doğan' },
  { name: 'Şanlıurfa', seats: 14, winner: 'YRP', mayorName: 'Mehmet Kasım Gülpınar', supports: { CHP: 1.51, AKP: 33.64, YRP: 38.87, DEM: 21.16, ZAFER: 0.5, MHP: 0.1, TIP: 0.1, TKP: 0.1, SAADET: 0.9, DEVA: 0.3, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'Siirt', seats: 3, winner: 'DEM', mayorName: 'Sofya Alağaş' },
  { name: 'Sinop', seats: 2, winner: 'CHP', mayorName: 'Metin Gürbüz' },
  { name: 'Şırnak', seats: 4, winner: 'AKP', mayorName: 'Mehmet Yarka' },
  { name: 'Sivas', seats: 5, winner: 'MHP', mayorName: 'Adem Uzun', supports: { CHP: 7.35, AKP: 29.15, MHP: 43.32, YRP: 13.12, ZAFER: 1.5, DEM: 0.1, TIP: 0.1, TKP: 0.1, SAADET: 1.5, DEVA: 0.2, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'Tekirdağ', seats: 8, winner: 'CHP', mayorName: 'Candan Yüceer' },
  { name: 'Tokat', seats: 5, winner: 'MHP', mayorName: 'Mehmet Kemal Yazıcıoğlu' },
  { name: 'Trabzon', seats: 6, winner: 'AKP', mayorName: 'Ahmet Metin Genç', supports: { CHP: 28.46, AKP: 51.48, YRP: 9.14, ZAFER: 2.12, DEM: 0.15, MHP: 0.1, TIP: 0.1, TKP: 0.1, SAADET: 1.5, DEVA: 0.4, GELECEK: 0.2, VATAN: 0.1 } },
  { name: 'Tunceli', seats: 1, winner: 'DEM', mayorName: 'Cevdet Konak' },
  { name: 'Uşak', seats: 3, winner: 'CHP', mayorName: 'Özkan Yalım' },
  { name: 'Van', seats: 8, winner: 'DEM', mayorName: 'Abdullah Zeydan' },
  { name: 'Yalova', seats: 3, winner: 'CHP', mayorName: 'Mehmet Gürel' },
  { name: 'Yozgat', seats: 4, winner: 'YRP', mayorName: 'Kazım Arslan' },
  { name: 'Zonguldak', seats: 5, winner: 'CHP', mayorName: 'Tahsin Erdem' },
  { name: 'Aksaray', seats: 4, winner: 'AKP', mayorName: 'Evren Dinçer' },
  { name: 'Bayburt', seats: 1, winner: 'AKP', mayorName: 'Mete Memiş' },
  { name: 'Karaman', seats: 3, winner: 'MHP', mayorName: 'Savaş Kalaycı' },
  { name: 'Kırıkkale', seats: 3, winner: 'CHP', mayorName: 'Ahmet Önal' },
  { name: 'Batman', seats: 5, winner: 'DEM', mayorName: 'Gülüstan Sönük' },
  { name: 'Bartın', seats: 2, winner: 'CHP', mayorName: 'Rıza Yalçınkaya' },
  { name: 'Ardahan', seats: 2, winner: 'CHP', mayorName: 'Faruk Demir' },
  { name: 'Iğdır', seats: 2, winner: 'DEM', mayorName: 'Mehmet Nuri Güneş' },
  { name: 'Karabük', seats: 3, winner: 'AKP', mayorName: 'Özkan Çetinkaya' },
  { name: 'Kilis', seats: 2, winner: 'CHP', mayorName: 'Hakan Bilecen' },
  { name: 'Düzce', seats: 3, winner: 'AKP', mayorName: 'Faruk Özlü' }
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
    const Nationalists = 10 + Math.floor(Math.random() * 15);
    const Liberals = 8 + Math.floor(Math.random() * 10);
    const traditionalists = 10 + Math.floor(Math.random() * 20);
    const shopkeepers = 100 - (workers + youth + Nationalists + Liberals + traditionalists);

    const voterDistribution = {
      'Workers': workers,
      'Youth': youth,
      'Nationalists': Nationalists,
      'Liberals': Liberals,
      'Traditionalists': traditionalists,
      'Shopkeepers': Math.max(2, shopkeepers),
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
      mayorName: prov.mayorName
    };
  });
};

const GERMANY_STATES_SPEC = [
  { name: 'Baden-Württemberg', seats: 83, winner: 'CDU', mayorName: 'Winfried Kretschmann' },
  { name: 'Bayern', seats: 99, winner: 'CDU', mayorName: 'Markus Söder' },
  { name: 'Berlin', seats: 28, winner: 'CDU', mayorName: 'Kai Wegner' },
  { name: 'Brandenburg', seats: 19, winner: 'AfD', mayorName: 'Dietmar Woidke' },
  { name: 'Bremen', seats: 5, winner: 'SPD', mayorName: 'Andreas Bovenschulte' },
  { name: 'Hamburg', seats: 14, winner: 'SPD', mayorName: 'Peter Tschentscher' },
  { name: 'Hessen', seats: 47, winner: 'CDU', mayorName: 'Boris Rhein' },
  { name: 'Mecklenburg-Vorpommern', seats: 13, winner: 'AfD', mayorName: 'Manuela Schwesig' },
  { name: 'Niedersachsen', seats: 60, winner: 'CDU', mayorName: 'Stephan Weil' },
  { name: 'Nordrhein-Westfalen', seats: 136, winner: 'CDU', mayorName: 'Hendrik Wüst' },
  { name: 'Rheinland-Pfalz', seats: 31, winner: 'CDU', mayorName: 'Alexander Schweitzer' },
  { name: 'Saarland', seats: 8, winner: 'CDU', mayorName: 'Anke Rehlinger' },
  { name: 'Sachsen', seats: 31, winner: 'AfD', mayorName: 'Michael Kretschmer' },
  { name: 'Sachsen-Anhalt', seats: 17, winner: 'AfD', mayorName: 'Reiner Haseloff' },
  { name: 'Schleswig-Holstein', seats: 22, winner: 'CDU', mayorName: 'Daniel Günther' },
  { name: 'Thüringen', seats: 17, winner: 'AfD', mayorName: 'Bodo Ramelow' }
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
    const Nationalists = 8 + Math.floor(Math.random() * 12);
    const Liberals = 12 + Math.floor(Math.random() * 10);
    const traditionalists = 12 + Math.floor(Math.random() * 15);
    const shopkeepers = 100 - (workers + youth + Nationalists + Liberals + traditionalists);

    const voterDistribution = {
      'Workers': workers,
      'Youth': youth,
      'Nationalists': Nationalists,
      'Liberals': Liberals,
      'Traditionalists': traditionalists,
      'Shopkeepers': Math.max(2, shopkeepers),
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
      mayorName: spec.mayorName
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
    const Nationalists = 10 + Math.floor(Math.random() * 15);
    const Liberals = 15 + Math.floor(Math.random() * 10);
    const traditionalists = 10 + Math.floor(Math.random() * 15);
    const shopkeepers = 100 - (workers + youth + Nationalists + Liberals + traditionalists);

    const voterDistribution = {
      'Workers': workers,
      'Youth': youth,
      'Nationalists': Nationalists,
      'Liberals': Liberals,
      'Traditionalists': traditionalists,
      'Shopkeepers': Math.max(2, shopkeepers),
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
  Nationalists: number,
  Liberals: number,
  traditionalists: number,
  shopkeepers: number
): Record<string, number> => ({
  'Workers': workers,
  'Youth': youth,
  'Nationalists': Nationalists,
  'Liberals': Liberals,
  'Traditionalists': traditionalists,
  'Shopkeepers': shopkeepers,
});

// Helper to generate regions dynamically based on local party specs and actual historical wins
const generateRegionsFromSpec = (
  countryId: string,
  specs: { name: string; seats: number; winner: string; mayorName?: string }[],
  partyIds: string[],
  baseSupports: Record<string, number>
): Region[] => {
  return specs.map((spec) => {
    // Generate a randomized but balanced support map
    const base: Record<string, number> = {};
    partyIds.forEach((pId) => {
      base[pId] = baseSupports[pId] || 10;
    });

    if (spec.winner && base[spec.winner] !== undefined) {
      // Give a boost to the winner in this region
      const boost = 12 + Math.floor(Math.random() * 8);
      base[spec.winner] += boost;
      
      // Reduce the other parties a bit, keep them above 1
      partyIds.forEach((pId) => {
        if (pId !== spec.winner) {
          base[pId] = Math.max(1, base[pId] - (1 + Math.floor(Math.random() * 4)));
        }
      });
    }

    // Normalize supports to sum to exactly 100%
    const total = Object.values(base).reduce((s, v) => s + v, 0);
    const scale = 100 / total;
    const supports: Record<string, number> = {};
    Object.entries(base).forEach(([pId, val]) => {
      supports[pId] = parseFloat((val * scale).toFixed(1));
    });

    // Make sure it sums to exactly 100 by adjusting the winner
    const sum = Object.values(supports).reduce((s, v) => s + v, 0);
    if (sum !== 100) {
      const diff = parseFloat((100 - sum).toFixed(1));
      if (spec.winner && supports[spec.winner] !== undefined) {
        supports[spec.winner] = parseFloat((supports[spec.winner] + diff).toFixed(1));
      } else {
        const firstId = partyIds[0];
        supports[firstId] = parseFloat((supports[firstId] + diff).toFixed(1));
      }
    }

    // Seed demographic distribution based on seats and random variance
    const workers = 15 + Math.floor(Math.random() * 15);
    const youth = 15 + Math.floor(Math.random() * 15);
    const nationalists = 10 + Math.floor(Math.random() * 15);
    const liberals = 10 + Math.floor(Math.random() * 12);
    const traditionalists = 10 + Math.floor(Math.random() * 15);
    const shopkeepers = 100 - (workers + youth + nationalists + liberals + traditionalists);

    const voterDistribution = makeVoterGroup(
      workers,
      youth,
      nationalists,
      liberals,
      traditionalists,
      Math.max(2, shopkeepers)
    );

    const infrastructure = spec.seats >= 30 ? 5 : spec.seats >= 15 ? 4 : 3;
    const normalized = spec.name.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z]/g, '');
    const id = `${countryId}_${normalized}`;

    return {
      id,
      name: spec.name,
      seats: spec.seats,
      voterDistribution,
      supports,
      infrastructure,
      campaignLevel: 0,
      ownerPartyId: spec.winner,
      mayorName: spec.mayorName || getDeterministicMayorName(spec.name, countryId)
    };
  });
};

const CANADA_SPEC = [
  { name: 'Ontario', seats: 121, winner: 'LIB', mayorName: 'Doug Ford' },
  { name: 'Quebec', seats: 78, winner: 'BQ', mayorName: 'François Legault' },
  { name: 'British Columbia', seats: 42, winner: 'CON', mayorName: 'David Eby' },
  { name: 'Alberta', seats: 34, winner: 'CON', mayorName: 'Danielle Smith' },
  { name: 'Manitoba', seats: 14, winner: 'CON', mayorName: 'Wab Kinew' },
  { name: 'Saskatchewan', seats: 14, winner: 'CON', mayorName: 'Scott Moe' },
  { name: 'Nova Scotia', seats: 11, winner: 'LIB', mayorName: 'Tim Houston' },
  { name: 'New Brunswick', seats: 10, winner: 'LIB', mayorName: 'Susan Holt' },
  { name: 'Newfoundland and Labrador', seats: 7, winner: 'LIB', mayorName: 'Andrew Furey' },
  { name: 'Prince Edward Island', seats: 4, winner: 'LIB', mayorName: 'Dennis King' }
];

const ARGENTINA_SPEC = [
  { name: 'Buenos Aires', seats: 70, winner: 'UP', mayorName: 'Axel Kicillof' },
  { name: 'Córdoba', seats: 18, winner: 'LLA', mayorName: 'Martín Llaryora' },
  { name: 'Santa Fe', seats: 19, winner: 'LLA', mayorName: 'Maximiliano Pullaro' },
  { name: 'Mendoza', seats: 10, winner: 'JXC', mayorName: 'Alfredo Cornejo' },
  { name: 'Tucumán', seats: 9, winner: 'UP', mayorName: 'Osvaldo Jaldo' },
  { name: 'Entre Ríos', seats: 9, winner: 'JXC', mayorName: 'Rogelio Frigerio' },
  { name: 'Salta', seats: 7, winner: 'LLA', mayorName: 'Gustavo Sáenz' },
  { name: 'Misiones', seats: 7, winner: 'UP', mayorName: 'Hugo Passalacqua' },
  { name: 'Chaco', seats: 7, winner: 'UP', mayorName: 'Leandro Zdero' },
  { name: 'Corrientes', seats: 7, winner: 'JXC', mayorName: 'Gustavo Valdés' },
  { name: 'Santiago del Estero', seats: 7, winner: 'UP', mayorName: 'Gerardo Zamora' },
  { name: 'Jujuy', seats: 6, winner: 'JXC', mayorName: 'Carlos Sadir' },
  { name: 'Formosa', seats: 5, winner: 'UP', mayorName: 'Gildo Insfrán' },
  { name: 'Catamarca', seats: 5, winner: 'UP', mayorName: 'Raúl Jalil' },
  { name: 'La Pampa', seats: 5, winner: 'UP', mayorName: 'Sergio Ziliotto' },
  { name: 'La Rioja', seats: 5, winner: 'UP', mayorName: 'Ricardo Quintela' },
  { name: 'San Juan', seats: 6, winner: 'JXC', mayorName: 'Marcelo Orrego' },
  { name: 'San Luis', seats: 5, winner: 'JXC', mayorName: 'Claudio Poggi' },
  { name: 'Neuquén', seats: 5, winner: 'LLA', mayorName: 'Rolando Figueroa' },
  { name: 'Río Negro', seats: 5, winner: 'LLA', mayorName: 'Alberto Weretilneck' },
  { name: 'Chubut', seats: 5, winner: 'JXC', mayorName: 'Ignacio Torres' },
  { name: 'Santa Cruz', seats: 5, winner: 'UP', mayorName: 'Claudio Vidal' },
  { name: 'Tierra del Fuego', seats: 3, winner: 'UP', mayorName: 'Gustavo Melella' },
  { name: 'Capital Federal', seats: 25, winner: 'JXC', mayorName: 'Jorge Macri' }
];

const SOUTH_AFRICA_SPEC = [
  { name: 'Gauteng', seats: 73, winner: 'ANC', mayorName: 'Panyaza Lesufi' },
  { name: 'KwaZulu-Natal', seats: 41, winner: 'MK', mayorName: 'Thami Ntuli' },
  { name: 'Western Cape', seats: 30, winner: 'DA', mayorName: 'Alan Winde' },
  { name: 'Eastern Cape', seats: 25, winner: 'ANC', mayorName: 'Oscar Mabuyane' },
  { name: 'Limpopo', seats: 19, winner: 'ANC', mayorName: 'Phophi Ramathuba' },
  { name: 'Mpumalanga', seats: 15, winner: 'ANC', mayorName: 'Mandla Ndlovu' },
  { name: 'North West', seats: 13, winner: 'ANC', mayorName: 'Lazarus Mokgosi' },
  { name: 'Free State', seats: 10, winner: 'ANC', mayorName: 'Maqueen Letsoha-Mathae' },
  { name: 'Northern Cape', seats: 5, winner: 'ANC', mayorName: 'Zamani Saul' }
];

const INDIA_SPEC = [
  { name: 'Uttar Pradesh', seats: 80, winner: 'BJP', mayorName: 'Yogi Adityanath' },
  { name: 'Maharashtra', seats: 48, winner: 'INC', mayorName: 'Eknath Shinde' },
  { name: 'West Bengal', seats: 42, winner: 'TMC', mayorName: 'Mamata Banerjee' },
  { name: 'Bihar', seats: 40, winner: 'BJP', mayorName: 'Nitish Kumar' },
  { name: 'Tamil Nadu', seats: 39, winner: 'INC', mayorName: 'M. K. Stalin' },
  { name: 'Madhya Pradesh', seats: 29, winner: 'BJP', mayorName: 'Mohan Yadav' },
  { name: 'Karnataka', seats: 28, winner: 'INC', mayorName: 'Siddaramaiah' },
  { name: 'Gujarat', seats: 26, winner: 'BJP', mayorName: 'Bhupendrabhai Patel' },
  { name: 'Andhra Pradesh', seats: 25, winner: 'BJP', mayorName: 'N. Chandrababu Naidu' },
  { name: 'Rajasthan', seats: 25, winner: 'BJP', mayorName: 'Bhajan Lal Sharma' },
  { name: 'Odisha', seats: 21, winner: 'BJP', mayorName: 'Mohan Charan Majhi' },
  { name: 'Kerala', seats: 20, winner: 'INC', mayorName: 'Pinarayi Vijayan' },
  { name: 'Telangana', seats: 17, winner: 'INC', mayorName: 'A. Revanth Reddy' },
  { name: 'Assam', seats: 14, winner: 'BJP', mayorName: 'Himanta Biswa Sarma' },
  { name: 'Jharkhand', seats: 14, winner: 'BJP', mayorName: 'Hemant Soren' },
  { name: 'Punjab', seats: 13, winner: 'INC', mayorName: 'Bhagwant Mann' },
  { name: 'Chhattisgarh', seats: 11, winner: 'BJP', mayorName: 'Vishnu Deo Sai' },
  { name: 'Haryana', seats: 10, winner: 'BJP', mayorName: 'Nayab Singh Saini' },
  { name: 'Jammu and Kashmir', seats: 5, winner: 'INC', mayorName: 'Omar Abdullah' },
  { name: 'Uttarakhand', seats: 5, winner: 'BJP', mayorName: 'Pushkar Singh Dhami' },
  { name: 'Himachal Pradesh', seats: 4, winner: 'BJP', mayorName: 'Sukhvinder Singh Sukhu' },
  { name: 'Tripura', seats: 2, winner: 'BJP', mayorName: 'Manik Saha' },
  { name: 'Manipur', seats: 2, winner: 'INC', mayorName: 'N. Biren Singh' },
  { name: 'Meghalaya', seats: 2, winner: 'INC', mayorName: 'Conrad Sangma' },
  { name: 'Nagaland', seats: 1, winner: 'INC', mayorName: 'Neiphiu Rio' },
  { name: 'Goa', seats: 2, winner: 'BJP', mayorName: 'Pramod Sawant' },
  { name: 'Arunachal Pradesh', seats: 2, winner: 'BJP', mayorName: 'Pema Khandu' },
  { name: 'Mizoram', seats: 1, winner: 'INC', mayorName: 'Lalduhoma' },
  { name: 'Sikkim', seats: 1, winner: 'BJP', mayorName: 'Prem Singh Tamang' },
  { name: 'Delhi', seats: 7, winner: 'BJP', mayorName: 'Atishi Marlena' }
];

const ITALY_SPEC = [
  { name: 'Lombardy', seats: 64, winner: 'FDI', mayorName: 'Attilio Fontana' },
  { name: 'Lazio', seats: 36, winner: 'FDI', mayorName: 'Francesco Rocca' },
  { name: 'Campania', seats: 29, winner: 'M5S', mayorName: 'Vincenzo De Luca' },
  { name: 'Sicily', seats: 28, winner: 'FDI', mayorName: 'Renato Schifani' },
  { name: 'Veneto', seats: 27, winner: 'LEGA', mayorName: 'Luca Zaia' },
  { name: 'Emilia-Romagna', seats: 24, winner: 'PD', mayorName: 'Michele De Pascale' },
  { name: 'Piedmont', seats: 22, winner: 'FDI', mayorName: 'Alberto Cirio' },
  { name: 'Apulia', seats: 20, winner: 'M5S', mayorName: 'Michele Emiliano' },
  { name: 'Tuscany', seats: 18, winner: 'PD', mayorName: 'Eugenio Giani' },
  { name: 'Calabria', seats: 10, winner: 'FDI', mayorName: 'Roberto Occhiuto' }
];

const INDONESIA_SPEC = [
  { name: 'West Java', seats: 91, winner: 'GERINDRA', mayorName: 'Ridwan Kamil' },
  { name: 'East Java', seats: 87, winner: 'PKB', mayorName: 'Khofifah Indar Parawansa' },
  { name: 'Central Java', seats: 77, winner: 'PDIP', mayorName: 'Ganjar Pranowo' },
  { name: 'North Sumatra', seats: 30, winner: 'GOLKAR', mayorName: 'Edy Rahmayadi' },
  { name: 'Banten', seats: 22, winner: 'GERINDRA', mayorName: 'Al Muktabar' },
  { name: 'Jakarta', seats: 21, winner: 'PDIP', mayorName: 'Anies Baswedan' },
  { name: 'South Sulawesi', seats: 24, winner: 'GOLKAR', mayorName: 'Andi Sudirman Sulaiman' },
  { name: 'Lampung', seats: 20, winner: 'GOLKAR', mayorName: 'Arinal Djunaidi' },
  { name: 'South Sumatra', seats: 17, winner: 'GERINDRA', mayorName: 'Herman Deru' },
  { name: 'Riau', seats: 13, winner: 'GOLKAR', mayorName: 'Syamsuar' }
];

const MEXICO_SPEC = [
  { name: 'State of Mexico', seats: 40, winner: 'MORENA', mayorName: 'Delfina Gómez Álvarez' },
  { name: 'Mexico City', seats: 30, winner: 'MORENA', mayorName: 'Clara Brugada' },
  { name: 'Jalisco', seats: 19, winner: 'PAN', mayorName: 'Enrique Alfaro Ramírez' },
  { name: 'Veracruz', seats: 19, winner: 'MORENA', mayorName: 'Rocío Nahle García' },
  { name: 'Puebla', seats: 15, winner: 'MORENA', mayorName: 'Alejandro Armenta Mier' },
  { name: 'Guanajuato', seats: 14, winner: 'PAN', mayorName: 'Libia Dennise García' },
  { name: 'Nuevo León', seats: 12, winner: 'PAN', mayorName: 'Samuel García' },
  { name: 'Chiapas', seats: 12, winner: 'MORENA', mayorName: 'Eduardo Ramírez Aguilar' },
  { name: 'Michoacán', seats: 11, winner: 'MORENA', mayorName: 'Alfredo Ramírez Bedolla' },
  { name: 'Oaxaca', seats: 10, winner: 'MORENA', mayorName: 'Salomón Jara Cruz' },
  { name: 'Chihuahua', seats: 9, winner: 'PAN', mayorName: 'Maru Campos' },
  { name: 'Guerrero', seats: 9, winner: 'MORENA', mayorName: 'Evelyn Salgado Pineda' },
  { name: 'Tamaulipas', seats: 8, winner: 'MORENA', mayorName: 'Américo Villarreal Anaya' },
  { name: 'Baja California', seats: 8, winner: 'MORENA', mayorName: 'Marina del Pilar Ávila' },
  { name: 'Sinaloa', seats: 7, winner: 'MORENA', mayorName: 'Rubén Rocha Moya' },
  { name: 'San Luis Potosí', seats: 7, winner: 'MORENA', mayorName: 'Ricardo Gallardo Cardona' },
  { name: 'Tabasco', seats: 6, winner: 'MORENA', mayorName: 'Javier May Rodríguez' },
  { name: 'Sonora', seats: 7, winner: 'MORENA', mayorName: 'Alfonso Durazo' },
  { name: 'Hidalgo', seats: 7, winner: 'MORENA', mayorName: 'Julio Menchaca' },
  { name: 'Coahuila', seats: 7, winner: 'PRI', mayorName: 'Manolo Jiménez Salinas' },
  { name: 'Querétaro', seats: 5, winner: 'PAN', mayorName: 'Mauricio Kuri' },
  { name: 'Yucatán', seats: 5, winner: 'MORENA', mayorName: 'Joaquín Díaz Mena' },
  { name: 'Durango', seats: 4, winner: 'PRI', mayorName: 'Esteban Villegas' },
  { name: 'Zacatecas', seats: 4, winner: 'MORENA', mayorName: 'David Monreal Ávila' },
  { name: 'Quintana Roo', seats: 4, winner: 'MORENA', mayorName: 'Mara Lezama Espinosa' },
  { name: 'Nayarit', seats: 3, winner: 'MORENA', mayorName: 'Miguel Ángel Navarro' },
  { name: 'Tlaxcala', seats: 3, winner: 'MORENA', mayorName: 'Lorena Cuéllar' },
  { name: 'Campeche', seats: 2, winner: 'MORENA', mayorName: 'Layda Sansores' },
  { name: 'Aguascalientes', seats: 3, winner: 'PAN', mayorName: 'Tere Jiménez Esquivel' },
  { name: 'Baja California Sur', seats: 2, winner: 'MORENA', mayorName: 'Víctor Manuel Castro' },
  { name: 'Colima', seats: 2, winner: 'MORENA', mayorName: 'Indira Vizcaíno' }
];

const SPAIN_SPEC = [
  { name: 'Andalusia', seats: 61, winner: 'PP', mayorName: 'Juan Manuel Moreno' },
  { name: 'Catalonia', seats: 48, winner: 'PSOE', mayorName: 'Salvador Illa' },
  { name: 'Madrid', seats: 37, winner: 'PP', mayorName: 'Isabel Díaz Ayuso' },
  { name: 'Valencia', seats: 33, winner: 'PP', mayorName: 'Carlos Mazón' },
  { name: 'Galicia', seats: 23, winner: 'PP', mayorName: 'Alfonso Rueda' },
  { name: 'Castile and León', seats: 31, winner: 'PP', mayorName: 'Alfonso Fernández Mañueco' },
  { name: 'Basque Country', seats: 18, winner: 'PSOE', mayorName: 'Imanol Pradales' },
  { name: 'Canary Islands', seats: 15, winner: 'PSOE', mayorName: 'Fernando Clavijo Batlle' },
  { name: 'Castile-La Mancha', seats: 21, winner: 'PP', mayorName: 'Emiliano García-Page' },
  { name: 'Murcia', seats: 10, winner: 'PP', mayorName: 'Fernando López Miras' }
];

const SOUTH_KOREA_SPEC = [
  { name: 'Seoul', seats: 48, winner: 'DP', mayorName: 'Oh Se-hoon' },
  { name: 'Gyeonggi', seats: 60, winner: 'DP', mayorName: 'Kim Dong-yeon' },
  { name: 'Busan', seats: 18, winner: 'PPP', mayorName: 'Park Heong-joon' },
  { name: 'Incheon', seats: 14, winner: 'DP', mayorName: 'Yoo Jeong-bok' },
  { name: 'Daegu', seats: 12, winner: 'PPP', mayorName: 'Hong Joon-pyo' },
  { name: 'Gyeongnam', seats: 16, winner: 'PPP', mayorName: 'Park Wan-su' },
  { name: 'Gyeongbuk', seats: 13, winner: 'PPP', mayorName: 'Lee Cheol-woo' },
  { name: 'Chungnam', seats: 11, winner: 'DP', mayorName: 'Kim Tae-heum' },
  { name: 'Jeonnam', seats: 10, winner: 'DP', mayorName: 'Kim Yung-rok' },
  { name: 'Jeonbuk', seats: 10, winner: 'DP', mayorName: 'Kim Kwan-young' }
];

const AUSTRALIA_SPEC = [
  { name: 'New South Wales', seats: 47, winner: 'ALP', mayorName: 'Chris Minns' },
  { name: 'Victoria', seats: 39, winner: 'ALP', mayorName: 'Jacinta Allan' },
  { name: 'Queensland', seats: 30, winner: 'LNP', mayorName: 'Steven Miles' },
  { name: 'Western Australia', seats: 15, winner: 'LNP', mayorName: 'Roger Cook' },
  { name: 'South Australia', seats: 10, winner: 'ALP', mayorName: 'Peter Malinauskas' },
  { name: 'Tasmania', seats: 5, winner: 'LNP', mayorName: 'Jeremy Rockliff' },
  { name: 'Australian Capital Territory', seats: 3, winner: 'ALP', mayorName: 'Andrew Barr' },
  { name: 'Northern Territory', seats: 2, winner: 'ALP', mayorName: 'Lia Finocchiaro' }
];

export const getCanadaRegions = () => generateRegionsFromSpec('CA', CANADA_SPEC, ['LIB', 'CON', 'NDP', 'BQ'], { LIB: 32, CON: 38, NDP: 18, BQ: 8 });
export const getArgentinaRegions = () => generateRegionsFromSpec('AR', ARGENTINA_SPEC, ['LLA', 'UP', 'JXC'], { LLA: 30, UP: 36, JXC: 24 });
export const getSouthAfricaRegions = () => generateRegionsFromSpec('ZA', SOUTH_AFRICA_SPEC, ['ANC', 'DA', 'EFF', 'MK'], { ANC: 40, DA: 21, EFF: 10, MK: 14 });
export const getIndiaRegions = () => generateRegionsFromSpec('IN', INDIA_SPEC, ['BJP', 'INC', 'TMC'], { BJP: 40, INC: 25, TMC: 5 });
export const getItalyRegions = () => generateRegionsFromSpec('IT', ITALY_SPEC, ['FDI', 'PD', 'M5S', 'LEGA'], { FDI: 28, PD: 20, M5S: 16, LEGA: 9 });
export const getIndonesiaRegions = () => generateRegionsFromSpec('ID', INDONESIA_SPEC, ['PDIP', 'GOLKAR', 'GERINDRA', 'PKB'], { PDIP: 17, GOLKAR: 15, GERINDRA: 13, PKB: 10 });
export const getMexicoRegions = () => generateRegionsFromSpec('MX', MEXICO_SPEC, ['MORENA', 'PAN', 'PRI'], { MORENA: 45, PAN: 18, PRI: 11 });
export const getSpainRegions = () => generateRegionsFromSpec('ES', SPAIN_SPEC, ['PP', 'PSOE', 'VOX', 'SUMAR'], { PP: 33, PSOE: 31, VOX: 12, SUMAR: 12 });
export const getSouthKoreaRegions = () => generateRegionsFromSpec('KR', SOUTH_KOREA_SPEC, ['DP', 'PPP'], { DP: 50, PPP: 35 });
export const getAustraliaRegions = () => generateRegionsFromSpec('AU', AUSTRALIA_SPEC, ['ALP', 'LNP', 'GRN'], { ALP: 32, LNP: 35, GRN: 12 });

// Mock Bills for countries
const BILL_POOL = [
  {
    title: 'Early Retirement & Social Security Act',
    description: 'Provides early retirement options and increases minimum welfare benefits for workers and low-income citizens.',
    category: 'Economy',
    budgetCost: 450000,
    influenceMod: 15,
    voterImpacts: { 'Workers': 8, 'Youth': 2, 'Shopkeepers': -4, 'Liberals': -5, 'Nationalists': 2, 'Traditionalists': 4 }
  },
  {
    title: 'Digital Freedoms & Social Media Law',
    description: 'Enhances data privacy and removes internet restrictions, ensuring freedom of speech online.',
    category: 'Freedoms',
    budgetCost: 50000,
    influenceMod: 25,
    voterImpacts: { 'Workers': 1, 'Youth': 12, 'Shopkeepers': 2, 'Liberals': 10, 'Nationalists': -4, 'Traditionalists': -8 }
  },
  {
    title: 'National Defense Industry Incentive Package',
    description: 'Increases defense spending by 25% to support domestic military and security technologies.',
    category: 'Security',
    budgetCost: 750000,
    influenceMod: 30,
    voterImpacts: { 'Workers': 4, 'Youth': -2, 'Shopkeepers': 2, 'Liberals': -6, 'Nationalists': 15, 'Traditionalists': 8 }
  },
  {
    title: 'Green Energy Transition Plan',
    description: 'Subsidizes renewable energy projects and heavily taxes carbon emissions for industrial companies.',
    category: 'Environment',
    budgetCost: 300000,
    influenceMod: 18,
    voterImpacts: { 'Workers': -3, 'Youth': 10, 'Shopkeepers': -5, 'Liberals': 8, 'Nationalists': -2, 'Traditionalists': -4 }
  },
  {
    title: 'Small Business Tax Relief Bill',
    description: 'Reduces corporate taxes for small and medium-sized enterprises to stimulate local economies.',
    category: 'Economy',
    budgetCost: 250000,
    influenceMod: 20,
    voterImpacts: { 'Workers': 2, 'Youth': 3, 'Shopkeepers': 15, 'Liberals': 6, 'Nationalists': 2, 'Traditionalists': 5 }
  },
  {
    title: 'Comprehensive Education Reform',
    description: 'Increases funding for public schools, raises teacher salaries, and modernizes the national curriculum.',
    category: 'Education',
    budgetCost: 600000,
    influenceMod: 22,
    voterImpacts: { 'Workers': 6, 'Youth': 14, 'Shopkeepers': 4, 'Liberals': 8, 'Nationalists': 5, 'Traditionalists': -2 }
  },
  {
    title: 'Universal Healthcare Expansion',
    description: 'Expands free public healthcare coverage to all citizens, including dental and mental health services.',
    category: 'Healthcare',
    budgetCost: 850000,
    influenceMod: 28,
    voterImpacts: { 'Workers': 12, 'Youth': 5, 'Shopkeepers': 6, 'Liberals': -4, 'Nationalists': 3, 'Traditionalists': 7 }
  },
  {
    title: 'Strict Immigration Control Act',
    description: 'Implements rigorous border controls and reduces annual immigration quotas significantly.',
    category: 'Security',
    budgetCost: 150000,
    influenceMod: 35,
    voterImpacts: { 'Workers': 5, 'Youth': -8, 'Shopkeepers': 4, 'Liberals': -12, 'Nationalists': 18, 'Traditionalists': 10 }
  },
  {
    title: 'Urban Housing Development Initiative',
    description: 'Invests in affordable housing projects in major cities to combat the rising cost of living.',
    category: 'Infrastructure',
    budgetCost: 550000,
    influenceMod: 16,
    voterImpacts: { 'Workers': 10, 'Youth': 8, 'Shopkeepers': 5, 'Liberals': 2, 'Nationalists': 0, 'Traditionalists': 2 }
  },
  {
    title: 'Free Trade Agreement Ratification',
    description: 'Removes tariffs and trade barriers with allied nations to boost international commerce.',
    category: 'Economy',
    budgetCost: 0,
    influenceMod: 12,
    voterImpacts: { 'Workers': -6, 'Youth': 4, 'Shopkeepers': -2, 'Liberals': 15, 'Nationalists': -8, 'Traditionalists': -5 }
  },
  {
    title: 'Clean Water & Forest Protection Act',
    description: 'Aimed at securing water basins and introducing severe penalties for industries causing water pollution.',
    category: 'Environment',
    budgetCost: 180000,
    influenceMod: 10,
    voterImpacts: { 'Workers': 2, 'Youth': 10, 'Shopkeepers': -2, 'Liberals': 5, 'Nationalists': 4, 'Traditionalists': 2 }
  },
  {
    title: 'AI and High-Tech Incentive Law',
    description: 'Provides grants and tax breaks to domestic entrepreneurs developing software, AI, and microchips.',
    category: 'Technology',
    budgetCost: 350000,
    influenceMod: 20,
    voterImpacts: { 'Workers': 0, 'Youth': 15, 'Shopkeepers': 4, 'Liberals': 12, 'Nationalists': 5, 'Traditionalists': -4 }
  }
];

const createBills = (countryId: string): Bill[] => {
  // Shuffle the pool and pick a random subset of bills
  const shuffled = [...BILL_POOL].sort(() => 0.5 - Math.random());
  const selectedCount = Math.min(8, shuffled.length);
  const selected = shuffled.slice(0, selectedCount);
  
  return selected.map((bill, index) => ({
    id: `${countryId}_bill_${index + 1}`,
    title: bill.title,
    description: bill.description,
    category: bill.category as any,
    status: 'Pending',
    budgetCost: bill.budgetCost,
    influenceMod: bill.influenceMod,
    yesVotesPercentage: 0,
    voterImpacts: bill.voterImpacts as any
  }));
};

export const PLAYABLE_COUNTRIES: Country[] = [

  {
    id: 'CA',
    name: 'Canada',
    description: 'A vast, diverse nation with a strong federal system and distinct provincial identities.',
    flag: '🇨🇦',
    seats: 338,
    parliamentName: 'House of Commons',
    system: 'Coalition Government',
    population: '40 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'LIB', name: 'Liberal Party', leader: 'Justin Trudeau', ideology: 'Liberal', symbol: 'Compass', color: '#EF4444', baseSupport: 32 },
      { id: 'CON', name: 'Conservative', leader: 'Pierre Poilievre', ideology: 'Conservative', symbol: 'Building', color: '#1D4ED8', baseSupport: 38 },
      { id: 'NDP', name: 'New Democratic', leader: 'Jagmeet Singh', ideology: 'Social Democrat', symbol: 'Users', color: '#F97316', baseSupport: 18 },
      { id: 'BQ', name: 'Bloc Québécois', leader: 'Yves-François Blanchet', ideology: 'Nationalist', symbol: 'Landmark', color: '#38BDF8', baseSupport: 8 }
    ],
    regions: getCanadaRegions(),
    bills: createBills('CA'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'AR',
    name: 'Argentina',
    description: 'A passionate nation experiencing economic challenges and intense political shifts.',
    flag: '🇦🇷',
    seats: 257,
    parliamentName: 'Chamber of Deputies',
    system: 'Presidential System',
    population: '46 Million',
    primaryColor: '#3b82f6',
    rivals: [
      { id: 'LLA', name: 'La Libertad Avanza', leader: 'Javier Milei', ideology: 'Liberal', symbol: 'Flame', color: '#8B5CF6', baseSupport: 30 },
      { id: 'UP', name: 'Unión por la Patria', leader: 'Sergio Massa', ideology: 'Social Democrat', symbol: 'Users', color: '#3B82F6', baseSupport: 36 },
      { id: 'JXC', name: 'Juntos por el Cambio', leader: 'Patricia Bullrich', ideology: 'Conservative', symbol: 'Building', color: '#FCD34D', baseSupport: 24 }
    ],
    regions: getArgentinaRegions(),
    bills: createBills('AR'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'ZA',
    name: 'South Africa',
    description: 'A diverse "Rainbow Nation" navigating complex socioeconomic transformations.',
    flag: '🇿🇦',
    seats: 400,
    parliamentName: 'National Assembly',
    system: 'Coalition Government',
    population: '60 Million',
    primaryColor: '#22c55e',
    rivals: [
      { id: 'ANC', name: 'African National Congress', leader: 'Cyril Ramaphosa', ideology: 'Social Democrat', symbol: 'Users', color: '#16A34A', baseSupport: 40 },
      { id: 'DA', name: 'Democratic Alliance', leader: 'John Steenhuisen', ideology: 'Liberal', symbol: 'Compass', color: '#2563EB', baseSupport: 21 },
      { id: 'EFF', name: 'Economic Freedom Fighters', leader: 'Julius Malema', ideology: 'Socialist', symbol: 'Flame', color: '#DC2626', baseSupport: 10 },
      { id: 'MK', name: 'uMkhonto we Sizwe', leader: 'Jacob Zuma', ideology: 'Nationalist', symbol: 'Shield', color: '#047857', baseSupport: 14 }
    ],
    regions: getSouthAfricaRegions(),
    bills: createBills('ZA'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'IN',
    name: 'India',
    description: 'The world\'s largest democracy, blending ancient traditions with rapid modernization.',
    flag: '🇮🇳',
    seats: 543,
    parliamentName: 'Lok Sabha',
    system: 'Coalition Government',
    population: '1.4 Billion',
    primaryColor: '#f97316',
    rivals: [
      { id: 'BJP', name: 'Bharatiya Janata Party', leader: 'Narendra Modi', ideology: 'Conservative', symbol: 'Building', color: '#F97316', baseSupport: 40 },
      { id: 'INC', name: 'Indian National Congress', leader: 'Rahul Gandhi', ideology: 'Social Democrat', symbol: 'Users', color: '#14B8A6', baseSupport: 25 },
      { id: 'TMC', name: 'All India Trinamool Congress', leader: 'Mamata Banerjee', ideology: 'Liberal', symbol: 'Compass', color: '#22C55E', baseSupport: 5 }
    ],
    regions: getIndiaRegions(),
    bills: createBills('IN'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'IT',
    name: 'Italy',
    description: 'A historic republic with a dynamic and often volatile multi-party political landscape.',
    flag: '🇮🇹',
    seats: 400,
    parliamentName: 'Chamber of Deputies',
    system: 'Coalition Government',
    population: '59 Million',
    primaryColor: '#16a34a',
    rivals: [
      { id: 'FDI', name: 'Brothers of Italy', leader: 'Giorgia Meloni', ideology: 'Conservative', symbol: 'Shield', color: '#1D4ED8', baseSupport: 28 },
      { id: 'PD', name: 'Democratic Party', leader: 'Elly Schlein', ideology: 'Social Democrat', symbol: 'Users', color: '#DC2626', baseSupport: 20 },
      { id: 'M5S', name: 'Five Star Movement', leader: 'Giuseppe Conte', ideology: 'Nationalist', symbol: 'Flame', color: '#EAB308', baseSupport: 16 },
      { id: 'LEGA', name: 'Lega', leader: 'Matteo Salvini', ideology: 'Nationalist', symbol: 'Landmark', color: '#10B981', baseSupport: 9 }
    ],
    regions: getItalyRegions(),
    bills: createBills('IT'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'ID',
    name: 'Indonesia',
    description: 'An expansive archipelagic nation balancing diverse cultures with rapid growth.',
    flag: '🇮🇩',
    seats: 580,
    parliamentName: 'People\'s Representative Council',
    system: 'Presidential System',
    population: '275 Million',
    primaryColor: '#ef4444',
    rivals: [
      { id: 'PDIP', name: 'PDI-P', leader: 'Megawati Sukarnoputri', ideology: 'Nationalist', symbol: 'Landmark', color: '#DC2626', baseSupport: 17 },
      { id: 'GOLKAR', name: 'Golkar', leader: 'Airlangga Hartarto', ideology: 'Conservative', symbol: 'Building', color: '#FACC15', baseSupport: 15 },
      { id: 'GERINDRA', name: 'Gerindra', leader: 'Prabowo Subianto', ideology: 'Nationalist', symbol: 'Shield', color: '#991B1B', baseSupport: 13 },
      { id: 'PKB', name: 'PKB', leader: 'Muhaimin Iskandar', ideology: 'Social Conservative', symbol: 'Users', color: '#15803D', baseSupport: 10 }
    ],
    regions: getIndonesiaRegions(),
    bills: createBills('ID'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'MX',
    name: 'Mexico',
    description: 'A vibrant North American nation with deep historical roots and complex social dynamics.',
    flag: '🇲🇽',
    seats: 500,
    parliamentName: 'Chamber of Deputies',
    system: 'Presidential System',
    population: '128 Million',
    primaryColor: '#059669',
    rivals: [
      { id: 'MORENA', name: 'MORENA', leader: 'Claudia Sheinbaum', ideology: 'Social Democrat', symbol: 'Users', color: '#991B1B', baseSupport: 45 },
      { id: 'PAN', name: 'National Action Party', leader: 'Marko Cortés', ideology: 'Conservative', symbol: 'Building', color: '#1D4ED8', baseSupport: 18 },
      { id: 'PRI', name: 'Institutional Revolutionary', leader: 'Alejandro Moreno', ideology: 'Centrist', symbol: 'Compass', color: '#16A34A', baseSupport: 11 }
    ],
    regions: getMexicoRegions(),
    bills: createBills('MX'),
    campaignTurns: 53,
    electionCycleYears: 6,
  },
  {
    id: 'ES',
    name: 'Spain',
    description: 'A culturally diverse European nation managing strong regional identities and modern progress.',
    flag: '🇪🇸',
    seats: 350,
    parliamentName: 'Congress of Deputies',
    system: 'Coalition Government',
    population: '48 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'PP', name: 'People\'s Party', leader: 'Alberto Núñez Feijóo', ideology: 'Conservative', symbol: 'Building', color: '#2563EB', baseSupport: 33, photo: 'https://avatars.mds.yandex.net/i?id=7cc5bd9e687dfe95d9f02f9ce7bdfd816b510b1a-5783456-images-thumbs&n=13' },
      { id: 'PSOE', name: 'PSOE', leader: 'Pedro Sánchez', ideology: 'Social Democrat', symbol: 'Users', color: '#DC2626', baseSupport: 31, photo: 'https://avatars.mds.yandex.net/i?id=6eefd46c4771ad70535a6b945a5ac13e96bda6c9-13201380-images-thumbs&n=13' },
      { id: 'VOX', name: 'Vox', leader: 'Santiago Abascal', ideology: 'Nationalist', symbol: 'Shield', color: '#16A34A', baseSupport: 12, photo: 'https://avatars.mds.yandex.net/i?id=4640dda215108faaada284a7be422fc295ddf9e7-5268626-images-thumbs&n=13' },
      { id: 'SUMAR', name: 'Sumar', leader: 'Yolanda Díaz', ideology: 'Socialist', symbol: 'Flame', color: '#D946EF', baseSupport: 12, photo: 'https://avatars.mds.yandex.net/i?id=7b92246e643e95f876bdff1c0dbb1a0011ccdbc3-16308086-images-thumbs&n=13' }
    ],
    regions: getSpainRegions(),
    bills: createBills('ES'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'KR',
    name: 'South Korea',
    description: 'A fast-paced, highly developed nation bridging deep traditions and technological dominance.',
    flag: '🇰🇷',
    seats: 300,
    parliamentName: 'National Assembly',
    system: 'Presidential System',
    population: '51 Million',
    primaryColor: '#2563eb',
    rivals: [
      { id: 'DP', name: 'Democratic Party', leader: 'Lee Jae-myung', ideology: 'Liberal', symbol: 'Compass', color: '#1D4ED8', baseSupport: 50, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Jung_Chung-rae%27s_Portrait_%282026.6%29.png/250px-Jung_Chung-rae%27s_Portrait_%282026.6%29.png' },
      { id: 'PPP', name: 'People Power Party', leader: 'Han Dong-hoon', ideology: 'Conservative', symbol: 'Building', color: '#EF4444', baseSupport: 35, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Jang_Dong-hyeok%27s_Portrait_%282026.5%29.png/250px-Jang_Dong-hyeok%27s_Portrait_%282026.5%29.png' }
    ],
    regions: getSouthKoreaRegions(),
    bills: createBills('KR'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'AU',
    name: 'Australia',
    description: 'A prosperous, resilient nation encompassing an entire continent.',
    flag: '🇦🇺',
    seats: 151,
    parliamentName: 'House of Representatives',
    system: 'Coalition Government',
    population: '26 Million',
    primaryColor: '#0369a1',
    rivals: [
      { id: 'ALP', name: 'Labor Party', leader: 'Anthony Albanese', ideology: 'Social Democrat', symbol: 'Users', color: '#DC2626', baseSupport: 32 },
      { id: 'LNP', name: 'Liberal/National', leader: 'Peter Dutton', ideology: 'Conservative', symbol: 'Building', color: '#1D4ED8', baseSupport: 35 },
      { id: 'GRN', name: 'The Greens', leader: 'Adam Bandt', ideology: 'Ecologist', symbol: 'Flame', color: '#16A34A', baseSupport: 12 }
    ],
    regions: getAustraliaRegions(),
    bills: createBills('AU'),
    campaignTurns: 53,
    electionCycleYears: 3,
  }
,
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
      { id: 'PT', name: 'Workers\' Party (PT)', leader: 'Lula da Silva', ideology: 'Social Democrat', symbol: 'Star', color: '#c21807', baseSupport: 29, photo: 'https://th.bing.com/th/id/OIP.x2yptB1cDjH36fVRRH3VzwHaEb?w=300&h=180&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'PL', name: 'Liberal Party (PL)', leader: 'Jair Bolsonaro', ideology: 'Far Right', symbol: 'Shield', color: '#22409A', baseSupport: 30, photo: 'https://www.bing.com/th/id/OIP.2sLRomhOdVMhC3km9TgeTgHaHa?w=180&h=180&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2' },
      { id: 'UNIAO', name: 'União Brasil', leader: 'Antonio Rueda', ideology: 'Conservative', symbol: 'Users', color: '#0052A5', baseSupport: 15, photo: 'https://th.bing.com/th/id/OIP.hRVKfsEj_QqEJmXSZu-drAHaEy?w=252&h=180&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'MDB', name: 'MDB', leader: 'Baleia Rossi', ideology: 'Centrist', symbol: 'Compass', color: '#00A859', baseSupport: 11, photo: 'https://th.bing.com/th/id/OIP._qa1PZ2MmFr5pOlCUImQ3gHaE2?w=271&h=180&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'PSD', name: 'PSD', leader: 'Gilberto Kassab', ideology: 'Centrist', symbol: 'Globe', color: '#FFA500', baseSupport: 10, photo: 'https://th.bing.com/th/id/OIP.EwUpQAPDpFISnZancWJpBwHaE8?w=273&h=182&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'PP', name: 'Progressistas', leader: 'Ciro Nogueira', ideology: 'Conservative', symbol: 'Landmark', color: '#0057A0', baseSupport: 5, photo: 'https://th.bing.com/th/id/OIP._3KxON20q7QIRaCUhbqqKAHaE8?w=277&h=185&c=7&r=0&o=7&pid=1.7&rm=3' }
    ],
    regions: [
      { id: 'Acre', name: 'Acre', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":0.4,"PL":83.2,"UNIAO":0.9,"MDB":5.8,"PSD":1.7,"PP":8}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Alagoas', name: 'Alagoas', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":78.9,"PL":5.4,"UNIAO":7.4,"MDB":1.7,"PSD":3.9,"PP":2.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Amapá', name: 'Amapá', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":2,"PL":78.6,"UNIAO":6.6,"MDB":0.3,"PSD":7.2,"PP":5.2}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Amazonas', name: 'Amazonas', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":81.1,"PL":5.7,"UNIAO":0.1,"MDB":5,"PSD":7.4,"PP":0.8}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Bahia', name: 'Bahia', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":74.8,"PL":6.4,"UNIAO":1.4,"MDB":6,"PSD":4.7,"PP":6.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Ceará', name: 'Ceará', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":76.5,"PL":6.1,"UNIAO":1.8,"MDB":8,"PSD":2.3,"PP":5.3}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Distrito Federal', name: 'Distrito Federal', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":5.7,"PL":76,"UNIAO":6.4,"MDB":3.4,"PSD":0.5,"PP":7.9}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Espírito Santo', name: 'Espírito Santo', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":39.3,"PL":19.3,"UNIAO":18.9,"MDB":3.6,"PSD":16.9,"PP":2}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Goiás', name: 'Goiás', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":0.2,"PL":83.2,"UNIAO":5.5,"MDB":2.2,"PSD":8.5,"PP":0.4}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Maranhão', name: 'Maranhão', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":86.1,"PL":0.9,"UNIAO":2.3,"MDB":4.5,"PSD":3.3,"PP":3}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Mato Grosso', name: 'Mato Grosso', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":5.8,"PL":72.8,"UNIAO":6.5,"MDB":7,"PSD":4.9,"PP":3}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Mato Grosso do Sul', name: 'Mato Grosso do Sul', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":2.5,"PL":80.2,"UNIAO":3.9,"MDB":1.8,"PSD":7.1,"PP":4.5}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Minas Gerais', name: 'Minas Gerais', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":30.6,"PL":15.9,"UNIAO":8.5,"MDB":16.3,"PSD":17.5,"PP":11.1}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Pará', name: 'Pará', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":1,"PL":83,"UNIAO":3.8,"MDB":0.9,"PSD":4.2,"PP":7.1}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Paraíba', name: 'Paraíba', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":76.9,"PL":6.4,"UNIAO":0,"MDB":5.7,"PSD":4.3,"PP":6.6}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Paraná', name: 'Paraná', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":1.9,"PL":87.5,"UNIAO":0.6,"MDB":6.3,"PSD":1.3,"PP":2.5}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Pernambuco', name: 'Pernambuco', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":86.1,"PL":4.3,"UNIAO":0.5,"MDB":4.8,"PSD":3.8,"PP":0.5}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Piauí', name: 'Piauí', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":73.9,"PL":7.2,"UNIAO":3.4,"MDB":7.4,"PSD":3.9,"PP":4.1}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Rio de Janeiro', name: 'Rio de Janeiro', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":36.6,"PL":5.8,"UNIAO":4.1,"MDB":21.8,"PSD":17.6,"PP":14.1}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Rio Grande do Norte', name: 'Rio Grande do Norte', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":85.2,"PL":5.6,"UNIAO":0,"MDB":1.5,"PSD":0.6,"PP":7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Rio Grande do Sul', name: 'Rio Grande do Sul', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":48.5,"PL":3.8,"UNIAO":18.4,"MDB":14.7,"PSD":10,"PP":4.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Rondônia', name: 'Rondônia', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":4,"PL":86.2,"UNIAO":1.6,"MDB":1.7,"PSD":1.5,"PP":5.1}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Roraima', name: 'Roraima', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":5.9,"PL":83.2,"UNIAO":2.3,"MDB":3.2,"PSD":4.6,"PP":0.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'Santa Catarina', name: 'Santa Catarina', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":7.9,"PL":81.9,"UNIAO":3.8,"MDB":1.3,"PSD":0.7,"PP":4.4}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' },
      { id: 'São Paulo', name: 'São Paulo', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":34.4,"PL":19.3,"UNIAO":19.4,"MDB":18.9,"PSD":3.5,"PP":4.5}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Sergipe', name: 'Sergipe', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":75.1,"PL":7.7,"UNIAO":4,"MDB":6.2,"PSD":2.7,"PP":4.3}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PT' },
      { id: 'Tocantins', name: 'Tocantins', seats: 15, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"PT":1.5,"PL":76.2,"UNIAO":7.3,"MDB":0.8,"PSD":7.2,"PP":6.9}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'PL' }
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
      { id: 'LDP', name: 'LDP', leader: 'Shigeru Ishiba', ideology: 'Conservative', symbol: 'Building', color: '#52B848', baseSupport: 26, photo: 'https://th.bing.com/th/id/OIP.aG6EjA34Q-xI3FgZQPkrDQHaE8?w=278&h=185&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'CDP', name: 'CDP', leader: 'Yoshihiko Noda', ideology: 'Social Democrat', symbol: 'Users', color: '#004098', baseSupport: 21, photo: 'https://th.bing.com/th/id/OIP.vzuIBz2UaUE26Z3U5OlvqwHaJ4?w=150&h=200&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'KOMEITO', name: 'KOMEITO', leader: 'Keiichi Ishii', ideology: 'Social Conservative', symbol: 'Sun', color: '#EB6EA5', baseSupport: 10, photo: 'https://th.bing.com/th/id/OIP.326mM8yNsnZex5CVpO7oPwHaFr?w=210&h=180&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'ISHIN', name: 'ISHIN', leader: 'Nobuyuki Baba', ideology: 'Nationalist', symbol: 'Shield', color: '#B6D300', baseSupport: 9, photo: 'https://th.bing.com/th/id/OIP.mUTZIzPxyV40k6XOoiwwCwHaE8?w=264&h=180&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'DPFP', name: 'DPFP', leader: 'Yuichiro Tamaki', ideology: 'Centrist', symbol: 'Bird', color: '#F6B132', baseSupport: 7, photo: 'https://th.bing.com/th/id/OIP.qTp0c0jdUr7oqIqSSZyQ-gHaE7?w=239&h=187&c=7&r=0&o=7&pid=1.7&rm=3' },
      { id: 'JCP', name: 'JCP', leader: 'Tomoko Tamura', ideology: 'Communist', symbol: 'Star', color: '#DB001C', baseSupport: 6, photo: 'https://th.bing.com/th/id/OIP._SMDrNs9CjSBMW5Fl3-PbgHaF3?w=219&h=180&c=7&r=0&o=7&pid=1.7&rm=3' }
    ],
    regions: [
      { id: 'Aichi', name: 'Aichi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":82.4,"CDP":1.5,"KOMEITO":1.7,"ISHIN":6.1,"DPFP":3.3,"JCP":4.9}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Akita', name: 'Akita', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":77.5,"CDP":5.2,"KOMEITO":2.3,"ISHIN":7.2,"DPFP":5.4,"JCP":2.4}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Aomori', name: 'Aomori', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":82.2,"CDP":0.2,"KOMEITO":5,"ISHIN":4,"DPFP":2.9,"JCP":5.7}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Chiba', name: 'Chiba', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":83.3,"CDP":2,"KOMEITO":2.6,"ISHIN":7.3,"DPFP":3.1,"JCP":1.8}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Ehime', name: 'Ehime', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":82.5,"CDP":2.9,"KOMEITO":6.2,"ISHIN":5.4,"DPFP":1.3,"JCP":1.7}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Fukui', name: 'Fukui', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":84.3,"CDP":5.5,"KOMEITO":3.8,"ISHIN":2.9,"DPFP":3.3,"JCP":0.2}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Fukuoka', name: 'Fukuoka', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":84,"CDP":3.8,"KOMEITO":3.5,"ISHIN":3.1,"DPFP":2.1,"JCP":3.4}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Fukushima', name: 'Fukushima', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":83.6,"CDP":4.6,"KOMEITO":1.5,"ISHIN":3.4,"DPFP":6.1,"JCP":0.8}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Gifu', name: 'Gifu', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":70.7,"CDP":6.3,"KOMEITO":4.7,"ISHIN":6.2,"DPFP":5.9,"JCP":6.2}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Gunma', name: 'Gunma', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":78.4,"CDP":6.4,"KOMEITO":6,"ISHIN":4.2,"DPFP":0.2,"JCP":4.8}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Hiroshima', name: 'Hiroshima', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":74.7,"CDP":6.5,"KOMEITO":6.6,"ISHIN":3.3,"DPFP":4,"JCP":4.9}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Hokkaido', name: 'Hokkaido', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":5.3,"CDP":77.6,"KOMEITO":2.9,"ISHIN":2.6,"DPFP":5.9,"JCP":5.8}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'CDP' },
      { id: 'Hyogo', name: 'Hyogo', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":7.1,"CDP":5.3,"KOMEITO":3.3,"ISHIN":75.1,"DPFP":3.4,"JCP":5.9}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'ISHIN' },
      { id: 'Ibaraki', name: 'Ibaraki', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":80.9,"CDP":1.5,"KOMEITO":6.7,"ISHIN":4.4,"DPFP":6,"JCP":0.5}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Ishikawa', name: 'Ishikawa', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":82.2,"CDP":3.6,"KOMEITO":5.7,"ISHIN":0.6,"DPFP":1.3,"JCP":6.6}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Iwate', name: 'Iwate', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":1.4,"CDP":87.6,"KOMEITO":3.8,"ISHIN":1,"DPFP":1.2,"JCP":5.1}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'CDP' },
      { id: 'Kagawa', name: 'Kagawa', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":76.1,"CDP":2.8,"KOMEITO":5.8,"ISHIN":7.6,"DPFP":6.2,"JCP":1.4}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kagoshima', name: 'Kagoshima', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":84,"CDP":0.5,"KOMEITO":5.7,"ISHIN":4.5,"DPFP":2.7,"JCP":2.6}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kanagawa', name: 'Kanagawa', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":79.7,"CDP":3.9,"KOMEITO":3.4,"ISHIN":2.5,"DPFP":4.5,"JCP":6.1}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kochi', name: 'Kochi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":77.1,"CDP":7.2,"KOMEITO":6.3,"ISHIN":3.9,"DPFP":3.6,"JCP":2}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kumamoto', name: 'Kumamoto', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":87,"CDP":2.5,"KOMEITO":1.8,"ISHIN":2,"DPFP":0.5,"JCP":6.3}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Kyoto', name: 'Kyoto', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":81,"CDP":3,"KOMEITO":0.7,"ISHIN":6.5,"DPFP":2,"JCP":6.7}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Mie', name: 'Mie', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":83,"CDP":7.7,"KOMEITO":1.3,"ISHIN":0.5,"DPFP":5,"JCP":2.4}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Miyagi', name: 'Miyagi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":74,"CDP":3.8,"KOMEITO":5.9,"ISHIN":4.4,"DPFP":6.9,"JCP":5.1}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Miyazaki', name: 'Miyazaki', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":84.5,"CDP":2.8,"KOMEITO":5.7,"ISHIN":2.8,"DPFP":1.5,"JCP":2.7}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Nagano', name: 'Nagano', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":6.8,"CDP":84.1,"KOMEITO":1.6,"ISHIN":0.1,"DPFP":0.7,"JCP":6.7}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'CDP' },
      { id: 'Nagasaki', name: 'Nagasaki', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":74.4,"CDP":3.4,"KOMEITO":6.6,"ISHIN":6.7,"DPFP":3.4,"JCP":5.6}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Nara', name: 'Nara', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":82.1,"CDP":0.6,"KOMEITO":0.2,"ISHIN":6,"DPFP":3.4,"JCP":7.7}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Niigata', name: 'Niigata', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":85,"CDP":1,"KOMEITO":1.1,"ISHIN":5.5,"DPFP":5,"JCP":2.4}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Oita', name: 'Oita', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":73.3,"CDP":4.2,"KOMEITO":4.3,"ISHIN":6.1,"DPFP":5.5,"JCP":6.6}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Okayama', name: 'Okayama', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":75.9,"CDP":7.5,"KOMEITO":3,"ISHIN":5.1,"DPFP":2,"JCP":6.5}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Okinawa', name: 'Okinawa', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":5.5,"CDP":78,"KOMEITO":0.9,"ISHIN":7.4,"DPFP":3.1,"JCP":5.1}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'CDP' },
      { id: 'Osaka', name: 'Osaka', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":1.9,"CDP":0.3,"KOMEITO":4.3,"ISHIN":84.8,"DPFP":0.8,"JCP":7.9}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'ISHIN' },
      { id: 'Saga', name: 'Saga', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":85.9,"CDP":1.6,"KOMEITO":2.1,"ISHIN":0.8,"DPFP":1.9,"JCP":7.6}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Saitama', name: 'Saitama', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":78.5,"CDP":3.5,"KOMEITO":7.6,"ISHIN":5.7,"DPFP":2.9,"JCP":1.9}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Shiga', name: 'Shiga', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":78.3,"CDP":4,"KOMEITO":5,"ISHIN":7.6,"DPFP":1.6,"JCP":3.4}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Shimane', name: 'Shimane', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":79.6,"CDP":1.1,"KOMEITO":6.7,"ISHIN":3.1,"DPFP":3.7,"JCP":5.8}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Shizuoka', name: 'Shizuoka', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":76,"CDP":6.2,"KOMEITO":2,"ISHIN":1.4,"DPFP":6.4,"JCP":8.1}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Tochigi', name: 'Tochigi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":79.3,"CDP":4.2,"KOMEITO":2.2,"ISHIN":2.4,"DPFP":7.1,"JCP":4.9}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Tokushima', name: 'Tokushima', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":78.5,"CDP":3.5,"KOMEITO":6.2,"ISHIN":2.2,"DPFP":6.2,"JCP":3.3}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Tokyo', name: 'Tokyo', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":83.8,"CDP":1.2,"KOMEITO":2.7,"ISHIN":7.7,"DPFP":1.8,"JCP":2.9}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Tottori', name: 'Tottori', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":82.6,"CDP":3.7,"KOMEITO":1.5,"ISHIN":1.3,"DPFP":7.3,"JCP":3.7}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Toyama', name: 'Toyama', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":85.9,"CDP":1.3,"KOMEITO":4.6,"ISHIN":1,"DPFP":4.8,"JCP":2.4}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Wakayama', name: 'Wakayama', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":87,"CDP":3.6,"KOMEITO":2.7,"ISHIN":1.3,"DPFP":2,"JCP":3.5}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Yamagata', name: 'Yamagata', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":79.6,"CDP":7.4,"KOMEITO":1.7,"ISHIN":5.6,"DPFP":1.6,"JCP":4.1}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Yamaguchi', name: 'Yamaguchi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":72.4,"CDP":5,"KOMEITO":6.8,"ISHIN":6.4,"DPFP":2.8,"JCP":6.6}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' },
      { id: 'Yamanashi', name: 'Yamanashi', seats: 10, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"LDP":75.8,"CDP":7.6,"KOMEITO":3.8,"ISHIN":6.2,"DPFP":2.7,"JCP":3.9}, infrastructure: 4, campaignLevel: 0, ownerPartyId: 'LDP' }
    ],
    bills: createBills('JP'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
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
      { id: 'Alexandria', name: 'Alexandria', mayorName: 'Mohamed Taher Al-Sherif', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":31.8,"RPP":4.6,"WAFD":17.3,"HDP":15.1,"MEP":14.4,"ESDP":16.9}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Aswan', name: 'Aswan', mayorName: 'Ashraf Attia', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":84.4,"RPP":3.4,"WAFD":3.5,"HDP":5,"MEP":2.4,"ESDP":1.3}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Asyut', name: 'Asyut', mayorName: 'Essam Saad', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":86.9,"RPP":2.2,"WAFD":5.3,"HDP":2.8,"MEP":0.1,"ESDP":2.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Beheira', name: 'Beheira', mayorName: 'Hisham Amna', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":78.9,"RPP":5.1,"WAFD":4.2,"HDP":6,"MEP":0.9,"ESDP":4.9}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Beni Suef', name: 'Beni Suef', mayorName: 'Mohamed Hany Ghoneim', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":76.3,"RPP":3.3,"WAFD":5.8,"HDP":6.2,"MEP":3.6,"ESDP":4.8}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Cairo', name: 'Cairo', mayorName: 'Khaled Abdel Aal', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":34,"RPP":16.8,"WAFD":0.6,"HDP":13.6,"MEP":14.3,"ESDP":20.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Dakahlia', name: 'Dakahlia', mayorName: 'Ayman Mokhtar', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":85.7,"RPP":3.6,"WAFD":5.3,"HDP":1.7,"MEP":3.6,"ESDP":0}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Damietta', name: 'Damietta', mayorName: 'Manal Awad Mikhail', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":81.8,"RPP":3.2,"WAFD":3.9,"HDP":6.2,"MEP":3,"ESDP":2}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Faiyum', name: 'Faiyum', mayorName: 'Ahmed Al-Ansari', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":86.5,"RPP":3.2,"WAFD":3,"HDP":6.1,"MEP":0.6,"ESDP":0.6}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Gharbia', name: 'Gharbia', mayorName: 'Tarek Rahmy', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":80.5,"RPP":4.8,"WAFD":4.3,"HDP":3.6,"MEP":1.8,"ESDP":5}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Giza', name: 'Giza', mayorName: 'Ahmed Rashed', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":30.7,"RPP":18.7,"WAFD":1.9,"HDP":15,"MEP":14.1,"ESDP":19.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Ismailia', name: 'Ismailia', mayorName: 'Sherif Fahmy Bishara', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":78.9,"RPP":3.7,"WAFD":4.6,"HDP":2.3,"MEP":4.8,"ESDP":5.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Kafr El Sheikh', name: 'Kafr El Sheikh', mayorName: 'Gamal Nour El-Din', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":85.7,"RPP":5.7,"WAFD":0.4,"HDP":0.9,"MEP":1.3,"ESDP":5.9}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Luxor', name: 'Luxor', mayorName: 'Mustafa Al-Alham', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":86.5,"RPP":6.4,"WAFD":2.6,"HDP":1.6,"MEP":2.9,"ESDP":0}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Matrouh', name: 'Matrouh', mayorName: 'Khaled Shoaib', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":78.8,"RPP":3,"WAFD":6.2,"HDP":3.4,"MEP":3.1,"ESDP":5.4}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Minya', name: 'Minya', mayorName: 'Osama Al-Qady', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":82.4,"RPP":1.8,"WAFD":1.4,"HDP":5.8,"MEP":6.3,"ESDP":2.4}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Monufia', name: 'Monufia', mayorName: 'Ibrahim Abu Limon', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":83.5,"RPP":6.6,"WAFD":0,"HDP":5.3,"MEP":0.3,"ESDP":4.4}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'New Valley', name: 'New Valley', mayorName: 'Mohamed Al-Zamlout', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":81.5,"RPP":1.5,"WAFD":3.4,"HDP":5.8,"MEP":4.1,"ESDP":3.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'North Sinai', name: 'North Sinai', mayorName: 'Mohamed Shousha', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":90.6,"RPP":0.7,"WAFD":0.6,"HDP":4.1,"MEP":2.4,"ESDP":1.6}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Port Said', name: 'Port Said', mayorName: 'Adel Ghadban', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":75.5,"RPP":5.9,"WAFD":4.7,"HDP":4.8,"MEP":3.3,"ESDP":5.8}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Qalyubia', name: 'Qalyubia', mayorName: 'Abdel Hamid El-Haggan', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":83.6,"RPP":1.8,"WAFD":6.3,"HDP":5.3,"MEP":0.2,"ESDP":2.7}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Qena', name: 'Qena', mayorName: 'Ashraf Daoudi', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":87.6,"RPP":2.4,"WAFD":5.5,"HDP":2.5,"MEP":0.6,"ESDP":1.3}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Red Sea', name: 'Red Sea', mayorName: 'Amr Hanafy', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":86.9,"RPP":1.1,"WAFD":1.7,"HDP":0.3,"MEP":3.8,"ESDP":6.2}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Sharqia', name: 'Sharqia', mayorName: 'Mamdouh Ghorab', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":87.4,"RPP":1.3,"WAFD":3.9,"HDP":1,"MEP":1.1,"ESDP":5.3}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Sohag', name: 'Sohag', mayorName: 'Tarek El-Feki', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":80.4,"RPP":4,"WAFD":0.9,"HDP":5.1,"MEP":3.3,"ESDP":6.3}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'South Sinai', name: 'South Sinai', mayorName: 'Khaled Fouda', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":83,"RPP":3.1,"WAFD":4.6,"HDP":2.7,"MEP":1.4,"ESDP":5.2}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' },
      { id: 'Suez', name: 'Suez', mayorName: 'Abdel Majeed Saqr', seats: 20, voterDistribution: makeVoterGroup(20,20,20,20,10,10), supports: {"NFP":78.8,"RPP":4.7,"WAFD":4.9,"HDP":0,"MEP":6.2,"ESDP":5.4}, infrastructure: 3, campaignLevel: 0, ownerPartyId: 'NFP' }
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
      { text: 'Increase subsidies for essential goods', impactText: 'Appeals to workers, costs high budget', voterImpacts: { Workers: 5, Shopkeepers: -2 }, budgetCost: 50000, influenceMod: 0 },
      { text: 'Implement strict fiscal austerity measures', impactText: 'Appeals to shopkeepers and Traditionalists, lowers overall influence', voterImpacts: { Shopkeepers: 5, Workers: -5, Traditionalists: 3 }, budgetCost: 0, influenceMod: -10 },
      { text: 'Focus on domestic production incentives', impactText: 'Balanced approach, moderate cost', voterImpacts: { Workers: 2, Shopkeepers: 2 }, budgetCost: 20000, influenceMod: 5 }
    ]
  },
  {
    id: 'sec1',
    topic: 'National Security',
    question: 'With increasing border tensions, what is your stance on military spending?',
    choices: [
      { text: 'Increase military budget significantly', impactText: 'Strongly appeals to Nationalists and Traditionalists', voterImpacts: { Nationalists: 6, Traditionalists: 4, Liberals: -3 }, budgetCost: 60000, influenceMod: 10 },
      { text: 'Maintain current budget, focus on efficiency', impactText: 'Appeals to moderates', voterImpacts: { Liberals: 2, Traditionalists: -2 }, budgetCost: 0, influenceMod: 5 },
      { text: 'Reduce military spending, fund social programs', impactText: 'Appeals to Liberals and workers', voterImpacts: { Liberals: 5, Workers: 4, Nationalists: -6 }, budgetCost: -20000, influenceMod: 0 }
    ]
  },
  {
    id: 'soc1',
    topic: 'Social Policy',
    question: 'What is your vision for the future of our healthcare system?',
    choices: [
      { text: 'Push for universal free healthcare', impactText: 'High cost, massive appeal to workers/shopkeepers', voterImpacts: { Workers: 6, Shopkeepers: -3, Liberals: 4 }, budgetCost: 80000, influenceMod: 15 },
      { text: 'Privatize aspects of the healthcare system', impactText: 'Appeals to shopkeepers and Traditionalists, generates revenue', voterImpacts: { Shopkeepers: 5, Workers: -5, Traditionalists: 3 }, budgetCost: -30000, influenceMod: -5 },
      { text: 'Increase funding for rural clinics only', impactText: 'Moderate cost, appeals to shopkeepers', voterImpacts: { Shopkeepers: 4 }, budgetCost: 25000, influenceMod: 5 }
    ]
  },
  {
    id: 'env1',
    topic: 'Environment',
    question: 'How will you balance industrial growth with environmental protection?',
    choices: [
      { text: 'Implement strict green energy regulations', impactText: 'Appeals to Liberals, costs budget, angers Traditionalists', voterImpacts: { Liberals: 5, Traditionalists: -4, Shopkeepers: -2 }, budgetCost: 30000, influenceMod: 5 },
      { text: 'Prioritize industrial output and jobs', impactText: 'Appeals to workers and Traditionalists, angers Liberals', voterImpacts: { Workers: 4, Traditionalists: 3, Liberals: -5 }, budgetCost: 0, influenceMod: 5 },
      { text: 'Subsidize clean technology research', impactText: 'High cost, balanced appeal', voterImpacts: { Liberals: 3, Shopkeepers: 2 }, budgetCost: 40000, influenceMod: 10 }
    ]
  }
];

export function generateName(countryId: string): string {
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

  const inFirst = ['Arjun', 'Aarav', 'Vihaan', 'Pranav', 'Rohan', 'Ananya', 'Diya', 'Ishaan', 'Aditya', 'Sanjay'];
  const inLast = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Mehta', 'Joshi', 'Iyer', 'Reddy', 'Nair'];

  const itFirst = ['Francesco', 'Alessandro', 'Leonardo', 'Lorenzo', 'Giuseppe', 'Sofia', 'Giulia', 'Aurora', 'Giorgia', 'Andrea'];
  const itLast = ['Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Esposito', 'Colombo', 'Romano', 'Ricci', 'Marini', 'Greco'];

  const idFirst = ['Budi', 'Joko', 'Agus', 'Siti', 'Dewi', 'Putra', 'Rian', 'Rudi', 'Tri', 'Eko'];
  const idLast = ['Wijaya', 'Santoso', 'Hidayat', 'Pratama', 'Kurniawan', 'Siregar', 'Sutrisno', 'Setiawan', 'Gunawan', 'Saputra'];

  const esFirst = ['Mateo', 'Santiago', 'Matias', 'Sebastian', 'Sofia', 'Maria', 'Alejandro', 'Daniel', 'David', 'Javier'];
  const esLast = ['Hernandez', 'Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Rodriguez', 'Perez', 'Sanchez', 'Ramirez', 'Torres'];

  const krFirst = ['Min-jun', 'Seo-jun', 'Ye-jun', 'Do-yun', 'Si-woo', 'Ji-woo', 'Seo-yeon', 'Seo-hyeon', 'Min-seo', 'Ha-eun'];
  const krLast = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Chang', 'Lim'];

  const zaFirst = ['Sipho', 'Thabo', 'Kagiso', 'Lethabo', 'Bandile', 'Melokuhle', 'Zama', 'Naledi', 'Buhle', 'Lerato'];
  const zaLast = ['Dlamini', 'Ndlovu', 'Khumalo', 'Mthembu', 'Mokoena', 'Smit', 'Botha', 'Pretorius', 'Naidoo', 'Govender'];

  const sample = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (countryId === 'TR') return `${sample(trFirst)} ${sample(trLast)}`;
  if (countryId === 'DE') return `${sample(deFirst)} ${sample(deLast)}`;
  if (countryId === 'US') return `${sample(usFirst)} ${sample(usLast)}`;
  if (countryId === 'BR') return `${sample(brFirst)} ${sample(brLast)}`;
  if (countryId === 'JP') return `${sample(jpFirst)} ${sample(jpLast)}`;
  if (countryId === 'EG') return `${sample(egFirst)} ${sample(egLast)}`;
  if (countryId === 'GB') return `${sample(gbFirst)} ${sample(gbLast)}`;
  if (countryId === 'IN') return `${sample(inFirst)} ${sample(inLast)}`;
  if (countryId === 'IT') return `${sample(itFirst)} ${sample(itLast)}`;
  if (countryId === 'ID') return `${sample(idFirst)} ${sample(idLast)}`;
  if (countryId === 'MX' || countryId === 'ES' || countryId === 'AR') return `${sample(esFirst)} ${sample(esLast)}`;
  if (countryId === 'KR') return `${sample(krFirst)} ${sample(krLast)}`;
  if (countryId === 'ZA') return `${sample(zaFirst)} ${sample(zaLast)}`;
  if (countryId === 'CA' || countryId === 'AU') return `${sample(gbFirst)} ${sample(gbLast)}`;

  return `${sample(usFirst)} ${sample(usLast)}`;
}

export function getDeterministicMayorName(regionName: string, countryId: string): string {
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

  const inFirst = ['Arjun', 'Aarav', 'Vihaan', 'Pranav', 'Rohan', 'Ananya', 'Diya', 'Ishaan', 'Aditya', 'Sanjay'];
  const inLast = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Mehta', 'Joshi', 'Iyer', 'Reddy', 'Nair'];

  const itFirst = ['Francesco', 'Alessandro', 'Leonardo', 'Lorenzo', 'Giuseppe', 'Sofia', 'Giulia', 'Aurora', 'Giorgia', 'Andrea'];
  const itLast = ['Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Esposito', 'Colombo', 'Romano', 'Ricci', 'Marini', 'Greco'];

  const idFirst = ['Budi', 'Joko', 'Agus', 'Siti', 'Dewi', 'Putra', 'Rian', 'Rudi', 'Tri', 'Eko'];
  const idLast = ['Wijaya', 'Santoso', 'Hidayat', 'Pratama', 'Kurniawan', 'Siregar', 'Sutrisno', 'Setiawan', 'Gunawan', 'Saputra'];

  const esFirst = ['Mateo', 'Santiago', 'Matias', 'Sebastian', 'Sofia', 'Maria', 'Alejandro', 'Daniel', 'David', 'Javier'];
  const esLast = ['Hernandez', 'Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Rodriguez', 'Perez', 'Sanchez', 'Ramirez', 'Torres'];

  const krFirst = ['Min-jun', 'Seo-jun', 'Ye-jun', 'Do-yun', 'Si-woo', 'Ji-woo', 'Seo-yeon', 'Seo-hyeon', 'Min-seo', 'Ha-eun'];
  const krLast = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Chang', 'Lim'];

  const zaFirst = ['Sipho', 'Thabo', 'Kagiso', 'Lethabo', 'Bandile', 'Melokuhle', 'Zama', 'Naledi', 'Buhle', 'Lerato'];
  const zaLast = ['Dlamini', 'Ndlovu', 'Khumalo', 'Mthembu', 'Mokoena', 'Smit', 'Botha', 'Pretorius', 'Naidoo', 'Govender'];

  let hash = 0;
  for (let i = 0; i < regionName.length; i++) {
    hash = regionName.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const sample = (arr: string[]) => arr[hash % arr.length];

  if (countryId === 'TR') return `${sample(trFirst)} ${sample(trLast)}`;
  if (countryId === 'DE') return `${sample(deFirst)} ${sample(deLast)}`;
  if (countryId === 'US') return `${sample(usFirst)} ${sample(usLast)}`;
  if (countryId === 'BR') return `${sample(brFirst)} ${sample(brLast)}`;
  if (countryId === 'JP') return `${sample(jpFirst)} ${sample(jpLast)}`;
  if (countryId === 'EG') return `${sample(egFirst)} ${sample(egLast)}`;
  if (countryId === 'GB') return `${sample(gbFirst)} ${sample(gbLast)}`;
  if (countryId === 'IN') return `${sample(inFirst)} ${sample(inLast)}`;
  if (countryId === 'IT') return `${sample(itFirst)} ${sample(itLast)}`;
  if (countryId === 'ID') return `${sample(idFirst)} ${sample(idLast)}`;
  if (countryId === 'MX' || countryId === 'ES' || countryId === 'AR') return `${sample(esFirst)} ${sample(esLast)}`;
  if (countryId === 'KR') return `${sample(krFirst)} ${sample(krLast)}`;
  if (countryId === 'ZA') return `${sample(zaFirst)} ${sample(zaLast)}`;
  if (countryId === 'CA' || countryId === 'AU') return `${sample(gbFirst)} ${sample(gbLast)}`;

  return `${sample(usFirst)} ${sample(usLast)}`;
}
