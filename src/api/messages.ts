import axios from 'axios';
import { greenApiAxios } from './axiosClient';
import { translateGreenApiError } from '../utils/apiErrors';

export interface SendMessageResponse {
    idMessage: string;
}

export const sendMessageApi = async (
    idInstance: string,
    apiTokenInstance: string,
    chatId: string,
    message: string
): Promise<SendMessageResponse | null> => {
    try {
        const response = await greenApiAxios.post<SendMessageResponse>(
            `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
            { chatId, message }
        );

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            const rawMessage = error.response.data?.message;
            const friendly = translateGreenApiError(
                typeof rawMessage === 'string' ? rawMessage : undefined
            );
            console.error('Ошибка отправки:', friendly);
        } else {
            console.error('Ошибка соединения при отправке:', error);
        }
        return null;
    }
};