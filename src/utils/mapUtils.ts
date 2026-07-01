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
  if (countryId && ['BR', 'JP', 'EG', 'GB'].includes(countryId)) {
    return normName; // Handled by fallback matching in CampaignView
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
    return feature.properties.NAME_1 || feature.properties.name || feature.properties.NAME || feature.properties.EER13NM || feature.properties['hc-key'] || feature.properties.admin || '';
  }
  return feature.name || '';
};
