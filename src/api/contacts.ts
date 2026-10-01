import axios from 'axios';
import { greenApiAxios } from './axiosClient';
import type { ContactData } from '../components/FindContactDropdown';

export const addContactApi = async (
    idInstance: string,
    apiTokenInstance: string,
    contact: ContactData
): Promise<boolean> => {
    try {
        const response = await greenApiAxios.post<{ addContact?: boolean; message?: string }>(
        `/waInstance${idInstance}/addContact/${apiTokenInstance}`,
        {
            chatId: contact.chatId,
            firstName: contact.firstName,
            ...(contact.lastName && { lastName: contact.lastName }),
        }
        );

        return response.data.addContact === true;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 400 && typeof message === 'string' && message.includes('already exists')) {
            return true;
        }

        if (status === 404) {
            alert('Этот номер не зарегистрирован в мессенджере.');
            return false;
        }

        alert(`Ошибка API: ${message || 'Не удалось добавить контакт'}`);
        return false;
        }

        console.error('Сетевая ошибка при добавлении контакта:', error);
        alert('Ошибка соединения с сервером.');
        return false;
    }
};