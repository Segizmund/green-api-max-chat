export interface SenderData {
    chatId: string;
    chatName?: string;
    chatType?: string;
    sender: string;
    senderName?: string;
    senderType?: string;
    senderContactName?: string;
    senderPhoneNumber?: number;
}

export interface TextMessageData {
    textMessage: string;
}

export interface ExtendedTextMessageData {
    text: string;
    description?: string;
    title?: string;
    previewUrl?: string;
}

export interface MessageData {
    typeMessage: 'textMessage' | 'extendedTextMessage' | string;
    textMessageData?: TextMessageData;
    extendedTextMessageData?: ExtendedTextMessageData;
}

export interface InstanceData {
    idInstance: number;
    wid: string;
    typeInstance: string;
}

export interface NotificationBody {
    typeWebhook: 'incomingMessageReceived' | 'outgoingAPIMessageReceived' | 'outgoingMessageReceived' | string;
    instanceData: InstanceData;
    timestamp: number;
    idMessage: string;
    senderData?: SenderData;
    messageData?: MessageData;
}

export interface ReceiveNotificationResponse {
    receiptId: number;
    body: NotificationBody;
}