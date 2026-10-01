import { useState, useRef, useEffect, type ChangeEvent, type MouseEvent } from 'react';
import { COUNTRIES, type Country } from '../constants/countries';

export interface ContactData {
    chatId: string;
    firstName: string;
    lastName?: string;
}

interface FindContactDropdownProps {
    onSelectChat: (contact: ContactData) => Promise<{ ok: boolean; error?: string }>;
}

export const FindContactDropdown = ({ onSelectChat }: FindContactDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: globalThis.MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setError(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        setError(null);
    };

    const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const country = COUNTRIES.find((c) => c.code === e.target.value);
        if (country) setSelectedCountry(country);
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let digitsOnly = value.replace(/\D/g, '');
        const sortedCountries = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
        const matchedCountry = sortedCountries.find((country) => digitsOnly.startsWith(country.dialCode));

        if (matchedCountry) {
            setSelectedCountry(matchedCountry);
            digitsOnly = digitsOnly.slice(matchedCountry.dialCode.length);
        }

        setPhoneNumber(digitsOnly);
        setError(null);
    };

    const handleOpenChat = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const cleanNumber = phoneNumber.replace(/\D/g, '');
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();

        if (!cleanNumber || !trimmedFirstName) {
            setError('Заполните номер телефона и имя');
            return;
        }

        const fullNumber = `${selectedCountry.dialCode}${cleanNumber}`;
        const chatId = `${fullNumber}@c.us`;

        const contactData: ContactData = {
            chatId,
            firstName: trimmedFirstName,
            ...(trimmedLastName && { lastName: trimmedLastName }),
        };

        setIsSubmitting(true);
        setError(null);

        const result = await onSelectChat(contactData);

        setIsSubmitting(false);

        if (!result.ok) {
            setError(result.error ?? 'Не удалось добавить контакт');
            return;
        }

        setPhoneNumber('');
        setFirstName('');
        setLastName('');
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="cursor-pointer group flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#3b9702"
                    className={`transition-transform duration-300 group-hover:rotate-90 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                    viewBox="0 0 16 16"
                >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-4 flex flex-col gap-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Найти по номеру
                    </span>

                    <div className="flex flex-col gap-1">
                        <div>
                            <label className="text-xs text-slate-600 font-medium">Номер телефона</label>
                            <div className="flex items-center border border-slate-300 rounded-md focus-within:ring-2 focus-within:ring-[#3b9702]">
                                <div className="relative flex items-center pl-2.5 pr-1 py-1.5 border-r border-slate-200 bg-slate-50 rounded-l-md shrink-0">
                                    <span className="text-sm font-medium text-slate-700 whitespace-nowrap flex items-center gap-1 pointer-events-none">
                                        <span>{selectedCountry.flag}</span>
                                        <span>+{selectedCountry.dialCode}</span>
                                        <span className="text-[10px] text-slate-400 pl-0.5">▼</span>
                                    </span>

                                    <select
                                        value={selectedCountry.code}
                                        onChange={handleCountryChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    >
                                        {COUNTRIES.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.name} (+{country.dialCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="tel"
                                    placeholder="9001234567"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    className="w-full px-2 py-1.5 text-sm rounded-r-md focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-600 font-medium flex justify-between">
                                <span>
                                    Имя <span className="text-red-500">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Иван"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    setError(null);
                                }}
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b9702]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-600 font-medium flex items-center justify-between">
                                <span>Фамилия</span>
                                <span className="text-slate-400 font-normal text-[10px]">необязательно</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Иванов"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b9702]"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="px-3 py-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-md">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleOpenChat}
                        disabled={isSubmitting}
                        className="w-full mt-1 bg-[#3b9702] hover:bg-[#266101] text-white text-sm font-medium py-2 rounded-md transition duration-300 ease-linear cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Ищем…' : 'Найти'}
                    </button>
                </div>
            )}
        </div>
    );
};