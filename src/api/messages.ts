import { greenApiAxios } from './axiosClient';

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
        {
            chatId,
            message,
        }
        );

        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        return null;
    }
};