export interface Country {
    code: string;
    name: string;
    dialCode: string;
    flag: string;
}

export const COUNTRIES: Country[] = [
    { code: 'RU', name: 'Россия', dialCode: '7', flag: '🇷🇺' },
    { code: 'BY', name: 'Беларусь', dialCode: '375', flag: '🇧🇾' },
    { code: 'KZ', name: 'Казахстан', dialCode: '7', flag: '🇰🇿' },
    { code: 'UZ', name: 'Узбекистан', dialCode: '998', flag: '🇺🇿' },
    { code: 'KG', name: 'Кыргызстан', dialCode: '996', flag: '🇰🇬' },
    { code: 'TJ', name: 'Таджикистан', dialCode: '992', flag: '🇹🇯' },
    { code: 'AM', name: 'Армения', dialCode: '374', flag: '🇦🇲' },
    { code: 'AZ', name: 'Азербайджан', dialCode: '994', flag: '🇦🇿' },
    { code: 'GE', name: 'Грузия', dialCode: '995', flag: '🇬🇪' },
    { code: 'US', name: 'США / Канада', dialCode: '1', flag: '🇺🇸' },
];