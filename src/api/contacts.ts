import axios from 'axios';
import { greenApiAxios } from './axiosClient';
import type { ContactData } from '../components/FindContactDropdown';
import { translateGreenApiError } from '../utils/apiErrors';

export interface AddContactResult {
    ok: boolean;
    error?: string;
}

export const addContactApi = async (
    idInstance: string,
    apiTokenInstance: string,
    contact: ContactData
): Promise<AddContactResult> => {
    try {
        const response = await greenApiAxios.post<{ addContact?: boolean; message?: string }>(
            `/waInstance${idInstance}/addContact/${apiTokenInstance}`,
            {
                chatId: contact.chatId,
                firstName: contact.firstName,
                ...(contact.lastName && { lastName: contact.lastName }),
            }
        );

        return { ok: response.data.addContact === true };
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const rawMessage = error.response.data?.message;

            if (status === 400 && typeof rawMessage === 'string' && rawMessage.includes('already exists')) {
                return { ok: true };
            }

            return {
                ok: false,
                error: translateGreenApiError(typeof rawMessage === 'string' ? rawMessage : undefined),
            };
        }

        console.error('Сетевая ошибка при добавлении контакта:', error);
        return { ok: false, error: 'Ошибка соединения с сервером' };
    }
};