import { useState, useRef, useEffect } from 'react';
import type { ChatItem, MessageItem } from '../types/chat';
import { getPhoneFromChatId } from '../utils/chatId';

interface ChatWindowProps {
    chat: ChatItem;
    messages: MessageItem[];
    onSendMessage: (text: string) => Promise<boolean>;
}

export const ChatWindow = ({ chat, messages, onSendMessage }: ChatWindowProps) => {
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        return () => {
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        };
    }, []);

    const showError = (text: string) => {
        setSendError(text);
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => setSendError(null), 3000);
    };

    const handleSubmit = async () => {
        if (!messageText.trim() || isSending) return;

        const textToSend = messageText.trim();
        setIsSending(true);

        const isSuccess = await onSendMessage(textToSend);

        setIsSending(false);

        if (isSuccess) {
            setMessageText('');
            setSendError(null);
        } else {
            showError('Не удалось отправить сообщение');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const phone = getPhoneFromChatId(chat.chatId);

    return (
        <div className="flex-1 bg-slate-100 flex flex-col h-full">
            {/* Шапка чата */}
            <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                <div className="font-semibold text-slate-800 text-sm">
                    {chat.firstName} {chat.lastName ?? ''}
                </div>
                <div className="text-xs text-slate-400">+{phone}</div>
                </div>
            </div>

            {/* Список сообщений */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
                        Сообщений пока нет. Напишите первое сообщение!
                    </div>
                ) : (
                    <div className="space-y-3 mt-auto">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isOutgoing ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-md px-4 py-2 rounded-2xl text-sm shadow-xs ${
                                        msg.isOutgoing
                                            ? 'bg-[#3b9702] text-white rounded-br-none'
                                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                    }`}
                                >
                                    <div>{msg.text}</div>
                                    <div
                                        className={`text-[10px] mt-1 text-right ${
                                            msg.isOutgoing ? 'text-emerald-100' : 'text-slate-400'
                                        }`}
                                    >
                                        {new Date(msg.timestamp * 1000).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {sendError && (
                <div className="px-3 py-1.5 bg-red-50 border-t border-red-100 text-xs text-red-600 text-center">
                    {sendError}
                </div>
            )}

            {/* Форма ввода сообщения */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите сообщение..."
                    disabled={isSending}
                    className="flex-1 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#3b9702] transition"
                />
                <button
                    type="submit"
                    disabled={!messageText.trim() || isSending}
                    className="px-5 py-2 bg-[#3b9702] hover:bg-[#327e02] text-white text-sm font-medium rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isSending ? '...' : 'Отправить'}
                </button>
            </form>
        </div>
    );
};