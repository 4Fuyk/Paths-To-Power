/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, VoterGroup, Bill, RivalParty, Region, SpeechCard } from '../types';
import { getPartyGovernorForRegion } from '../utils/mayorUtils';

const TURKEY_PROVINCES_SPEC = [
  { name: 'Adana', seats: 15, winner: 'CHP', mayorName: 'Zeydan Karalar' },
  { name: 'Adıyaman', seats: 5, winner: 'CHP', mayorName: 'Abdurrahman Tutdere' },
  { name: 'Afyonkarahisar', seats: 6, winner: 'CHP', mayorName: 'Burcu Köksal' },
  { name: 'Ağrı', seats: 4, winner: 'DEM', mayorName: 'Hazal Aras' },
  { name: 'Amasya', seats: 3, winner: 'CHP', mayorName: 'Turgay Sevindi' },
  { name: 'Ankara', seats: 36, winner: 'CHP', mayorName: 'Mansur Yavaş' },
  { name: 'Antalya', seats: 17, winner: 'YENI', mayorName: 'Muhittin Böcek' },
  { name: 'Artvin', seats: 2, winner: 'CHP', mayorName: 'Bilgehan Erdem' },
  { name: 'Aydın', seats: 8, winner: 'CHP', mayorName: 'Özlem Çerçioğlu' },
  { name: 'Balıkesir', seats: 9, winner: 'YENI', mayorName: 'Ahmet Akın' },
  { name: 'Bilecik', seats: 2, winner: 'YENI', mayorName: 'Melek Mızrak Subaşı' },
  { name: 'Bingöl', seats: 3, winner: 'AKP', mayorName: 'Erdal Arıkan' },
  { name: 'Bitlis', seats: 3, winner: 'AKP', mayorName: 'Nesrullah Tanğlay' },
  { name: 'Bolu', seats: 3, winner: 'CHP', mayorName: 'Tanju Özcan' },
  { name: 'Burdur', seats: 3, winner: 'CHP', mayorName: 'Ali Orkun Ercengiz' },
  { name: 'Bursa', seats: 20, winner: 'YENI', mayorName: 'Mustafa Bozbey' },
  { name: 'Çanakkale', seats: 4, winner: 'YENI', mayorName: 'Muharrem Erkek' },
  { name: 'Çankırı', seats: 2, winner: 'MHP', mayorName: 'İsmail Hakkı Esen' },
  { name: 'Çorum', seats: 4, winner: 'AKP', mayorName: 'Halil İbrahim Aşgın' },
  { name: 'Denizli', seats: 7, winner: 'YENI', mayorName: 'Bülent Nuri Çavuşoğlu' },
  { name: 'Diyarbakır', seats: 12, winner: 'DEM', mayorName: 'Ayşe Serra Bucak Küçük' },
  { name: 'Edirne', seats: 4, winner: 'YENI', mayorName: 'Filiz Gencan Akın' },
  { name: 'Elazığ', seats: 5, winner: 'AKP', mayorName: 'Şahin Şerifoğulları' },
  { name: 'Erzincan', seats: 2, winner: 'MHP', mayorName: 'Bekir Aksun' },
  { name: 'Erzurum', seats: 6, winner: 'AKP', mayorName: 'Mehmet Sekmen' },
  { name: 'Eskişehir', seats: 7, winner: 'YENI', mayorName: 'Ayşe Ünlüce' },
  { name: 'Gaziantep', seats: 14, winner: 'AKP', mayorName: 'Fatma Şahin' },
  { name: 'Giresun', seats: 4, winner: 'CHP', mayorName: 'Fuat Köse' },
  { name: 'Gümüşhane', seats: 2, winner: 'MHP', mayorName: 'Vedat Soner Başer' },
  { name: 'Hakkari', seats: 3, winner: 'DEM', mayorName: 'Mehmet Sıddık Akış' },
  { name: 'Hatay', seats: 11, winner: 'AKP', mayorName: 'Mehmet Öntürk' },
  { name: 'Isparta', seats: 4, winner: 'AKP', mayorName: 'Şükrü Başdeğirmen' },
  { name: 'Mersin', seats: 13, winner: 'CHP', mayorName: 'Vahap Seçer' },
  { name: 'İstanbul', seats: 98, winner: 'CHP', mayorName: 'Ekrem İmamoğlu' },
  { name: 'İzmir', seats: 28, winner: 'YENI', mayorName: 'Cemil Tugay' },
  { name: 'Kars', seats: 3, winner: 'MHP', mayorName: 'Ötüken Senger' },
  { name: 'Kastamonu', seats: 3, winner: 'CHP', mayorName: 'Hasan Baltacı' },
  { name: 'Kayseri', seats: 10, winner: 'AKP', mayorName: 'Memduh Büyükkılıç' },
  { name: 'Kırklareli', seats: 3, winner: 'MHP', mayorName: 'Derya Bulut' },
  { name: 'Kırşehir', seats: 2, winner: 'YENI', mayorName: 'Selahattin Ekicioğlu' },
  { name: 'Kocaeli', seats: 14, winner: 'AKP', mayorName: 'Tahir Büyükakın' },
  { name: 'Konya', seats: 15, winner: 'AKP', mayorName: 'Uğur İbrahim Altay' },
  { name: 'Kütahya', seats: 5, winner: 'YENI', mayorName: 'Eyüp Kahveci' },
  { name: 'Malatya', seats: 6, winner: 'AKP', mayorName: 'Sami Er' },
  { name: 'Manisa', seats: 10, winner: 'YENI', mayorName: 'Ferdi Zeyrek' },
  { name: 'Kahramanmaraş', seats: 8, winner: 'AKP', mayorName: 'Fırat Görgel' },
  { name: 'Mardin', seats: 6, winner: 'DEM', mayorName: 'Ahmet Türk' },
  { name: 'Muğla', seats: 7, winner: 'YENI', mayorName: 'Ahmet Aras' },
  { name: 'Muş', seats: 3, winner: 'DEM', mayorName: 'Sırrı Söylemez' },
  { name: 'Nevşehir', seats: 3, winner: 'AKP', mayorName: 'Rasim Arı' },
  { name: 'Niğde', seats: 3, winner: 'AKP', mayorName: 'Emrah Özdemir' },
  { name: 'Ordu', seats: 6, winner: 'AKP', mayorName: 'Mehmet Hilmi Güler' },
  { name: 'Osmaniye', seats: 4, winner: 'MHP', mayorName: 'Ibrahim Çenet' },
  { name: 'Rize', seats: 3, winner: 'AKP', mayorName: 'Rahmi Metin' },
  { name: 'Sakarya', seats: 8, winner: 'AKP', mayorName: 'Yusuf Alemdar' },
  { name: 'Samsun', seats: 9, winner: 'AKP', mayorName: 'Halit Doğan' },
  { name: 'Şanlıurfa', seats: 14, winner: 'YRP', mayorName: 'Mehmet Kasım Gülpınar' },
  { name: 'Siirt', seats: 3, winner: 'DEM', mayorName: 'Sofya Alağaş' },
  { name: 'Sinop', seats: 2, winner: 'CHP', mayorName: 'Metin Gürbüz' },
  { name: 'Şırnak', seats: 4, winner: 'AKP', mayorName: 'Mehmet Yarka' },
  { name: 'Sivas', seats: 5, winner: 'MHP', mayorName: 'Adem Uzun' },
  { name: 'Tekirdağ', seats: 8, winner: 'YENI', mayorName: 'Candan Yüceer' },
  { name: 'Tokat', seats: 5, winner: 'MHP', mayorName: 'Mehmet Kemal Yazıcıoğlu' },
  { name: 'Trabzon', seats: 6, winner: 'AKP', mayorName: 'Ahmet Metin Genç' },
  { name: 'Tunceli', seats: 1, winner: 'DEM', mayorName: 'Cevdet Konak' },
  { name: 'Uşak', seats: 3, winner: 'YENI', mayorName: 'Özkan Yalım' },
  { name: 'Van', seats: 8, winner: 'DEM', mayorName: 'Abdullah Zeydan' },
  { name: 'Yalova', seats: 3, winner: 'YENI', mayorName: 'Mehmet Gürel' },
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
    let supports: Record<string, number> | undefined = (prov as any).supports;
    if (!supports) {
      const base: Record<string, number> = {
        YENI: 19,
        CHP: 17,
        AKP: 31,
        DEM: 9,
        MHP: 9,
        YRP: 6,
        ZAFER: 4,
        TIP: 2,
        TKP: 0.8,
        SAADET: 0.8,
        DEVA: 0.5,
        GELECEK: 0.5,
        VATAN: 0.4
      };

      let hash = 0;
      for (let i = 0; i < prov.name.length; i++) hash = prov.name.charCodeAt(i) + ((hash << 5) - hash);
      hash = Math.abs(hash);

      const mod5 = hash % 5;
      const mod4 = (hash >> 1) % 4;
      const mod3 = (hash >> 2) % 3;
      const mod2 = (hash >> 3) % 2;
      const mod6 = (hash >> 4) % 6;

      if (prov.winner === 'DEM') {
        base.DEM = 52 + mod5;
        base.AKP = 22 + mod4;
        base.YENI = 9 + mod3;
        base.CHP = 8 + mod2;
        base.YRP = 3 + mod2;
        base.MHP = 3 + mod2;
      } else if (prov.winner === 'CHP') {
        base.CHP = 36 + mod6;
        base.AKP = 25 + mod4;
        base.YENI = 21 + mod3;
        base.MHP = 6 + mod2;
        base.YRP = 4 + mod2;
        base.DEM = 4 + mod2;
      } else if (prov.winner === 'YENI') {
        base.YENI = 37 + mod6;
        base.AKP = 24 + mod4;
        base.CHP = 20 + mod3;
        base.MHP = 6 + mod2;
        base.YRP = 4 + mod2;
        base.DEM = 4 + mod2;
      } else if (prov.winner === 'AKP') {
        base.AKP = 46 + mod6;
        base.YENI = 14 + mod3;
        base.CHP = 13 + mod3;
        base.MHP = 10 + mod3;
        base.YRP = 6 + mod2;
        base.DEM = 4 + mod2;
      } else if (prov.winner === 'MHP') {
        base.MHP = 40 + mod5;
        base.AKP = 26 + mod4;
        base.YENI = 11 + mod3;
        base.CHP = 10 + mod2;
        base.YRP = 6 + mod2;
      } else if (prov.winner === 'YRP') {
        base.YRP = 38 + mod5;
        base.AKP = 28 + mod4;
        base.YENI = 10 + mod3;
        base.CHP = 9 + mod2;
        base.MHP = 8 + mod2;
      } else {
        base.AKP = 32; base.YENI = 20; base.CHP = 16; base.MHP = 10; base.YRP = 8;
      }

      const total = Object.values(base).reduce((s, v) => s + v, 0);
      const scale = 100 / total;
      supports = {};
      Object.entries(base).forEach(([pId, val]) => {
        supports[pId] = parseFloat((val * scale).toFixed(2));
      });
    }

    const voterDistribution = getRealisticVoterDistribution(prov.name, 'TR', prov.winner);

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
      mayorName: prov.mayorName || getPartyGovernorForRegion(prov.name, prov.winner, 'TR')
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
      base.CDU = 38 + Math.floor(Math.random() * 5);
      base.AfD = 18 + Math.floor(Math.random() * 3);
      base.SPD = 14 + Math.floor(Math.random() * 3);
      base.GRÜNE = 11 + Math.floor(Math.random() * 3);
      base.LINKE = 7 + Math.floor(Math.random() * 2);
    } else if (spec.winner === 'AfD') {
      base.AfD = 38 + Math.floor(Math.random() * 5);
      base.CDU = 22 + Math.floor(Math.random() * 3);
      base.SPD = 12 + Math.floor(Math.random() * 2);
      base.GRÜNE = 7 + Math.floor(Math.random() * 2);
      base.LINKE = 11 + Math.floor(Math.random() * 3);
    } else if (spec.winner === 'SPD') {
      base.SPD = 36 + Math.floor(Math.random() * 5);
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

    const voterDistribution = getRealisticVoterDistribution(spec.name, 'DE', spec.winner);

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
      mayorName: spec.mayorName || getPartyGovernorForRegion(spec.name, spec.winner, 'DE')
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
      base.REP = 54 + Math.floor(Math.random() * 6);
      base.DEM_US = 35 + Math.floor(Math.random() * 5);
      base.LP = 5 + Math.floor(Math.random() * 3);
      base.GP = 2 + Math.floor(Math.random() * 2);
    } else {
      base.DEM_US = 54 + Math.floor(Math.random() * 6);
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

    const voterDistribution = getRealisticVoterDistribution(spec.name, 'US', spec.winner);

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
      mayorName: spec.governor || getPartyGovernorForRegion(spec.name, spec.winner, 'US')
    };
  });
};

// Helper to calculate realistic, region-tailored voter demographics that strictly sum to 100%
export const getRealisticVoterDistribution = (
  regionName: string,
  countryId: string,
  winnerPartyId?: string
): Record<string, number> => {
  let hash = 0;
  const str = `${countryId}_${regionName}`;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const norm = regionName.toLowerCase();
  
  const isUrban = norm.includes('istanbul') || norm.includes('ankara') || norm.includes('izmir') || 
                  norm.includes('tokyo') || norm.includes('osaka') || norm.includes('london') || 
                  norm.includes('cairo') || norm.includes('sao paulo') || norm.includes('rio') ||
                  norm.includes('paris') || norm.includes('berlin') || norm.includes('madrid') || 
                  norm.includes('seoul') || norm.includes('delhi') || norm.includes('bucharest') || 
                  norm.includes('budapest') || norm.includes('california') || norm.includes('york') || 
                  norm.includes('capital') || norm.includes('sydney') || norm.includes('rome') ||
                  norm.includes('toronto') || norm.includes('jakarta') || norm.includes('buenos');

  const isIndustrial = norm.includes('ruhr') || norm.includes('nordrhein') || norm.includes('aichi') || 
                       norm.includes('bursa') || norm.includes('kocaeli') || norm.includes('detroit') || 
                       norm.includes('katowice') || norm.includes('pittsburgh') || norm.includes('busan') || 
                       norm.includes('minas') || norm.includes('west java') || norm.includes('hauts') ||
                       norm.includes('zonguldak') || norm.includes('silesia') || norm.includes('lombardy');

  const isRural = norm.includes('bavaria') || norm.includes('texas') || norm.includes('alabama') || 
                  norm.includes('anatolia') || norm.includes('yozgat') || norm.includes('aswan') || 
                  norm.includes('dakota') || norm.includes('kansas') || norm.includes('transdanubia') ||
                  norm.includes('queensland') || norm.includes('limpopo') || norm.includes('saskatchewan') ||
                  norm.includes('konya') || norm.includes('erzurum');

  let workers = 16 + (isIndustrial ? 14 : 0) + (hash % 8);
  let youth = 15 + (isUrban ? 12 : 0) + ((hash >> 2) % 8);
  let nationalists = 12 + (isRural ? 10 : 0) + ((hash >> 4) % 8);
  let liberals = 12 + (isUrban ? 12 : 0) + ((hash >> 6) % 8);
  let traditionalists = 12 + (isRural ? 12 : 0) + ((hash >> 8) % 8);

  if (winnerPartyId === 'DEM' || winnerPartyId === 'CHP' || winnerPartyId === 'LFI' || winnerPartyId === 'GRN' || winnerPartyId === 'GRÜNE' || winnerPartyId === 'DEM_US') {
    youth += 4;
    liberals += 5;
  } else if (winnerPartyId === 'AKP' || winnerPartyId === 'REP' || winnerPartyId === 'AfD' || winnerPartyId === 'RN' || winnerPartyId === 'MHP' || winnerPartyId === 'FIDESZ') {
    nationalists += 5;
    traditionalists += 5;
  } else if (winnerPartyId === 'LAB' || winnerPartyId === 'PT' || winnerPartyId === 'SPD' || winnerPartyId === 'PDIP' || winnerPartyId === 'INC') {
    workers += 6;
  }

  let total = workers + youth + nationalists + liberals + traditionalists;
  let shopkeepers = Math.max(8, 100 - total);

  total += shopkeepers;
  const scale = 100 / total;

  let w = Math.round(workers * scale);
  let y = Math.round(youth * scale);
  let n = Math.round(nationalists * scale);
  let l = Math.round(liberals * scale);
  let t = Math.round(traditionalists * scale);
  let s = 100 - (w + y + n + l + t);

  if (s < 2) {
    s = 5;
    w -= 1; y -= 1; n -= 1; l -= 1; t -= 1;
  }

  return {
    'Workers': w,
    'Youth': y,
    'Nationalists': n,
    'Liberals': l,
    'Traditionalists': t,
    'Shopkeepers': s
  };
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
  specs: { name: string; seats: number; winner: string; mayorName?: string; id?: string }[],
  partyIds: string[],
  baseSupports: Record<string, number>
): Region[] => {
  return specs.map((spec) => {
    let hash = 0;
    for (let i = 0; i < spec.name.length; i++) hash = spec.name.charCodeAt(i) + ((hash << 5) - hash);
    hash = Math.abs(hash);
    const mod10 = hash % 10;
    const mod4 = (hash >> 1) % 4;

    const base: Record<string, number> = {};
    partyIds.forEach((pId) => {
      base[pId] = baseSupports[pId] || 10;
    });

    if (spec.winner && base[spec.winner] !== undefined) {
      const boost = 18 + mod10;
      base[spec.winner] += boost;
      
      partyIds.forEach((pId) => {
        if (pId !== spec.winner) {
          base[pId] = Math.max(1, base[pId] - (1 + mod4));
        }
      });
    }

    const total = Object.values(base).reduce((s, v) => s + v, 0);
    const scale = 100 / total;
    const supports: Record<string, number> = {};
    Object.entries(base).forEach(([pId, val]) => {
      supports[pId] = parseFloat((val * scale).toFixed(1));
    });

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

    const voterDistribution = getRealisticVoterDistribution(spec.name, countryId, spec.winner);

    const infrastructure = spec.seats >= 30 ? 5 : spec.seats >= 15 ? 4 : 3;
    const id = spec.id || spec.name;

    return {
      id,
      name: spec.name,
      seats: spec.seats,
      voterDistribution,
      supports,
      infrastructure,
      campaignLevel: 0,
      ownerPartyId: spec.winner,
      mayorName: spec.mayorName || getPartyGovernorForRegion(spec.name, spec.winner, countryId)
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

const FRANCE_SPEC = [
  { name: 'Île-de-France', seats: 97, winner: 'RE', mayorName: 'Valérie Pécresse' },
  { name: 'Auvergne-Rhône-Alpes', seats: 64, winner: 'RN', mayorName: 'Laurent Wauquiez' },
  { name: 'Nouvelle-Aquitaine', seats: 49, winner: 'PS', mayorName: 'Alain Rousset' },
  { name: 'Hauts-de-France', seats: 50, winner: 'RN', mayorName: 'Xavier Bertrand' },
  { name: 'Occitanie', seats: 49, winner: 'LFI', mayorName: 'Carole Delga' },
  { name: 'Grand Est', seats: 49, winner: 'RN', mayorName: 'Franck Leroy' },
  { name: 'Provence-Alpes-Côte d\'Azur', seats: 42, winner: 'RN', mayorName: 'Renaud Muselier' },
  { name: 'Pays de la Loire', seats: 30, winner: 'RE', mayorName: 'Christelle Morançais' },
  { name: 'Bretagne', seats: 27, winner: 'PS', mayorName: 'Loïg Chesnais-Girard' },
  { name: 'Normandie', seats: 28, winner: 'RE', mayorName: 'Hervé Morin' },
  { name: 'Bourgogne-Franche-Comté', seats: 27, winner: 'RN', mayorName: 'Marie-Guite Dufay' },
  { name: 'Centre-Val de Loire', seats: 23, winner: 'PS', mayorName: 'François Bonneau' },
  { name: 'Corse', seats: 4, winner: 'RE', mayorName: 'Gilles Simeoni' },
  { name: 'Guadeloupe', seats: 4, winner: 'LFI', mayorName: 'Ary Chalus' },
  { name: 'Martinique', seats: 4, winner: 'LFI', mayorName: 'Serge Letchimy' },
  { name: 'French Guiana (Guyane)', seats: 2, winner: 'LFI', mayorName: 'Gabriel Serville' },
  { name: 'La Réunion', seats: 7, winner: 'LFI', mayorName: 'Huguette Bello' },
  { name: 'Mayotte', seats: 2, winner: 'LR', mayorName: 'Ben Issa Ousseni' },
  { name: 'Français de l\'étranger', seats: 11, winner: 'RE', mayorName: 'Roland Lescure' }
];

const ROMANIA_SPEC = [
  { name: 'Bucharest-Ilfov', seats: 46, winner: 'USR', mayorName: 'Nicusor Dan' },
  { name: 'Nord-Vest', seats: 41, winner: 'PNL', mayorName: 'Emil Boc' },
  { name: 'Centru', seats: 34, winner: 'PSD', mayorName: 'Lia Olguta Vasilescu' },
  { name: 'Sud-Muntenia', seats: 43, winner: 'PSD', mayorName: 'Tudor Pendiuc' },
  { name: 'Nord-Est', seats: 46, winner: 'AUR', mayorName: 'Mihai Chirica' }
];

const HUNGARY_SPEC = [
  { name: 'Central Hungary', seats: 60, winner: 'TISZA', mayorName: 'Gergely Karácsony' },
  { name: 'Transdanubia', seats: 50, winner: 'FIDESZ', mayorName: 'László Papp' },
  { name: 'Great Plain', seats: 55, winner: 'FIDESZ', mayorName: 'László Botka' },
  { name: 'North Hungary', seats: 34, winner: 'MHM', mayorName: 'Pál Veres' }
];

const UK_SPEC = [
  { name: 'North East', seats: 29, winner: 'LAB', mayorName: 'Kim McGuinness' },
  { name: 'North West', seats: 73, winner: 'LAB', mayorName: 'Andy Burnham' },
  { name: 'Yorkshire and The Humber', seats: 54, winner: 'LAB', mayorName: 'Tracy Brabin' },
  { name: 'East Midlands', seats: 47, winner: 'LAB', mayorName: 'Claire Ward' },
  { name: 'West Midlands', seats: 57, winner: 'LAB', mayorName: 'Richard Parker' },
  { name: 'Eastern', seats: 61, winner: 'CON', mayorName: 'Peter Taylor' },
  { name: 'London', seats: 75, winner: 'LAB', mayorName: 'Sadiq Khan' },
  { name: 'South East', seats: 91, winner: 'CON', mayorName: 'Paul Marshall' },
  { name: 'South West', seats: 58, winner: 'LD', mayorName: 'Dan Norris' },
  { name: 'Scotland', seats: 57, winner: 'SNP', mayorName: 'John Swinney' },
  { name: 'Wales', seats: 32, winner: 'LAB', mayorName: 'Eluned Morgan' },
  { name: 'Northern Ireland', seats: 16, winner: 'LAB', mayorName: 'Michelle O\'Neill' }
];

const BRAZIL_SPEC = [
  { name: 'Acre', seats: 15, winner: 'PL', mayorName: 'Gladson Cameli' },
  { name: 'Alagoas', seats: 15, winner: 'PT', mayorName: 'Paulo Dantas' },
  { name: 'Amapá', seats: 15, winner: 'PL', mayorName: 'Clécio Luís' },
  { name: 'Amazonas', seats: 15, winner: 'UNIAO', mayorName: 'Wilson Lima' },
  { name: 'Bahia', seats: 15, winner: 'PT', mayorName: 'Jerônimo Rodrigues' },
  { name: 'Ceará', seats: 15, winner: 'PT', mayorName: 'Elmano de Freitas' },
  { name: 'Distrito Federal', seats: 15, winner: 'MDB', mayorName: 'Ibaneis Rocha' },
  { name: 'Espírito Santo', seats: 15, winner: 'PT', mayorName: 'Renato Casagrande' },
  { name: 'Goiás', seats: 15, winner: 'UNIAO', mayorName: 'Ronaldo Caiado' },
  { name: 'Maranhão', seats: 15, winner: 'PT', mayorName: 'Carlos Brandão' },
  { name: 'Mato Grosso', seats: 15, winner: 'UNIAO', mayorName: 'Mauro Mendes' },
  { name: 'Mato Grosso do Sul', seats: 15, winner: 'PL', mayorName: 'Eduardo Riedel' },
  { name: 'Minas Gerais', seats: 15, winner: 'PL', mayorName: 'Romeu Zema' },
  { name: 'Pará', seats: 15, winner: 'MDB', mayorName: 'Helder Barbalho' },
  { name: 'Paraíba', seats: 15, winner: 'PT', mayorName: 'João Azevêdo' },
  { name: 'Paraná', seats: 15, winner: 'PSD', mayorName: 'Ratinho Júnior' },
  { name: 'Pernambuco', seats: 15, winner: 'PT', mayorName: 'Raquel Lyra' },
  { name: 'Piauí', seats: 15, winner: 'PT', mayorName: 'Rafael Fonteles' },
  { name: 'Rio de Janeiro', seats: 15, winner: 'PL', mayorName: 'Cláudio Castro' },
  { name: 'Rio Grande do Norte', seats: 15, winner: 'PT', mayorName: 'Fátima Bezerra' },
  { name: 'Rio Grande do Sul', seats: 15, winner: 'PT', mayorName: 'Eduardo Leite' },
  { name: 'Rondônia', seats: 15, winner: 'UNIAO', mayorName: 'Marcos Rocha' },
  { name: 'Roraima', seats: 15, winner: 'PP', mayorName: 'Antonio Denarium' },
  { name: 'Santa Catarina', seats: 15, winner: 'PL', mayorName: 'Jorginho Mello' },
  { name: 'São Paulo', seats: 15, winner: 'PL', mayorName: 'Tarcísio de Freitas' },
  { name: 'Sergipe', seats: 15, winner: 'PSD', mayorName: 'Fábio Mitidieri' },
  { name: 'Tocantins', seats: 15, winner: 'PL', mayorName: 'Wanderlei Barbosa' }
];

const JAPAN_SPEC = [
  { name: 'Aichi', seats: 10, winner: 'LDP', mayorName: 'Hideaki Omura' },
  { name: 'Akita', seats: 10, winner: 'LDP', mayorName: 'Norihisa Satake' },
  { name: 'Aomori', seats: 10, winner: 'LDP', mayorName: 'Soichiro Miyashita' },
  { name: 'Chiba', seats: 10, winner: 'LDP', mayorName: 'Toshihito Kumagai' },
  { name: 'Ehime', seats: 10, winner: 'LDP', mayorName: 'Tokihiro Nakamura' },
  { name: 'Fukui', seats: 10, winner: 'LDP', mayorName: 'Tatsuji Sugimoto' },
  { name: 'Fukuoka', seats: 10, winner: 'LDP', mayorName: 'Seitaro Hattori' },
  { name: 'Fukushima', seats: 10, winner: 'LDP', mayorName: 'Masao Uchibori' },
  { name: 'Gifu', seats: 10, winner: 'LDP', mayorName: 'Hajime Furuta' },
  { name: 'Gunma', seats: 10, winner: 'LDP', mayorName: 'Ichita Yamamoto' },
  { name: 'Hiroshima', seats: 10, winner: 'LDP', mayorName: 'Hidehiko Yuzaki' },
  { name: 'Hokkaido', seats: 10, winner: 'CDP', mayorName: 'Naomichi Suzuki' },
  { name: 'Hyogo', seats: 10, winner: 'ISHIN', mayorName: 'Motohiko Saito' },
  { name: 'Ibaraki', seats: 10, winner: 'LDP', mayorName: 'Kazuhiko Oigawa' },
  { name: 'Ishikawa', seats: 10, winner: 'LDP', mayorName: 'Hiroshi Hase' },
  { name: 'Iwate', seats: 10, winner: 'CDP', mayorName: 'Takuya Tasso' },
  { name: 'Kagawa', seats: 10, winner: 'LDP', mayorName: 'Toyohito Ikeda' },
  { name: 'Kagoshima', seats: 10, winner: 'LDP', mayorName: 'Koichi Shiota' },
  { name: 'Kanagawa', seats: 10, winner: 'LDP', mayorName: 'Yuji Kuroiwa' },
  { name: 'Kochi', seats: 10, winner: 'LDP', mayorName: 'Seiji Hamada' },
  { name: 'Kumamoto', seats: 10, winner: 'LDP', mayorName: 'Takashi Kimura' },
  { name: 'Kyoto', seats: 10, winner: 'LDP', mayorName: 'Takatoshi Nishiwaki' },
  { name: 'Mie', seats: 10, winner: 'LDP', mayorName: 'Katsuyuki Ichimi' },
  { name: 'Miyagi', seats: 10, winner: 'LDP', mayorName: 'Yoshihiro Murai' },
  { name: 'Miyazaki', seats: 10, winner: 'LDP', mayorName: 'Shunji Kono' },
  { name: 'Nagano', seats: 10, winner: 'CDP', mayorName: 'Shuichi Abe' },
  { name: 'Nagasaki', seats: 10, winner: 'LDP', mayorName: 'Kengo Oishi' },
  { name: 'Nara', seats: 10, winner: 'LDP', mayorName: 'Makoto Yamashita' },
  { name: 'Niigata', seats: 10, winner: 'LDP', mayorName: 'Hideyo Hanazumi' },
  { name: 'Oita', seats: 10, winner: 'LDP', mayorName: 'Kiichiro Sato' },
  { name: 'Okayama', seats: 10, winner: 'LDP', mayorName: 'Ryuta Ibaragi' },
  { name: 'Okinawa', seats: 10, winner: 'CDP', mayorName: 'Denny Tamaki' },
  { name: 'Osaka', seats: 10, winner: 'ISHIN', mayorName: 'Hirofumi Yoshimura' },
  { name: 'Saga', seats: 10, winner: 'LDP', mayorName: 'Yoshinori Yamaguchi' },
  { name: 'Saitama', seats: 10, winner: 'LDP', mayorName: 'Motohiro Ono' },
  { name: 'Shiga', seats: 10, winner: 'LDP', mayorName: 'Taizo Mikazuki' },
  { name: 'Shimane', seats: 10, winner: 'LDP', mayorName: 'Tatsuya Maruyama' },
  { name: 'Shizuoka', seats: 10, winner: 'LDP', mayorName: 'Yasutomo Suzuki' },
  { name: 'Tochigi', seats: 10, winner: 'LDP', mayorName: 'Tomikazu Fukuda' },
  { name: 'Tokushima', seats: 10, winner: 'LDP', mayorName: 'Masazumi Gotoda' },
  { name: 'Tokyo', seats: 10, winner: 'LDP', mayorName: 'Yuriko Koike' },
  { name: 'Tottori', seats: 10, winner: 'LDP', mayorName: 'Shinji Hirai' },
  { name: 'Toyama', seats: 10, winner: 'LDP', mayorName: 'Hachiro Nitta' },
  { name: 'Wakayama', seats: 10, winner: 'LDP', mayorName: 'Shuhei Kishimoto' },
  { name: 'Yamagata', seats: 10, winner: 'LDP', mayorName: 'Mieko Yoshimura' },
  { name: 'Yamaguchi', seats: 10, winner: 'LDP', mayorName: 'Tsugumasa Muraoka' },
  { name: 'Yamanashi', seats: 10, winner: 'LDP', mayorName: 'Kotaro Nagasaki' }
];

const EGYPT_SPEC = [
  { name: 'Alexandria', seats: 20, winner: 'NFP', mayorName: 'Mohamed Taher Al-Sherif' },
  { name: 'Aswan', seats: 20, winner: 'NFP', mayorName: 'Ashraf Attia' },
  { name: 'Asyut', seats: 20, winner: 'NFP', mayorName: 'Essam Saad' },
  { name: 'Beheira', seats: 20, winner: 'NFP', mayorName: 'Hisham Amna' },
  { name: 'Beni Suef', seats: 20, winner: 'NFP', mayorName: 'Mohamed Hany Ghoneim' },
  { name: 'Cairo', seats: 20, winner: 'NFP', mayorName: 'Khaled Abdel Aal' },
  { name: 'Dakahlia', seats: 20, winner: 'NFP', mayorName: 'Ayman Mokhtar' },
  { name: 'Damietta', seats: 20, winner: 'NFP', mayorName: 'Manal Awad Mikhail' },
  { name: 'Faiyum', seats: 20, winner: 'NFP', mayorName: 'Ahmed Al-Ansari' },
  { name: 'Gharbia', seats: 20, winner: 'NFP', mayorName: 'Tarek Rahmy' },
  { name: 'Giza', seats: 20, winner: 'NFP', mayorName: 'Ahmed Rashed' },
  { name: 'Ismailia', seats: 20, winner: 'NFP', mayorName: 'Sherif Fahmy Bishara' },
  { name: 'Kafr El Sheikh', seats: 20, winner: 'NFP', mayorName: 'Gamal Nour El-Din' },
  { name: 'Luxor', seats: 20, winner: 'NFP', mayorName: 'Mustafa Al-Alham' },
  { name: 'Matrouh', seats: 20, winner: 'NFP', mayorName: 'Khaled Shoaib' },
  { name: 'Minya', seats: 20, winner: 'NFP', mayorName: 'Osama Al-Qady' },
  { name: 'Monufia', seats: 20, winner: 'NFP', mayorName: 'Ibrahim Abu Limon' },
  { name: 'New Valley', seats: 20, winner: 'NFP', mayorName: 'Mohamed Al-Zamlout' },
  { name: 'North Sinai', seats: 20, winner: 'NFP', mayorName: 'Mohamed Shousha' },
  { name: 'Port Said', seats: 20, winner: 'NFP', mayorName: 'Adel Ghadban' },
  { name: 'Qalyubia', seats: 20, winner: 'NFP', mayorName: 'Abdel Hamid El-Haggan' },
  { name: 'Qena', seats: 20, winner: 'NFP', mayorName: 'Ashraf Daoudi' },
  { name: 'Red Sea', seats: 20, winner: 'NFP', mayorName: 'Amr Hanafy' },
  { name: 'Sharqia', seats: 20, winner: 'NFP', mayorName: 'Mamdouh Ghorab' },
  { name: 'Sohag', seats: 20, winner: 'NFP', mayorName: 'Tarek El-Feki' },
  { name: 'South Sinai', seats: 20, winner: 'NFP', mayorName: 'Khaled Fouda' },
  { name: 'Suez', seats: 20, winner: 'NFP', mayorName: 'Abdel Majeed Saqr' }
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
export const getFranceRegions = () => generateRegionsFromSpec('FR', FRANCE_SPEC, ['RE', 'RN', 'LFI', 'PS'], { RE: 25, RN: 30, LFI: 15, PS: 15 });
export const getRomaniaRegions = () => generateRegionsFromSpec('RO', ROMANIA_SPEC, ['PSD', 'PNL', 'AUR', 'USR'], { PSD: 30, PNL: 20, AUR: 20, USR: 15 });
export const getHungaryRegions = () => generateRegionsFromSpec('HU', HUNGARY_SPEC, ['FIDESZ', 'TISZA', 'DK', 'MHM'], { FIDESZ: 45, TISZA: 30, DK: 8, MHM: 6 });
export const getUKRegions = () => generateRegionsFromSpec('GB', UK_SPEC, ['LAB', 'CON', 'REF', 'LD', 'GRN', 'SNP'], { LAB: 36, CON: 25, REF: 14, LD: 12, GRN: 6, SNP: 3 });
export const getBrazilRegions = () => generateRegionsFromSpec('BR', BRAZIL_SPEC, ['PT', 'PL', 'UNIAO', 'MDB', 'PSD', 'PP'], { PT: 30, PL: 30, UNIAO: 15, MDB: 11, PSD: 10, PP: 5 });
export const getJapanRegions = () => generateRegionsFromSpec('JP', JAPAN_SPEC, ['LDP', 'CDP', 'KOMEITO', 'ISHIN', 'DPFP', 'JCP'], { LDP: 35, CDP: 22, KOMEITO: 10, ISHIN: 10, DPFP: 8, JCP: 6 });
export const getEgyptRegions = () => generateRegionsFromSpec('EG', EGYPT_SPEC, ['NFP', 'RPP', 'WAFD', 'HDP', 'MEP', 'ESDP'], { NFP: 55, RPP: 12, WAFD: 8, HDP: 8, MEP: 5, ESDP: 3 });

const RUSSIA_SPEC = [
  { name: 'Altai Krai', seats: 4, winner: 'LDPR', mayorName: 'Governor of Altai Krai' },
  { name: 'Republic of Mordovia', seats: 4, winner: 'UR', mayorName: 'Governor of Mordovia' },
  { name: 'Tula Oblast', seats: 4, winner: 'UR', mayorName: 'Governor of Tula Oblast' },
  { name: 'Kurgan Oblast', seats: 4, winner: 'LDPR', mayorName: 'Governor of Kurgan Oblast' },
  { name: 'Ingushetia', seats: 4, winner: 'UR', mayorName: 'Governor of Ingushetia' },
  { name: 'Khanty-Mansiysk Autonomous Okrug – Ugra', seats: 4, winner: 'UR', mayorName: 'Governor of Ugra' },
  { name: 'Kirov Oblast', seats: 4, winner: 'CPRF', mayorName: 'Governor of Kirov Oblast' },
  { name: 'Komi Republic', seats: 4, winner: 'UR', mayorName: 'Governor of Komi Republic' },
  { name: 'Kostroma Oblast', seats: 4, winner: 'CPRF', mayorName: 'Governor of Kostroma Oblast' },
  { name: 'Krasnoyarsk Krai', seats: 8, winner: 'UR', mayorName: 'Mikhail Kotyukov' },
  { name: 'Zabaykalsky Krai', seats: 4, winner: 'LDPR', mayorName: 'Governor of Zabaykalsky Krai' },
  { name: 'Sverdlovsk Oblast', seats: 11, winner: 'UR', mayorName: 'Yevgeny Kuyvashev' },
  { name: 'Volgograd Oblast', seats: 7, winner: 'UR', mayorName: 'Andrey Bocharov' },
  { name: 'Irkutsk Oblast', seats: 6, winner: 'CPRF', mayorName: 'Igor Kobzev' },
  { name: 'Perm Krai', seats: 7, winner: 'UR', mayorName: 'Dmitry Makhonin' },
  { name: 'Pskov Oblast', seats: 4, winner: 'CPRF', mayorName: 'Governor of Pskov Oblast' },
  { name: 'Rostov Oblast', seats: 11, winner: 'UR', mayorName: 'Vasily Golubev' },
  { name: 'Ryazan Oblast', seats: 4, winner: 'UR', mayorName: 'Governor of Ryazan Oblast' },
  { name: 'Adygea', seats: 4, winner: 'UR', mayorName: 'Governor of Adygea' },
  { name: 'Samara Oblast', seats: 9, winner: 'UR', mayorName: 'Vyacheslav Fedorishchev' },
  { name: 'Khakassia', seats: 4, winner: 'UR', mayorName: 'Governor of Khakassia' },
  { name: 'Tambov Oblast', seats: 4, winner: 'LDPR', mayorName: 'Governor of Tambov Oblast' },
  { name: 'Tatarstan', seats: 13, winner: 'UR', mayorName: 'Rustam Minnikhanov' },
  { name: 'Tomsk Oblast', seats: 4, winner: 'LDPR', mayorName: 'Governor of Tomsk Oblast' },
  { name: 'Nizhny Novgorod Oblast', seats: 10, winner: 'UR', mayorName: 'Gleb Nikitin' },
  { name: 'Republic of Karelia', seats: 4, winner: 'UR', mayorName: 'Governor of Republic of Karelia' },
  { name: 'Arkhangelsk Oblast', seats: 4, winner: 'CPRF', mayorName: 'Governor of Arkhangelsk Oblast' },
  { name: 'Astrakhan Oblast', seats: 4, winner: 'CPRF', mayorName: 'Governor of Astrakhan Oblast' },
  { name: 'Belgorod Oblast', seats: 4, winner: 'UR', mayorName: 'Governor of Belgorod Oblast' },
  { name: 'Bryansk Oblast', seats: 4, winner: 'UR', mayorName: 'Governor of Bryansk Oblast' },
  { name: 'Buryatia', seats: 4, winner: 'UR', mayorName: 'Governor of Buryatia' },
  { name: 'Chechnya', seats: 5, winner: 'UR', mayorName: 'Ramzan Kadyrov' },
  { name: 'Chelyabinsk Oblast', seats: 9, winner: 'UR', mayorName: 'Aleksey Teksler' },
  { name: 'Chuvashia', seats: 4, winner: 'UR', mayorName: 'Governor of Chuvashia' },
  { name: 'Tyumen Oblast', seats: 3, winner: 'LDPR', mayorName: 'Governor of Tyumen Oblast' },
  { name: 'North Ossetia–Alania', seats: 3, winner: 'UR', mayorName: 'Governor of North Ossetia' },
  { name: 'Penza Oblast', seats: 3, winner: 'CPRF', mayorName: 'Governor of Penza Oblast' },
  { name: 'Amur Oblast', seats: 3, winner: 'CPRF', mayorName: 'Governor of Amur Oblast' },
  { name: 'Kabardino-Balkaria', seats: 3, winner: 'UR', mayorName: 'Governor of Kabardino-Balkaria' },
  { name: 'Krasnodar Krai', seats: 14, winner: 'UR', mayorName: 'Veniamin Kondratyev' },
  { name: 'Kursk Oblast', seats: 3, winner: 'CPRF', mayorName: 'Governor of Kursk Oblast' },
  { name: 'Leningrad oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Leningrad oblast' },
  { name: 'Mari El', seats: 3, winner: 'LDPR', mayorName: 'Governor of Mari El' },
  { name: 'Moscow', seats: 35, winner: 'UR', mayorName: 'Sergey Sobyanin' },
  { name: 'Moscow Oblast', seats: 18, winner: 'UR', mayorName: 'Andrey Vorobyov' },
  { name: 'Murmansk Oblast', seats: 3, winner: 'LDPR', mayorName: 'Governor of Murmansk Oblast' },
  { name: 'Nenets Autonomous Okrug', seats: 3, winner: 'UR', mayorName: 'Governor of Nenets Okrug' },
  { name: 'Novgorod Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Novgorod Oblast' },
  { name: 'Novosibirsk Oblast', seats: 8, winner: 'CPRF', mayorName: 'Andrey Travnikov' },
  { name: 'Omsk Oblast', seats: 6, winner: 'CPRF', mayorName: 'Vitaly Khotsenko' },
  { name: 'Oryol Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Oryol Oblast' },
  { name: 'Saint Petersburg', seats: 20, winner: 'UR', mayorName: 'Alexander Beglov' },
  { name: 'Sakhalin Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Sakhalin Oblast' },
  { name: 'Sakha Republic', seats: 3, winner: 'UR', mayorName: 'Governor of Sakha Republic' },
  { name: 'Saratov Oblast', seats: 7, winner: 'UR', mayorName: 'Roman Busargin' },
  { name: 'Smolensk Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Smolensk Oblast' },
  { name: 'Stavropol Krai', seats: 3, winner: 'LDPR', mayorName: 'Governor of Stavropol Krai' },
  { name: 'Tuva', seats: 3, winner: 'LDPR', mayorName: 'Governor of Tuva' },
  { name: 'Tver Oblast', seats: 3, winner: 'LDPR', mayorName: 'Governor of Tver Oblast' },
  { name: 'Udmurtia', seats: 3, winner: 'UR', mayorName: 'Governor of Udmurtia' },
  { name: 'Kaluga Oblast', seats: 3, winner: 'CPRF', mayorName: 'Governor of Kaluga Oblast' },
  { name: 'Lipetsk Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Lipetsk Oblast' },
  { name: 'Magadan Oblast', seats: 3, winner: 'LDPR', mayorName: 'Governor of Magadan Oblast' },
  { name: 'Ulyanovsk Oblast', seats: 3, winner: 'CPRF', mayorName: 'Governor of Ulyanovsk Oblast' },
  { name: 'Vladimir Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Vladimir Oblast' },
  { name: 'Vologda Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Vologda Oblast' },
  { name: 'Yaroslavl Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Yaroslavl Oblast' },
  { name: 'Voronezh Oblast', seats: 7, winner: 'UR', mayorName: 'Aleksandr Gusev' },
  { name: 'Yamalo-Nenets Autonomous Okrug', seats: 3, winner: 'UR', mayorName: 'Governor of Yamalo-Nenets' },
  { name: 'Altai Republic', seats: 3, winner: 'UR', mayorName: 'Governor of Altai Republic' },
  { name: 'Ivanovo Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Ivanovo Oblast' },
  { name: 'Jewish Autonomous Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Jewish Okrug' },
  { name: 'Kalmykia', seats: 3, winner: 'UR', mayorName: 'Governor of Kalmykia' },
  { name: 'Kamchatka Krai', seats: 3, winner: 'LDPR', mayorName: 'Governor of Kamchatka Krai' },
  { name: 'Karachay-Cherkessia', seats: 3, winner: 'UR', mayorName: 'Governor of Karachay-Cherkessia' },
  { name: 'Kemerovo Oblast', seats: 7, winner: 'UR', mayorName: 'Ilya Seredyuk' },
  { name: 'Khabarovsk Krai', seats: 6, winner: 'LDPR', mayorName: 'Dmitry Demeshin' },
  { name: 'Chukotka Autonomous Okrug', seats: 3, winner: 'UR', mayorName: 'Governor of Chukotka' },
  { name: 'Dagestan', seats: 8, winner: 'UR', mayorName: 'Sergey Melikov' },
  { name: 'Kaliningrad', seats: 3, winner: 'UR', mayorName: 'Governor of Kaliningrad' },
  { name: 'Orenburg Oblast', seats: 3, winner: 'UR', mayorName: 'Governor of Orenburg Oblast' },
  { name: 'Primorsky Krai', seats: 6, winner: 'UR', mayorName: 'Oleg Kozhemyako' },
  { name: 'Bashkortostan', seats: 12, winner: 'UR', mayorName: 'Radiy Khabirov' }
];

export const getRussiaRegions = () => generateRegionsFromSpec('RU', RUSSIA_SPEC, ['UR', 'CPRF', 'LDPR', 'SRZP', 'NL', 'YABLOKO'], { UR: 46, CPRF: 17, LDPR: 13, SRZP: 9, NL: 9, YABLOKO: 6 });

const CHILE_SPEC = [
  { name: 'Metropolitana de Santiago', seats: 47, winner: 'FA', mayorName: 'Claudio Orrego' },
  { name: 'Valparaiso', seats: 16, winner: 'FA', mayorName: 'Rodrigo Mundaca' },
  { name: 'Biobio', seats: 13, winner: 'REP', mayorName: 'Rodrigo Diaz' },
  { name: 'Maule', seats: 11, winner: 'REP', mayorName: 'Cristina Bravo' },
  { name: 'Araucania', seats: 11, winner: 'UDI', mayorName: 'Luciano Rivas' },
  { name: 'Libertador Bernardo O\'Higgins', seats: 9, winner: 'PS', mayorName: 'Pablo Silva' },
  { name: 'Los Lagos', seats: 9, winner: 'UDI', mayorName: 'Patricio Vallespin' },
  { name: 'Antofagasta', seats: 8, winner: 'REP', mayorName: 'Ricardo Diaz' },
  { name: 'Coquimbo', seats: 7, winner: 'FA', mayorName: 'Krist Naranjo' },
  { name: 'Los Rios', seats: 5, winner: 'PS', mayorName: 'Luis Cuvertino' },
  { name: 'Tarapaca', seats: 4, winner: 'REP', mayorName: 'Jose Miguel Carvajal' },
  { name: 'Atacama', seats: 4, winner: 'PS', mayorName: 'Miguel Vargas' },
  { name: 'Nuble', seats: 4, winner: 'UDI', mayorName: 'Oscar Crisostomo' },
  { name: 'Arica y Parinacota', seats: 3, winner: 'REP', mayorName: 'Jorge Diaz' },
  { name: 'Magallanes', seats: 3, winner: 'PS', mayorName: 'Jorge Flies' },
  { name: 'Aysen', seats: 2, winner: 'UDI', mayorName: 'Andrea Macias' }
];
export const getChileRegions = () => generateRegionsFromSpec('CL', CHILE_SPEC, ['FA', 'REP', 'UDI', 'PS', 'EVO'], { FA: 28, REP: 27, UDI: 22, PS: 14, EVO: 9 });

const ICELAND_SPEC = [
  { name: 'Capital Region', seats: 25, winner: 'SDA', mayorName: 'Dagur B. Eggertsson' },
  { name: 'Southern Peninsula', seats: 7, winner: 'IP', mayorName: 'Kjartan Mar Kjartansson' },
  { name: 'Western Region', seats: 6, winner: 'IP', mayorName: 'Rosa Gudbjartsdottir' },
  { name: 'Westfjords', seats: 4, winner: 'CP', mayorName: 'Asthildur Sturludottir' },
  { name: 'Northwestern Region', seats: 5, winner: 'CP', mayorName: 'Halla Signy Kristjansdottir' },
  { name: 'Northeastern Region', seats: 7, winner: 'PP', mayorName: 'Einar Thorsteinsson' },
  { name: 'Eastern Region', seats: 3, winner: 'PP', mayorName: 'Bjarni Benediktsson' },
  { name: 'Southern Region', seats: 6, winner: 'IP', mayorName: 'Fannar Jonasson' }
];
export const getIcelandRegions = () => generateRegionsFromSpec('IS', ICELAND_SPEC, ['SDA', 'IP', 'CP', 'PP', 'LGM', 'PIR'], { SDA: 30, IP: 22, CP: 18, PP: 12, LGM: 9, PIR: 9 });

const PORTUGAL_SPEC = [
  { name: 'Lisboa', seats: 50, winner: 'PS', mayorName: 'Carlos Moedas' },
  { name: 'Porto', seats: 41, winner: 'PSD', mayorName: 'Rui Moreira' },
  { name: 'Braga', seats: 19, winner: 'PSD', mayorName: 'Ricardo Rio' },
  { name: 'Setubal', seats: 19, winner: 'PS', mayorName: 'Andre Martins' },
  { name: 'Aveiro', seats: 16, winner: 'PSD', mayorName: 'Ribau Esteves' },
  { name: 'Leiria', seats: 10, winner: 'PSD', mayorName: 'Goncalo Lopes' },
  { name: 'Santarem', seats: 9, winner: 'CH', mayorName: 'Ricardo Goncalves' },
  { name: 'Coimbra', seats: 9, winner: 'PS', mayorName: 'Jose Manuel Silva' },
  { name: 'Faro', seats: 9, winner: 'CH', mayorName: 'Rogerio Bacalhau' },
  { name: 'Viseu', seats: 8, winner: 'PSD', mayorName: 'Fernando Ruas' },
  { name: 'Viana do Castelo', seats: 6, winner: 'PSD', mayorName: 'Luis Nobre' },
  { name: 'Vila Real', seats: 5, winner: 'PSD', mayorName: 'Rui Santos' },
  { name: 'Castelo Branco', seats: 4, winner: 'PS', mayorName: 'Leopoldo Rodrigues' },
  { name: 'Guarda', seats: 3, winner: 'PSD', mayorName: 'Sergio Costa' },
  { name: 'Evora', seats: 3, winner: 'PS', mayorName: 'Carlos Pinto de Sa' },
  { name: 'Beja', seats: 3, winner: 'PCP', mayorName: 'Paulo Arsenio' },
  { name: 'Braganca', seats: 3, winner: 'PSD', mayorName: 'Hernani Dias' },
  { name: 'Portalegre', seats: 2, winner: 'PSD', mayorName: 'Fermin Ferreira' },
  { name: 'Azores', seats: 5, winner: 'PSD', mayorName: 'Jose Manuel Bolieiro' },
  { name: 'Madeira', seats: 6, winner: 'PSD', mayorName: 'Miguel Albuquerque' }
];
export const getPortugalRegions = () => generateRegionsFromSpec('PT', PORTUGAL_SPEC, ['PSD', 'PS', 'CH', 'IL', 'BE', 'PCP'], { PSD: 31, PS: 29, CH: 19, IL: 8, BE: 7, PCP: 6 });

const GREECE_SPEC = [
  { name: 'Attica (Athens & Piraeus)', seats: 110, winner: 'ND', mayorName: 'Haris Doukas' },
  { name: 'Central Macedonia (Thessaloniki)', seats: 45, winner: 'ND', mayorName: 'Stelios Angeloudis' },
  { name: 'Western Greece & Peloponnese', seats: 35, winner: 'PASOK', mayorName: 'Kostas Peletidis' },
  { name: 'Crete (Heraklion & Chania)', seats: 24, winner: 'PASOK', mayorName: 'Alexis Kalokairinos' },
  { name: 'Thessaly & Central Greece', seats: 30, winner: 'ND', mayorName: 'Dimitrios Kouretas' },
  { name: 'Epirus & Western Macedonia', seats: 20, winner: 'ND', mayorName: 'Alexandros Kachrimanis' },
  { name: 'Aegean & Ionian Islands', seats: 26, winner: 'ND', mayorName: 'Kostas Moutzouris' }
];
export const getGreeceRegions = () => generateRegionsFromSpec('GR', GREECE_SPEC, ['ND', 'PASOK', 'SYRIZA', 'KKE', 'EL', 'NIKI'], { ND: 38, PASOK: 22, SYRIZA: 14, KKE: 10, EL: 10, NIKI: 6 });

const POLAND_2026_SPEC = [
  { name: 'Mazowieckie (Warszawa)', seats: 63, winner: 'KO', mayorName: 'Rafał Trzaskowski' },
  { name: 'Śląskie (Katowice & Silesia)', seats: 55, winner: 'KO', mayorName: 'Marcin Krupa' },
  { name: 'Wielkopolskie (Poznań)', seats: 40, winner: 'KO', mayorName: 'Jacek Jaśkowiak' },
  { name: 'Małopolskie (Kraków)', seats: 41, winner: 'PIS', mayorName: 'Aleksander Miszalski' },
  { name: 'Dolnośląskie (Wrocław)', seats: 34, winner: 'KO', mayorName: 'Jacek Sutryk' },
  { name: 'Łódzkie (Łódź)', seats: 31, winner: 'KO', mayorName: 'Hanna Zdanowska' },
  { name: 'Pomorskie (Gdańsk & Coast)', seats: 26, winner: 'KO', mayorName: 'Aleksandra Dulkiewicz' },
  { name: 'Lubelskie (Lublin)', seats: 27, winner: 'PIS', mayorName: 'Krzysztof Żuk' },
  { name: 'Podkarpackie (Rzeszów)', seats: 26, winner: 'PIS', mayorName: 'Konrad Fijołek' },
  { name: 'Kujawsko-Pomorskie (Bydgoszcz)', seats: 24, winner: 'KO', mayorName: 'Rafał Bruski' },
  { name: 'Zachodniopomorskie (Szczecin)', seats: 20, winner: 'KO', mayorName: 'Piotr Krzystek' },
  { name: 'Świętokrzyskie & Opole', seats: 23, winner: 'PIS', mayorName: 'Agata Wojda' },
  { name: 'Podlaskie & Warmia-Mazury', seats: 30, winner: 'PIS', mayorName: 'Tadeusz Truskolaski' }
];
export const getPolandRegions2026 = () => generateRegionsFromSpec('PL', POLAND_2026_SPEC, ['KO', 'PIS', 'TD', 'LEW', 'KON', 'RAZ'], { KO: 35, PIS: 32, TD: 13, LEW: 9, KON: 8, RAZ: 3 });

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

export const countryColors: Record<string, { default: string; completed: string; selected: string }> = {
  TR: { default: '#991b1b', completed: '#dc2626', selected: '#f87171' }, // Turkey
  US: { default: '#1d4ed8', completed: '#3b82f6', selected: '#60a5fa' }, // USA
  BR: { default: '#15803d', completed: '#22c55e', selected: '#4ade80' }, // Brazil
  DE: { default: '#0f172a', completed: '#1e293b', selected: '#334155' }, // Germany / West Germany (Dark Charcoal/Slate)
  DDR: { default: '#991b1b', completed: '#b91c1c', selected: '#ef4444' }, // East Germany
  SU: { default: '#b91c1c', completed: '#dc2626', selected: '#ef4444' }, // Soviet Union (Red)
  CS: { default: '#c2410c', completed: '#ea580c', selected: '#fb923c' }, // Czechoslovakia
  PL: { default: '#be123c', completed: '#e11d48', selected: '#fb7185' }, // Poland
  CN: { default: '#dc2626', completed: '#ef4444', selected: '#fca5a5' }, // China
  YU: { default: '#0284c7', completed: '#0ea5e9', selected: '#38bdf8' }, // Yugoslavia
  TW: { default: '#0284c7', completed: '#2563eb', selected: '#60a5fa' }, // Taiwan
  GB: { default: '#0e7490', completed: '#06b6d4', selected: '#22d3ee' }, // UK
  EG: { default: '#b45309', completed: '#f59e0b', selected: '#fbc02d' }, // Egypt
  JP: { default: '#be1c5a', completed: '#ec4899', selected: '#f472b6' },
  CA: { default: '#991b1b', completed: '#dc2626', selected: '#f87171' },
  AR: { default: '#1e3a8a', completed: '#3b82f6', selected: '#93c5fd' },
  ZA: { default: '#166534', completed: '#22c55e', selected: '#86efac' },
  IN: { default: '#c2410c', completed: '#ea580c', selected: '#fb923c' },
  IT: { default: '#15803d', completed: '#16a34a', selected: '#4ade80' },
  ID: { default: '#b91c1c', completed: '#ef4444', selected: '#f87171' },
  MX: { default: '#064e3b', completed: '#059669', selected: '#34d399' },
  ES: { default: '#b45309', completed: '#d97706', selected: '#fbbf24' },
  KR: { default: '#1d4ed8', completed: '#2563eb', selected: '#60a5fa' },
  AU: { default: '#0c4a6e', completed: '#0284c7', selected: '#38bdf8' },
  FR: { default: '#1e40af', completed: '#2563eb', selected: '#60a5fa' },
  RO: { default: '#d97706', completed: '#f59e0b', selected: '#fbbf24' },
  HU: { default: '#047857', completed: '#10b981', selected: '#34d399' },
  RU: { default: '#1e3a8a', completed: '#2563eb', selected: '#60a5fa' },
  CL: { default: '#b91c1c', completed: '#dc2626', selected: '#f87171' },
  IS: { default: '#0284c7', completed: '#0ea5e9', selected: '#38bdf8' },
  PT: { default: '#15803d', completed: '#16a34a', selected: '#4ade80' },
  GR: { default: '#0369a1', completed: '#0284c7', selected: '#38bdf8' }
};

export const PLAYABLE_COUNTRIES: Country[] = [
  {
    id: 'FR',
    name: 'France',
    description: 'A major European power with a semi-presidential system.',
    flag: '🇫🇷',
    seats: 577,
    parliamentName: 'National Assembly',
    system: 'Semi-Presidential',
    population: '68 Million',
    primaryColor: '#002654',
    rivals: [
      { id: 'RE', name: 'Renaissance', leader: 'Emmanuel Macron', ideology: 'Centrist', symbol: 'Globe', color: '#facc15', baseSupport: 25 },
      { id: 'RN', name: 'National Rally', leader: 'Marine Le Pen', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#1e40af', baseSupport: 30 },
      { id: 'LFI', name: 'France Unbowed', leader: 'Jean-Luc Mélenchon', ideology: 'Socialist', symbol: 'Sparkles', color: '#ef4444', baseSupport: 15 },
      { id: 'PS', name: 'Socialist Party', leader: 'Olivier Faure', ideology: 'Social Democrat', symbol: 'Heart', color: '#ec4899', baseSupport: 15 }
    ],
    regions: getFranceRegions(),
    bills: createBills('FR'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'RO',
    name: 'Romania',
    description: 'A rapidly developing Eastern European country.',
    flag: '🇷🇴',
    seats: 330,
    parliamentName: 'Chamber of Deputies',
    system: 'Semi-Presidential',
    population: '19 Million',
    primaryColor: '#fcd116',
    rivals: [
      { id: 'PSD', name: 'Social Democratic Party', leader: 'Marcel Ciolacu', ideology: 'Social Democrat', symbol: 'Heart', color: '#dc2626', baseSupport: 30 },
      { id: 'PNL', name: 'National Liberal Party', leader: 'Nicolae Ciucă', ideology: 'Conservative', symbol: 'Building', color: '#facc15', baseSupport: 20 },
      { id: 'AUR', name: 'Alliance for the Union', leader: 'George Simion', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#000000', baseSupport: 20 },
      { id: 'USR', name: 'Save Romania Union', leader: 'Elena Lasconi', ideology: 'Liberal', symbol: 'Globe', color: '#3b82f6', baseSupport: 15 }
    ],
    regions: getRomaniaRegions(),
    bills: createBills('RO'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'HU',
    name: 'Hungary',
    description: 'A Central European nation characterized by strong conservative policies.',
    flag: '🇭🇺',
    seats: 199,
    parliamentName: 'National Assembly',
    system: 'Parliamentary Republic',
    population: '9.6 Million',
    primaryColor: '#437a46',
    rivals: [
      { id: 'FIDESZ', name: 'Fidesz', leader: 'Viktor Orbán', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#ea580c', baseSupport: 45 },
      { id: 'TISZA', name: 'Tisza Party', leader: 'Péter Magyar', ideology: 'Centrist', symbol: 'Building', color: '#3b82f6', baseSupport: 30 },
      { id: 'DK', name: 'Democratic Coalition', leader: 'Ferenc Gyurcsány', ideology: 'Social Democrat', symbol: 'Globe', color: '#3b82f6', baseSupport: 8 },
      { id: 'MHM', name: 'Our Homeland', leader: 'László Toroczkai', ideology: 'Nationalist', symbol: 'Flame', color: '#166534', baseSupport: 6 }
    ],
    regions: getHungaryRegions(),
    bills: createBills('HU'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },

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
      { id: 'CHP', name: 'CHP', leader: 'Kemal Kılıçdaroğlu', ideology: 'Social Democrat', symbol: 'Flame', color: '#e30613', baseSupport: 17, photo: 'https://th.bing.com/th/id/OIP.qfT2hC6ZpM9kP1M_aYyNkwHaEK' },
      { id: 'YENI', name: 'Yeni Parti', leader: 'Özgür Özel', ideology: 'Social Democrat', symbol: 'Sun', color: '#0ea5e9', baseSupport: 20, photo: 'https://thf.bing.com/th/id/OIP.tw1bDleSary6Ua4NxPIuvgHaEK?w=292&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=' },
      { id: 'AKP', name: 'AK Parti', leader: 'Recep Tayyip Erdoğan', ideology: 'Conservative', symbol: 'Scale', color: '#ff9e1b', baseSupport: 31, photo: 'https://thf.bing.com/th/id/OIP.OSuQe5LJxNif6UcSy0D9YAHaE7?w=242&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'DEM', name: 'DEM Parti', leader: 'Tuncer Bakırhan', ideology: 'Socialist', symbol: 'Sparkles', color: '#8b5cf6', baseSupport: 9, photo: 'https://thf.bing.com/th/id/OIP.37I-MTcx4uo8vRif0r3DmgHaEO?w=278&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
      { id: 'MHP', name: 'MHP', leader: 'Devlet Bahçeli', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#991b1b', baseSupport: 9, photo: 'https://thf.bing.com/th/id/OIP.uKLHt8YQ5W_ghAlMr7TR7AHaEK?w=280&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3' },
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
    regions: getUKRegions(),
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
    regions: getBrazilRegions(),
    bills: createBills('BR'),
    campaignTurns: 48,
    electionCycleYears: 4,
    termLimit: 2,
  },
  {
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
    regions: getJapanRegions(),
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
    regions: getEgyptRegions(),
    bills: createBills('EG'),
    campaignTurns: 53,
    electionCycleYears: 5,
    termLimit: 2,
  },
  {
    id: 'RU',
    name: 'Russia',
    description: 'A vast transcontinental power with a presidential republic system and deep geopolitical influence across Eurasia.',
    flag: '🇷🇺',
    seats: 450,
    parliamentName: 'State Duma (Государственная Дума)',
    system: 'Presidential System',
    population: '144 Million',
    primaryColor: '#1e3a8a',
    rivals: [
      { id: 'UR', name: 'United Russia (Единая Россия)', leader: 'Dmitry Medvedev', ideology: 'Conservative', symbol: 'Building', color: '#0055A5', baseSupport: 46, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Dmitry_Medvedev_2024.jpg/250px-Dmitry_Medvedev_2024.jpg' },
      { id: 'CPRF', name: 'CPRF (КПРФ)', leader: 'Gennady Zyuganov', ideology: 'Communist', symbol: 'Star', color: '#D52B1E', baseSupport: 17, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Gennady_Zyuganov_2021.jpg/250px-Gennady_Zyuganov_2021.jpg' },
      { id: 'LDPR', name: 'LDPR (ЛДПР)', leader: 'Leonid Slutsky', ideology: 'Nationalist', symbol: 'Shield', color: '#0039A6', baseSupport: 13, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Leonid_Slutsky_2022.jpg/250px-Leonid_Slutsky_2022.jpg' },
      { id: 'SRZP', name: 'A Just Russia (Справедливая Россия)', leader: 'Sergey Mironov', ideology: 'Social Democrat', symbol: 'Users', color: '#FF7900', baseSupport: 9, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sergey_Mironov_2021.jpg/250px-Sergey_Mironov_2021.jpg' },
      { id: 'NL', name: 'New People (Новые люди)', leader: 'Alexey Nechayev', ideology: 'Liberal', symbol: 'Sparkles', color: '#00A896', baseSupport: 9, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Alexey_Nechayev_2021.jpg/250px-Alexey_Nechayev_2021.jpg' },
      { id: 'YABLOKO', name: 'Yabloko (Яблоко)', leader: 'Nikolay Rybakov', ideology: 'Social Democrat', symbol: 'Leaf', color: '#22C55E', baseSupport: 6, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Nikolay_Rybakov_2020.jpg/250px-Nikolay_Rybakov_2020.jpg' }
    ],
    regions: getRussiaRegions(),
    bills: createBills('RU'),
    campaignTurns: 53,
    electionCycleYears: 5,
    termLimit: 2,
  },
  {
    id: 'CL',
    name: 'Chile',
    description: 'A democratic republic with a strong presidential system situated between the Andes and the Pacific Ocean.',
    flag: '🇨🇱',
    seats: 155,
    parliamentName: 'Chamber of Deputies (Cámara de Diputadas y Diputados)',
    system: 'Presidential System',
    population: '19.5 Million',
    primaryColor: '#b91c1c',
    rivals: [
      { id: 'FA', name: 'Broad Front (Frente Amplio)', leader: 'Gabriel Boric', ideology: 'Social Democrat', symbol: 'Users', color: '#ef4444', baseSupport: 28, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Gabriel_Boric_2022.jpg/250px-Gabriel_Boric_2022.jpg' },
      { id: 'REP', name: 'Republican Party (Republicanos)', leader: 'José Antonio Kast', ideology: 'Nationalist', symbol: 'Shield', color: '#1e3a8a', baseSupport: 27, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Jos%C3%A9_Antonio_Kast_2021.jpg/250px-Jos%C3%A9_Antonio_Kast_2021.jpg' },
      { id: 'UDI', name: 'Chile Vamos (UDI & RN)', leader: 'Evelyn Matthei', ideology: 'Conservative', symbol: 'Building', color: '#0284c7', baseSupport: 22, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Evelyn_Matthei_2023.jpg/250px-Evelyn_Matthei_2023.jpg' },
      { id: 'PS', name: 'Socialist Party (PS)', leader: 'Paulina Vodanovic', ideology: 'Socialist', symbol: 'Flame', color: '#dc2626', baseSupport: 14, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Paulina_Vodanovic_2022.jpg/250px-Paulina_Vodanovic_2022.jpg' },
      { id: 'EVO', name: 'Political Evolution (Evópoli)', leader: 'Gloria Hutt', ideology: 'Liberal', symbol: 'Compass', color: '#f59e0b', baseSupport: 9, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gloria_Hutt_2022.jpg/250px-Gloria_Hutt_2022.jpg' }
    ],
    regions: getChileRegions(),
    bills: createBills('CL'),
    campaignTurns: 53,
    electionCycleYears: 4,
    termLimit: 2,
  },
  {
    id: 'IS',
    name: 'Iceland',
    description: 'The world oldest parliamentary democracy, nestled in the North Atlantic with vibrant social welfare and green energy systems.',
    flag: '🇮🇸',
    seats: 63,
    parliamentName: 'Althing (Alþingi)',
    system: 'Parliamentary Republic',
    population: '390 Thousand',
    primaryColor: '#0284c7',
    rivals: [
      { id: 'SDA', name: 'Social Democratic Alliance (Samfylkingin)', leader: 'Kristrún Frostadóttir', ideology: 'Social Democrat', symbol: 'Heart', color: '#dc2626', baseSupport: 30, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Kristr%C3%BAn_Frostad%C3%B3ttir.jpg/250px-Kristr%C3%BAn_Frostad%C3%B3ttir.jpg' },
      { id: 'IP', name: 'Independence Party (Sjálfstæðisflokkurinn)', leader: 'Bjarni Benediktsson', ideology: 'Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 22, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Bjarni_Benediktsson_2023.jpg/250px-Bjarni_Benediktsson_2023.jpg' },
      { id: 'CP', name: 'Centre Party (Miðflokkurinn)', leader: 'Sigmundur Davíð Gunnlaugsson', ideology: 'Nationalist', symbol: 'Shield', color: '#15803d', baseSupport: 18, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sigmundur_Dav%C3%AD%C3%B0_Gunnlaugsson.jpg/250px-Sigmundur_Dav%C3%AD%C3%B0_Gunnlaugsson.jpg' },
      { id: 'PP', name: 'Progressive Party (Framsóknarflokkurinn)', leader: 'Sigurður Ingi Jóhannsson', ideology: 'Liberal', symbol: 'Compass', color: '#059669', baseSupport: 12, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sigur%C3%B0ur_Ingi_J%C3%B3hannsson_2022.jpg/250px-Sigur%C3%B0ur_Ingi_J%C3%B3hannsson_2022.jpg' },
      { id: 'LGM', name: 'Left-Green Movement (Vinstri græn)', leader: 'Guðmundur Ingi Guðbrandsson', ideology: 'Socialist', symbol: 'Flame', color: '#16a34a', baseSupport: 9, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Gu%C3%B0mundur_Ingi_Gu%C3%B0brandsson.jpg/250px-Gu%C3%B0mundur_Ingi_Gu%C3%B0brandsson.jpg' },
      { id: 'PIR', name: 'Pirate Party (Píratar)', leader: 'Þórhildur Sunna Ævarsdóttir', ideology: 'Liberal', symbol: 'Sparkles', color: '#7c3aed', baseSupport: 9, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/%C3%9E%C3%B3rhildur_Sunna_%C3%86varsd%C3%B3ttir.jpg/250px-%C3%9E%C3%B3rhildur_Sunna_%C3%86varsd%C3%B3ttir.jpg' }
    ],
    regions: getIcelandRegions(),
    bills: createBills('IS'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'PT',
    name: 'Portugal',
    description: 'An Atlantic European democracy characterized by dynamic parliamentary coalitions and high renewable integration.',
    flag: '🇵🇹',
    seats: 230,
    parliamentName: 'Assembly of the Republic (Assembleia da República)',
    system: 'Semi-Presidential',
    population: '10.4 Million',
    primaryColor: '#15803d',
    rivals: [
      { id: 'PSD', name: 'Democratic Alliance (AD / PSD)', leader: 'Luís Montenegro', ideology: 'Conservative', symbol: 'Building', color: '#f97316', baseSupport: 31, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Lu%C3%ADs_Montenegro_2024.jpg/250px-Lu%C3%ADs_Montenegro_2024.jpg' },
      { id: 'PS', name: 'Socialist Party (PS)', leader: 'Pedro Nuno Santos', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 29, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Pedro_Nuno_Santos_2024.jpg/250px-Pedro_Nuno_Santos_2024.jpg' },
      { id: 'CH', name: 'CHEGA', leader: 'André Ventura', ideology: 'Nationalist', symbol: 'Shield', color: '#1e3a8a', baseSupport: 19, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Andr%C3%A9_Ventura_2024.jpg/250px-Andr%C3%A9_Ventura_2024.jpg' },
      { id: 'IL', name: 'Liberal Initiative (IL)', leader: 'Rui Rocha', ideology: 'Liberal', symbol: 'Compass', color: '#06b6d4', baseSupport: 8, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rui_Rocha_2023.jpg/250px-Rui_Rocha_2023.jpg' },
      { id: 'BE', name: 'Left Bloc (Bloco de Esquerda)', leader: 'Mariana Mortágua', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 7, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mariana_Mort%C3%A1gua_2023.jpg/250px-Mariana_Mort%C3%A1gua_2023.jpg' },
      { id: 'PCP', name: 'Communist Party (PCP/CDU)', leader: 'Paulo Raimundo', ideology: 'Communist', symbol: 'Star', color: '#991b1b', baseSupport: 6, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Paulo_Raimundo_2023.jpg/250px-Paulo_Raimundo_2023.jpg' }
    ],
    regions: getPortugalRegions(),
    bills: createBills('PT'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'GR',
    name: 'Greece',
    description: 'The cradle of Western democracy, navigating Mediterranean security, tourism economic growth, and maritime commerce.',
    flag: '🇬🇷',
    seats: 300,
    parliamentName: 'Hellenic Parliament (Βουλή των Ελλήνων)',
    system: 'Parliamentary Republic',
    population: '10.4 Million',
    primaryColor: '#0369a1',
    rivals: [
      { id: 'ND', name: 'New Democracy (Νέα Δημοκρατία)', leader: 'Kyriakos Mitsotakis', ideology: 'Conservative', symbol: 'Building', color: '#0055A5', baseSupport: 38, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Kyriakos_Mitsotakis_2023.jpg/250px-Kyriakos_Mitsotakis_2023.jpg' },
      { id: 'PASOK', name: 'PASOK - KINAL', leader: 'Nikos Androulakis', ideology: 'Social Democrat', symbol: 'Sun', color: '#059669', baseSupport: 22, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nikos_Androulakis_2023.jpg/250px-Nikos_Androulakis_2023.jpg' },
      { id: 'SYRIZA', name: 'SYRIZA - Progressive Alliance', leader: 'Stefanos Kasselakis', ideology: 'Socialist', symbol: 'Users', color: '#dc2626', baseSupport: 14, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Stefanos_Kasselakis_2023.jpg/250px-Stefanos_Kasselakis_2023.jpg' },
      { id: 'KKE', name: 'Communist Party of Greece (ΚΚΕ)', leader: 'Dimitris Koutsoumbas', ideology: 'Communist', symbol: 'Star', color: '#991b1b', baseSupport: 10, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Dimitris_Koutsoumpas_2023.jpg/250px-Dimitris_Koutsoumpas_2023.jpg' },
      { id: 'EL', name: 'Greek Solution (Ελληνική Λύση)', leader: 'Kyriakos Velopoulos', ideology: 'Nationalist', symbol: 'Shield', color: '#1e40af', baseSupport: 10, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Kyriakos_Velopoulos_2023.jpg/250px-Kyriakos_Velopoulos_2023.jpg' },
      { id: 'NIKI', name: 'Democratic Patriotic Movement (NIKI)', leader: 'Dimitris Natsios', ideology: 'Traditionalist', symbol: 'Cross', color: '#ca8a04', baseSupport: 6, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Dimitris_Natsios_2023.jpg/250px-Dimitris_Natsios_2023.jpg' }
    ],
    regions: getGreeceRegions(),
    bills: createBills('GR'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'PL',
    name: 'Poland',
    description: 'A major Central European democracy and NATO eastern pillar with strong economic modernization and democratic institutions.',
    flag: '🇵🇱',
    seats: 460,
    parliamentName: 'Sejm of the Republic of Poland',
    system: 'Parliamentary Republic',
    population: '38 Million',
    primaryColor: '#be123c',
    rivals: [
      { id: 'KO', name: 'Civic Coalition (Koalicja Obywatelska)', leader: 'Donald Tusk', ideology: 'Liberal', symbol: 'Globe', color: '#f97316', baseSupport: 35, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Donald_Tusk_2024.jpg/250px-Donald_Tusk_2024.jpg' },
      { id: 'PIS', name: 'Law and Justice (Prawo i Sprawiedliwość)', leader: 'Jarosław Kaczyński', ideology: 'Conservative', symbol: 'Building', color: '#1e3a8a', baseSupport: 32, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Jaros%C3%82aw_Kaczy%C5%84ski_2023.jpg/250px-Jaros%C3%82aw_Kaczy%C5%84ski_2023.jpg' },
      { id: 'TD', name: 'Third Way (Trzecia Droga)', leader: 'Szymon Hołownia', ideology: 'Centrist', symbol: 'Compass', color: '#eab308', baseSupport: 13, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Szymon_Ho%C5%82ownia_2023.jpg/250px-Szymon_Ho%C5%82ownia_2023.jpg' },
      { id: 'LEW', name: 'The Left (Lewica)', leader: 'Włodzimierz Czarzasty', ideology: 'Social Democrat', symbol: 'Heart', color: '#dc2626', baseSupport: 9, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/W%C5%82odzimierz_Czarzasty_2023.jpg/250px-W%C5%82odzimierz_Czarzasty_2023.jpg' },
      { id: 'KON', name: 'Confederation (Konfederacja)', leader: 'Krzysztof Bosak & Sławomir Mentzen', ideology: 'Nationalist', symbol: 'Shield', color: '#1f2937', baseSupport: 8, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Krzysztof_Bosak_2023.jpg/250px-Krzysztof_Bosak_2023.jpg' },
      { id: 'RAZ', name: 'Left Together (Razem)', leader: 'Adrian Zandberg', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 3, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Adrian_Zandberg_2023.jpg/250px-Adrian_Zandberg_2023.jpg' }
    ],
    regions: getPolandRegions2026(),
    bills: createBills('PL'),
    campaignTurns: 53,
    electionCycleYears: 4,
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

  const ruFirst = ['Sergey', 'Dmitry', 'Boris', 'Lev', 'Alexei', 'Nikolai', 'Mikhail', 'Alexander', 'Ilya', 'Oleg', 'Vasily', 'Vladislav', 'Yaroslav', 'Maksim', 'Evgeny'];
  const ruLast = ['Vishnevsky', 'Shlosberg', 'Mitrokhin', 'Yavlinsky', 'Bondarenko', 'Sobyanin', 'Beglov', 'Furgal', 'Davankov', 'Zyuganov', 'Lokot', 'Kurinny', 'Khabirov', 'Teksler', 'Nikitina'];

  const uaFirst = ['Vitali', 'Ihor', 'Hennadiy', 'Borys', 'Andriy', 'Ivan', 'Oleksandr', 'Serhiy', 'Vladyslav', 'Roman', 'Ruslan', 'Oleh', 'Petro', 'Tamila'];
  const uaLast = ['Klitschko', 'Terekhov', 'Trukhanov', 'Filatov', 'Sadovyi', 'Fedorov', 'Senkevych', 'Morhunov', 'Bondarenko', 'Symchyshyn', 'Martsinkiv', 'Synyutka', 'Honcharenko'];

  const plFirst = ['Rafał', 'Jacek', 'Aleksandra', 'Hanna', 'Aleksander', 'Marcin', 'Piotr', 'Krzysztof', 'Tadeusz', 'Arkadiusz', 'Agata', 'Robert', 'Donald'];
  const plLast = ['Trzaskowski', 'Jaśkowiak', 'Dulkiewicz', 'Sutryk', 'Zdanowska', 'Miszalski', 'Krupa', 'Bruski', 'Krzystek', 'Żuk', 'Truskolaski', 'Wiśniewski', 'Tusk'];

  const frFirst = ['Gabriel', 'Emmanuel', 'Xavier', 'Laurent', 'Alain', 'Carole', 'Valérie', 'Marine', 'Jordan', 'Jean-Luc', 'Anne', 'Benoît'];
  const frLast = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Macron', 'Attal', 'Hidalgo'];

  const seFirst = ['Ulf', 'Magdalena', 'Jimmie', 'Nooshi', 'Johan', 'Ebba', 'Per', 'Karin', 'Anna', 'Lars', 'Erik', 'Mikael'];
  const seLast = ['Kristersson', 'Andersson', 'Åkesson', 'Dadgostar', 'Pehrson', 'Busch', 'Bolund', 'Wanngård', 'Johansson', 'Nilsson'];

  const ptFirst = ['Luís', 'Pedro', 'André', 'Rui', 'Mariana', 'Paulo', 'Carlos', 'Inês', 'António', 'Fernando', 'Manuel'];
  const ptLast = ['Montenegro', 'Santos', 'Ventura', 'Rocha', 'Mortágua', 'Raimundo', 'Moedas', 'Moreira', 'Rodrigues', 'Ferreira'];

  const grFirst = ['Kyriakos', 'Nikos', 'Stefanos', 'Dimitris', 'Kostas', 'Haris', 'Pavlos', 'Elena', 'Rena', 'Yannis'];
  const grLast = ['Mitsotakis', 'Androulakis', 'Kasselakis', 'Koutsoumbas', 'Velopoulos', 'Natsios', 'Bakoyannis', 'Doukas', 'Boutaris'];

  const isFirst = ['Bjarni', 'Katrín', 'Kristrún', 'Sigurður', 'Þorgerður', 'Dagur', 'Einar', 'Ásmundur', 'Halla', 'Gunnar'];
  const isLast = ['Benediktsson', 'Jakobsdóttir', 'Frostadóttir', 'Ingi', 'Eggertsson', 'Þorsteinsson', 'Einarsson', 'Jónsdóttir'];

  const cnFirst = ['Xi', 'Li', 'Wang', 'Zhang', 'Chen', 'Liu', 'Yang', 'Huang', 'Zhao', 'Wu'];
  const cnLast = ['Jinping', 'Qiang', 'Huning', 'Zhaolei', 'Keqiang', 'Yangjie', 'Ming', 'Wei', 'Jun'];

  const twFirst = ['Lai', 'Hou', 'Ko', 'Han', 'Chen', 'Chiang', 'Lin', 'Cheng', 'Lu', 'Kao'];
  const twLast = ['Ching-te', 'Yu-ih', 'Wen-je', 'Kuo-yu', 'Chi-mai', 'Wan-an', 'Chia-lung', 'Wen-tsan'];

  const saFirst = ['Mohammed', 'Faisal', 'Khalid', 'Abdulaziz', 'Turki', 'Badr', 'Saud', 'Abdullah'];
  const saLast = ['bin Salman', 'bin Farhan', 'Al-Falih', 'Al-Saud', 'Al-Sheikh', 'Al-Jadaan', 'Al-Ghamdi'];

  const irFirst = ['Masoud', 'Saeed', 'Mohammad', 'Ali', 'Ebrahim', 'Hassan', 'Hossein', 'Javad'];
  const irLast = ['Pezeshkian', 'Jalili', 'Ghalibaf', 'Bagheri', 'Khamenei', 'Rouhani', 'Zarif', 'Zakani'];

  const ilFirst = ['Benjamin', 'Yair', 'Benny', 'Itamar', 'Bezalel', 'Avigdor', 'Ron', 'Mansour'];
  const ilLast = ['Netanyahu', 'Lapid', 'Gantz', 'Ben-Gvir', 'Smotrich', 'Lieberman', 'Huldai', 'Abbas'];

  const psFirst = ['Mahmoud', 'Mohammad', 'Mustafa', 'Yahya', 'Ismail', 'Khaled', 'Rawhi', 'Husam'];
  const psLast = ['Abbas', 'Mustafa', 'Shtayyeh', 'Sinwar', 'Haniyeh', 'Meshaal', 'Fattouh', 'Barghouti'];

  const roFirst = ['Nicuşor', 'Emil', 'Marcel', 'Nicolae', 'Klaus', 'George', 'Mihai', 'Elena'];
  const roLast = ['Popa', 'Popescu', 'Radu', 'Ionescu', 'Dumitru', 'Stoica', 'Ciolacu', 'Dan'];

  const huFirst = ['Gergely', 'László', 'Péter', 'Viktor', 'Ferenc', 'Klára', 'Pál', 'János'];
  const huLast = ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Orbán', 'Magyar'];

  const sample = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (countryId === 'TR') return `${sample(trFirst)} ${sample(trLast)}`;
  if (countryId === 'DE' || countryId === 'DDR') return `${sample(deFirst)} ${sample(deLast)}`;
  if (countryId === 'US') return `${sample(usFirst)} ${sample(usLast)}`;
  if (countryId === 'BR') return `${sample(brFirst)} ${sample(brLast)}`;
  if (countryId === 'JP') return `${sample(jpFirst)} ${sample(jpLast)}`;
  if (countryId === 'EG') return `${sample(egFirst)} ${sample(egLast)}`;
  if (countryId === 'GB') return `${sample(gbFirst)} ${sample(gbLast)}`;
  if (countryId === 'IN') return `${sample(inFirst)} ${sample(inLast)}`;
  if (countryId === 'IT') return `${sample(itFirst)} ${sample(itLast)}`;
  if (countryId === 'ID') return `${sample(idFirst)} ${sample(idLast)}`;
  if (countryId === 'MX' || countryId === 'ES' || countryId === 'AR' || countryId === 'CL') return `${sample(esFirst)} ${sample(esLast)}`;
  if (countryId === 'KR') return `${sample(krFirst)} ${sample(krLast)}`;
  if (countryId === 'ZA') return `${sample(zaFirst)} ${sample(zaLast)}`;
  if (countryId === 'CA' || countryId === 'AU') return `${sample(gbFirst)} ${sample(gbLast)}`;
  if (countryId === 'FR') return `${sample(frFirst)} ${sample(frLast)}`;
  if (countryId === 'RO') return `${sample(roFirst)} ${sample(roLast)}`;
  if (countryId === 'HU') return `${sample(huFirst)} ${sample(huLast)}`;
  if (countryId === 'RU' || countryId === 'SU') return `${sample(ruFirst)} ${sample(ruLast)}`;
  if (countryId === 'UA') return `${sample(uaFirst)} ${sample(uaLast)}`;
  if (countryId === 'PL' || countryId === 'CS') return `${sample(plFirst)} ${sample(plLast)}`;
  if (countryId === 'SE') return `${sample(seFirst)} ${sample(seLast)}`;
  if (countryId === 'PT') return `${sample(ptFirst)} ${sample(ptLast)}`;
  if (countryId === 'GR') return `${sample(grFirst)} ${sample(grLast)}`;
  if (countryId === 'IS') return `${sample(isFirst)} ${sample(isLast)}`;
  if (countryId === 'CN') return `${sample(cnFirst)} ${sample(cnLast)}`;
  if (countryId === 'TW') return `${sample(twFirst)} ${sample(twLast)}`;
  if (countryId === 'SA') return `${sample(saFirst)} ${sample(saLast)}`;
  if (countryId === 'IR') return `${sample(irFirst)} ${sample(irLast)}`;
  if (countryId === 'IL') return `${sample(ilFirst)} ${sample(ilLast)}`;
  if (countryId === 'PS') return `${sample(psFirst)} ${sample(psLast)}`;

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

  const ruFirst = ['Sergey', 'Dmitry', 'Boris', 'Lev', 'Alexei', 'Nikolai', 'Mikhail', 'Alexander', 'Ilya', 'Oleg', 'Vasily', 'Vladislav', 'Yaroslav', 'Maksim'];
  const ruLast = ['Vishnevsky', 'Shlosberg', 'Mitrokhin', 'Yavlinsky', 'Bondarenko', 'Sobyanin', 'Beglov', 'Furgal', 'Davankov', 'Zyuganov', 'Lokot', 'Kurinny'];

  const uaFirst = ['Vitali', 'Ihor', 'Hennadiy', 'Borys', 'Andriy', 'Ivan', 'Oleksandr', 'Serhiy', 'Vladyslav', 'Roman', 'Ruslan', 'Oleh', 'Petro'];
  const uaLast = ['Klitschko', 'Terekhov', 'Trukhanov', 'Filatov', 'Sadovyi', 'Fedorov', 'Senkevych', 'Morhunov', 'Bondarenko', 'Symchyshyn', 'Martsinkiv'];

  const plFirst = ['Rafał', 'Jacek', 'Aleksandra', 'Hanna', 'Aleksander', 'Marcin', 'Piotr', 'Krzysztof', 'Tadeusz', 'Arkadiusz', 'Agata', 'Robert'];
  const plLast = ['Trzaskowski', 'Jaśkowiak', 'Dulkiewicz', 'Sutryk', 'Zdanowska', 'Miszalski', 'Krupa', 'Bruski', 'Krzystek', 'Żuk', 'Truskolaski'];

  const frFirst = ['Gabriel', 'Emmanuel', 'Xavier', 'Laurent', 'Alain', 'Carole', 'Valérie', 'Marine', 'Jordan', 'Jean-Luc', 'Anne', 'Benoît'];
  const frLast = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Macron', 'Attal'];

  const seFirst = ['Ulf', 'Magdalena', 'Jimmie', 'Nooshi', 'Johan', 'Ebba', 'Per', 'Karin', 'Anna', 'Lars', 'Erik'];
  const seLast = ['Kristersson', 'Andersson', 'Åkesson', 'Dadgostar', 'Pehrson', 'Busch', 'Bolund', 'Wanngård', 'Johansson', 'Nilsson'];

  const ptFirst = ['Luís', 'Pedro', 'André', 'Rui', 'Mariana', 'Paulo', 'Carlos', 'Inês', 'António', 'Fernando'];
  const ptLast = ['Montenegro', 'Santos', 'Ventura', 'Rocha', 'Mortágua', 'Raimundo', 'Moedas', 'Moreira', 'Rodrigues', 'Ferreira'];

  const grFirst = ['Kyriakos', 'Nikos', 'Stefanos', 'Dimitris', 'Kostas', 'Haris', 'Pavlos', 'Elena', 'Rena', 'Yannis'];
  const grLast = ['Mitsotakis', 'Androulakis', 'Kasselakis', 'Koutsoumbas', 'Velopoulos', 'Natsios', 'Bakoyannis', 'Doukas', 'Boutaris'];

  const isFirst = ['Bjarni', 'Katrín', 'Kristrún', 'Sigurður', 'Þorgerður', 'Dagur', 'Einar', 'Ásmundur', 'Halla', 'Gunnar'];
  const isLast = ['Benediktsson', 'Jakobsdóttir', 'Frostadóttir', 'Ingi', 'Eggertsson', 'Þorsteinsson', 'Einarsson', 'Jónsdóttir'];

  const cnFirst = ['Xi', 'Li', 'Wang', 'Zhang', 'Chen', 'Liu', 'Yang', 'Huang', 'Zhao', 'Wu'];
  const cnLast = ['Jinping', 'Qiang', 'Huning', 'Zhaolei', 'Keqiang', 'Yangjie', 'Ming', 'Wei', 'Jun'];

  const twFirst = ['Lai', 'Hou', 'Ko', 'Han', 'Chen', 'Chiang', 'Lin', 'Cheng', 'Lu', 'Kao'];
  const twLast = ['Ching-te', 'Yu-ih', 'Wen-je', 'Kuo-yu', 'Chi-mai', 'Wan-an', 'Chia-lung', 'Wen-tsan'];

  const saFirst = ['Mohammed', 'Faisal', 'Khalid', 'Abdulaziz', 'Turki', 'Badr', 'Saud', 'Abdullah'];
  const saLast = ['bin Salman', 'bin Farhan', 'Al-Falih', 'Al-Saud', 'Al-Sheikh', 'Al-Jadaan', 'Al-Ghamdi'];

  const irFirst = ['Masoud', 'Saeed', 'Mohammad', 'Ali', 'Ebrahim', 'Hassan', 'Hossein', 'Javad'];
  const irLast = ['Pezeshkian', 'Jalili', 'Ghalibaf', 'Bagheri', 'Khamenei', 'Rouhani', 'Zarif', 'Zakani'];

  const ilFirst = ['Benjamin', 'Yair', 'Benny', 'Itamar', 'Bezalel', 'Avigdor', 'Ron', 'Mansour'];
  const ilLast = ['Netanyahu', 'Lapid', 'Gantz', 'Ben-Gvir', 'Smotrich', 'Lieberman', 'Huldai', 'Abbas'];

  const psFirst = ['Mahmoud', 'Mohammad', 'Mustafa', 'Yahya', 'Ismail', 'Khaled', 'Rawhi', 'Husam'];
  const psLast = ['Abbas', 'Mustafa', 'Shtayyeh', 'Sinwar', 'Haniyeh', 'Meshaal', 'Fattouh', 'Barghouti'];

  const roFirst = ['Nicuşor', 'Emil', 'Marcel', 'Nicolae', 'Klaus', 'George', 'Mihai', 'Elena'];
  const roLast = ['Popa', 'Popescu', 'Radu', 'Ionescu', 'Dumitru', 'Stoica', 'Ciolacu', 'Dan'];

  const huFirst = ['Gergely', 'László', 'Péter', 'Viktor', 'Ferenc', 'Klára', 'Pál', 'János'];
  const huLast = ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Orbán', 'Magyar'];

  let hash = 0;
  for (let i = 0; i < regionName.length; i++) {
    hash = regionName.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const sample = (arr: string[]) => arr[hash % arr.length];

  if (countryId === 'TR') return `${sample(trFirst)} ${sample(trLast)}`;
  if (countryId === 'DE' || countryId === 'DDR') return `${sample(deFirst)} ${sample(deLast)}`;
  if (countryId === 'US') return `${sample(usFirst)} ${sample(usLast)}`;
  if (countryId === 'BR') return `${sample(brFirst)} ${sample(brLast)}`;
  if (countryId === 'JP') return `${sample(jpFirst)} ${sample(jpLast)}`;
  if (countryId === 'EG') return `${sample(egFirst)} ${sample(egLast)}`;
  if (countryId === 'GB') return `${sample(gbFirst)} ${sample(gbLast)}`;
  if (countryId === 'IN') return `${sample(inFirst)} ${sample(inLast)}`;
  if (countryId === 'IT') return `${sample(itFirst)} ${sample(itLast)}`;
  if (countryId === 'ID') return `${sample(idFirst)} ${sample(idLast)}`;
  if (countryId === 'MX' || countryId === 'ES' || countryId === 'AR' || countryId === 'CL') return `${sample(esFirst)} ${sample(esLast)}`;
  if (countryId === 'KR') return `${sample(krFirst)} ${sample(krLast)}`;
  if (countryId === 'ZA') return `${sample(zaFirst)} ${sample(zaLast)}`;
  if (countryId === 'CA' || countryId === 'AU') return `${sample(gbFirst)} ${sample(gbLast)}`;
  if (countryId === 'FR') return `${sample(frFirst)} ${sample(frLast)}`;
  if (countryId === 'RO') return `${sample(roFirst)} ${sample(roLast)}`;
  if (countryId === 'HU') return `${sample(huFirst)} ${sample(huLast)}`;
  if (countryId === 'RU' || countryId === 'SU') return `${sample(ruFirst)} ${sample(ruLast)}`;
  if (countryId === 'UA') return `${sample(uaFirst)} ${sample(uaLast)}`;
  if (countryId === 'PL' || countryId === 'CS') return `${sample(plFirst)} ${sample(plLast)}`;
  if (countryId === 'SE') return `${sample(seFirst)} ${sample(seLast)}`;
  if (countryId === 'PT') return `${sample(ptFirst)} ${sample(ptLast)}`;
  if (countryId === 'GR') return `${sample(grFirst)} ${sample(grLast)}`;
  if (countryId === 'IS') return `${sample(isFirst)} ${sample(isLast)}`;
  if (countryId === 'CN') return `${sample(cnFirst)} ${sample(cnLast)}`;
  if (countryId === 'TW') return `${sample(twFirst)} ${sample(twLast)}`;
  if (countryId === 'SA') return `${sample(saFirst)} ${sample(saLast)}`;
  if (countryId === 'IR') return `${sample(irFirst)} ${sample(irLast)}`;
  if (countryId === 'IL') return `${sample(ilFirst)} ${sample(ilLast)}`;
  if (countryId === 'PS') return `${sample(psFirst)} ${sample(psLast)}`;

  return `${sample(usFirst)} ${sample(usLast)}`;
}
