export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },
];

const REGION_TO_CURRENCY = {
  US: 'USD', IN: 'INR', GB: 'GBP', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR',
  NL: 'EUR', JP: 'JPY', AU: 'AUD', CA: 'CAD', CH: 'CHF', CN: 'CNY', SG: 'SGD',
  AE: 'AED', SA: 'SAR', KR: 'KRW', BR: 'BRL', MX: 'MXN',
};

export const detectCurrencyFromLocale = () => {
  const stored = localStorage.getItem('tradex_currency');
  if (stored && CURRENCIES.some((c) => c.code === stored)) return stored;

  const locale = navigator.language || 'en-US';
  const region = locale.split('-')[1]?.toUpperCase();
  if (region && REGION_TO_CURRENCY[region]) return REGION_TO_CURRENCY[region];
  if (locale.toLowerCase().startsWith('hi')) return 'INR';
  return 'USD';
};

export const getCurrencyMeta = (code) =>
  CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
