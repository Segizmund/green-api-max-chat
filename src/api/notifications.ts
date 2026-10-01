import { greenApiAxios } from './axiosClient';
import type { ReceiveNotificationResponse } from '../types/notification';

export const receiveNotificationApi = async (
    idInstance: string,
    apiTokenInstance: string
): Promise<ReceiveNotificationResponse | null> => {
    try {
        const response = await greenApiAxios.get<ReceiveNotificationResponse | null>(
        `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
        );

        return response.data;
    } catch (error) {
        console.error('Ошибка при получении уведомления:', error);
        return null;
    }
};

export const deleteNotificationApi = async (
    idInstance: string,
    apiTokenInstance: string,
    receiptId: number
): Promise<boolean> => {
    try {
        const response = await greenApiAxios.delete<{ result: boolean }>(
        `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
        );

        return response.data.result;
    } catch (error) {
        console.error(`Ошибка при удалении уведомления ${receiptId}:`, error);
        return false;
    }
};