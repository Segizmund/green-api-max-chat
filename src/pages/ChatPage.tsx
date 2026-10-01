import { useState, useEffect, useCallback, useRef } from 'react';
import { FindContactDropdown, type ContactData } from "../components/FindContactDropdown";
import { ChatWindow } from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { addContactApi } from '../api/contacts';
import { receiveNotificationApi, deleteNotificationApi } from '../api/notifications';
import { sendMessageApi } from '../api/messages';
import type { ChatItem, MessageItem } from '../types/chat';
import { normalizeChatId, getPhoneFromChatId } from '../utils/chatId';
import { upsertChat, appendMessage } from '../utils/chatHelpers';

export const ChatPage = () => {
    const { credentials } = useAuth();

    const [chats, setChats] = useState<ChatItem[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, MessageItem[]>>({});

    const activeChat = chats.find((c) => c.chatId === activeChatId);
    const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

    const handleSelectChat = async (contact: ContactData) => {
        if (!credentials) return;

        const normalizedChatId = normalizeChatId(contact.chatId);
        const normalizedContact: ChatItem = {
            ...contact,
            chatId: normalizedChatId,
        };

        const isSuccess = await addContactApi(
            credentials.idInstance,
            credentials.apiTokenInstance,
            normalizedContact
        );

        if (!isSuccess) return;

        setChats((prevChats) => {
            const exists = prevChats.some(
                (c) => normalizeChatId(c.chatId) === normalizedChatId
            );
            if (!exists) {
                return [normalizedContact, ...prevChats];
            }
            return prevChats;
        });

        setActiveChatId(normalizedChatId);
    };

    const processNotification = useCallback(async (): Promise<boolean> => {
        if (!credentials?.idInstance || !credentials?.apiTokenInstance) {
            return false;
        }

        const notification = await receiveNotificationApi(
            credentials.idInstance,
            credentials.apiTokenInstance
        );

        if (!notification) return false;

        const { receiptId, body } = notification;

        try {
            if (body?.typeWebhook === 'incomingMessageReceived') {
                const text =
                    body.messageData?.textMessageData?.textMessage ||
                    body.messageData?.extendedTextMessageData?.text ||
                    (body.messageData as any)?.extendedTextMessageData?.textMessage ||
                    '';

                const senderPhone = body.senderData?.senderPhoneNumber;
                const senderName =
                    body.senderData?.senderName ||
                    body.senderData?.chatName ||
                    body.senderData?.senderContactName ||
                    'Контакт';

                const senderChatId = senderPhone
                    ? normalizeChatId(senderPhone)
                    : normalizeChatId(body.senderData?.chatId);

                if (senderChatId && text) {
                    const timestamp = body.timestamp || Math.floor(Date.now() / 1000);

                    const incomingMsg: MessageItem = {
                        id: body.idMessage || String(Date.now()),
                        senderId: senderChatId,
                        text,
                        timestamp,
                        isOutgoing: false,
                    };

                    setChats((prev) => upsertChat(prev, senderChatId, senderName, text, timestamp));
                    setMessages((prev) => appendMessage(prev, senderChatId, incomingMsg));
                } else {
                    console.warn('Не удалось извлечь text или senderChatId из уведомления');
                }
            }
        } catch (err) {
            console.error('Ошибка при обработке уведомления:', err);
        } finally {
            if (receiptId) {
                await deleteNotificationApi(
                    credentials.idInstance,
                    credentials.apiTokenInstance,
                    receiptId
                );
            }
        }

        return true;
    }, [credentials]);

    const handleSendMessage = async (text: string): Promise<boolean> => {
        if (!activeChatId || !credentials) return false;

        const normalizedChatId = normalizeChatId(activeChatId);

        const response = await sendMessageApi(
            credentials.idInstance,
            credentials.apiTokenInstance,
            normalizedChatId,
            text
        );

        if (response?.idMessage) {
            const timestamp = Math.floor(Date.now() / 1000);

            const newMsg: MessageItem = {
                id: response.idMessage,
                senderId: 'me',
                text,
                timestamp,
                isOutgoing: true,
            };

            setMessages((prev) => ({
                ...prev,
                [normalizedChatId]: [...(prev[normalizedChatId] || []), newMsg],
            }));

            setChats((prevChats) => {
                const idx = prevChats.findIndex(
                    (c) => normalizeChatId(c.chatId) === normalizedChatId
                );
                if (idx === -1) return prevChats;

                const updated: ChatItem = {
                    ...prevChats[idx],
                    lastMessage: text,
                    lastMessageTimestamp: timestamp,
                };
                const rest = prevChats.filter((_, i) => i !== idx);
                return [updated, ...rest];
            });

            return true;
        }

        return false;
    };

    useEffect(() => {
        if (!credentials?.idInstance || !credentials?.apiTokenInstance) {
            return;
        }

        let cancelled = false;
        let timerId: ReturnType<typeof setTimeout>;

        const startPolling = async () => {
            if (cancelled) return;

            const hadNotification = await processNotification();

            if (cancelled) return;

            const delay = hadNotification ? 0 : 1500;
            timerId = setTimeout(startPolling, delay);
        };

        startPolling();

        return () => {
            cancelled = true;
            clearTimeout(timerId);
        };
    }, [credentials, processNotification]);

    return (
        <div className="flex-1 flex w-full h-[calc(100vh-52px)]">
            {/* Левая панель */}
            <div className="w-80 border-r border-slate-200 bg-white p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Чаты</h2>
                    <FindContactDropdown onSelectChat={handleSelectChat} />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-400">
                            Список чатов пуст. Нажмите "+", чтобы найти контакт.
                        </div>
                    ) : (
                        chats.map((chat) => {
                            const isActive = chat.chatId === activeChatId;
                            const phone = getPhoneFromChatId(chat.chatId);

                            return (
                                <button
                                    key={chat.chatId}
                                    onClick={() => setActiveChatId(chat.chatId)}
                                    className={`w-full p-3.5 text-left flex items-center gap-3 border-b border-slate-100 transition cursor-pointer ${
                                        isActive
                                            ? 'bg-emerald-50 border-l-4 border-l-[#3b9702]'
                                            : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 shrink-0">
                                        {chat.firstName[0]?.toUpperCase() ?? '?'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="font-medium text-sm text-slate-800 truncate">
                                                {chat.firstName} {chat.lastName ?? ''}
                                            </div>
                                            {chat.lastMessageTimestamp && (
                                                <div className="text-[10px] text-slate-400 shrink-0">
                                                    {new Date(chat.lastMessageTimestamp * 1000).toLocaleTimeString(
                                                        [],
                                                        { hour: '2-digit', minute: '2-digit' }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400 truncate">
                                            {chat.lastMessage
                                                ? chat.lastMessage
                                                : `+${phone}`}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Правая панель */}
            <div className="flex-1 bg-slate-100 flex items-center justify-center text-slate-400">
                {activeChat ? (
                <ChatWindow
                    chat={activeChat}
                    messages={activeMessages}
                    onSendMessage={handleSendMessage}
                />
                ) : (
                <div className="flex-1 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                    Выберите или создайте чат для начала общения
                </div>
                )}
            </div>
        </div>
    );
};