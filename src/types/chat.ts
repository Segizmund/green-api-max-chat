export interface MessageItem {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
    isOutgoing: boolean;
}

export interface ChatItem {
    chatId: string;
    firstName: string;
    lastName?: string;
    lastMessage?: string;
    lastMessageTimestamp?: number;
}