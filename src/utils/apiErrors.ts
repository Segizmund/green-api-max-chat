export const translateGreenApiError = (rawMessage: string | undefined): string => {
    if (!rawMessage) {
        return 'Не удалось выполнить запрос';
    }

    const msg = rawMessage.toLowerCase();

    if (
        msg.includes('invalid phone number') ||
        msg.includes('invalid chatid') ||
        msg.includes('"chatid"')
    ) {
        return 'Проверьте номер телефона — он указан неверно';
    }

    if (msg.includes('not registered') || msg.includes('not found')) {
        return 'Этот номер не зарегистрирован в мессенджере';
    }

    if (msg.includes('already exists')) {
        return 'Контакт уже добавлен';
    }

    if (msg.includes('unauthorized') || msg.includes('invalid token')) {
        return 'Неверный apiTokenInstance или idInstance';
    }

    if (msg.includes('not authorized') || msg.includes('instance is not authorized')) {
        return 'Инстанс не авторизован. Отсканируйте QR-код в консоли Green API';
    }

    if (msg.includes('validation failed')) {
        return 'Проверьте введённые данные';
    }

    return `Ошибка: ${rawMessage}`;
};