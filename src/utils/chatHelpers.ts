import type { ChatItem, MessageItem } from '../types/chat';
import { normalizeChatId } from './chatId';

export const upsertChat = (
    chats: ChatItem[],
    chatId: string,
    name: string,
    text: string,
    timestamp: number
): ChatItem[] => {
    const idx = chats.findIndex((c) => normalizeChatId(c.chatId) === chatId);

    if (idx === -1) {
        return [
            { chatId, firstName: name, lastMessage: text, lastMessageTimestamp: timestamp },
            ...chats,
        ];
    }

    const updated: ChatItem = {
        ...chats[idx],
        lastMessage: text,
        lastMessageTimestamp: timestamp,
    };
    return [updated, ...chats.filter((_, i) => i !== idx)];
};

export const appendMessage = (
    messages: Record<string, MessageItem[]>,
    chatId: string,
    msg: MessageItem
): Record<string, MessageItem[]> => ({
    ...messages,
    [chatId]: [...(messages[chatId] || []), msg],
});