'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Message, ChatSession } from '../types/chat';
import { useChatHistory } from '../hooks/useChatHistory';

export type InputMode = 'chat' | 'image' | 'video';

interface ChatContextType {
  chats: ChatSession[];
  activeChatId: string | null;
  activeChat: ChatSession | undefined;
  isGenerating: boolean;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { chats, setChats, isLoaded } = useChatHistory();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('chat');

  useEffect(() => {
    if (isLoaded && chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [isLoaded, chats, activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: 'چت جدید',
      messages: [],
      createdAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setInputMode('chat');
  };

  const selectChat = (id: string) => {
    setActiveChatId(id);
    setInputMode('chat');
  };

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    let currentId = activeChatId;
    let currentChatMessages: Message[] = [];

    // اگر چت فعالی وجود ندارد، یکی می‌سازیم
    if (!currentId) {
      const newChat: ChatSession = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        title: text.substring(0, 30),
        messages: [],
        createdAt: Date.now(),
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      currentId = newChat.id;
    } else {
      const chat = chats.find(c => c.id === currentId);
      if (chat) currentChatMessages = chat.messages;
    }

    const userMsg: Message = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      role: 'user',
      content: text,
    };

    // پیام کاربر را فوراً به صفحه اضافه می‌کنیم
    setChats(prev =>
        prev.map(c => (c.id === currentId ? { ...c, messages: [...c.messages, userMsg] } : c))
    );

    setIsGenerating(true);

    try {
      if (inputMode === 'chat') {
        // ۱. آماده‌سازی تاریخچه چت برای ارسال به بک‌اند
        const history = currentChatMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        // ۲. ارسال درخواست امن به مسیر بک‌اند اختصاصی (/api/chat)
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, history }),
        });

        const data = await response.json();

        // بررسی خطای احتمالی از سمت سرور
        if (!response.ok) {
          throw new Error(data.error || 'پاسخی از سرور دریافت نشد');
        }

        const aiMsg: Message = {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          role: 'ai',
          content: data.text,
        };

        // ۳. اضافه کردن پاسخ هوش مصنوعی به صفحه
        setChats(prev =>
            prev.map(c => (c.id === currentId ? { ...c, messages: [...c.messages, aiMsg] } : c))
        );

      } else {
        // برای حالت تصویر و ویدیو، به دلیل عدم پشتیبانی مستقیم جمنای از تصویرسازی، شبیه‌سازی را نگه می‌داریم
        setTimeout(() => {
          let mediaMsg: Message;
          if (inputMode === 'image') {
            const seed = Math.floor(Math.random() * 1000);
            mediaMsg = {
              id: Date.now().toString(36),
              role: 'image',
              content: `https://picsum.photos/seed/${seed}/512/512`,
              prompt: text
            };
          } else {
            mediaMsg = {
              id: Date.now().toString(36),
              role: 'ai',
              content: '🎬 **ویدیو شما در حال پردازش است...**',
            };
          }
          setChats(prev => prev.map(c => (c.id === currentId ? { ...c, messages: [...c.messages, mediaMsg] } : c)));
          setIsGenerating(false);
        }, 1500);
        return; // خروج از تابع برای حالت‌های مدیا
      }
    } catch (error) {
      console.error("ارتباط با سرور قطع شد:", error);

      const errorMsg: Message = {
        id: Date.now().toString(36),
        role: 'ai',
        content: '⚠️ **خطا در ارتباط با سرور.** لطفاً اتصال اینترنت خود را بررسی کنید یا مطمئن شوید کلید API در سرور به درستی تنظیم شده است.',
      };
      setChats(prev =>
          prev.map(c => (c.id === currentId ? { ...c, messages: [...c.messages, errorMsg] } : c))
      );
    } finally {
      setIsGenerating(false);
      setInputMode('chat');
    }
  };

  const value = {
    chats,
    activeChatId,
    activeChat,
    isGenerating,
    inputMode,
    setInputMode,
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};