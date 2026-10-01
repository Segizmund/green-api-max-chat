export const normalizeChatId = (chatId: string | number | undefined | null): string => {
    if (chatId === undefined || chatId === null) return '';
    const str = String(chatId);
    if (!str) return '';
    if (str.endsWith('@c.us') || str.endsWith('@g.us')) return str;
    const digits = str.replace(/\D/g, '');
    return digits ? `${digits}@c.us` : str;
};

export const getPhoneFromChatId = (chatId: string): string => {
    return chatId.replace(/@c\.us$/, '').replace(/@g\.us$/, '');
};