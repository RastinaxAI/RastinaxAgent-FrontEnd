'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Message, ChatSession } from '../types/chat';
// ۱. هوک جدید را ایمپورت کنید
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
  // ۲. جایگزین کردن useState با هوک useChatHistory
  const { chats, setChats, isLoaded } = useChatHistory();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('chat');

  // ۳. انتخاب خودکار آخرین چت در زمان لود شدن (اختیاری)
  useEffect(() => {
    if (isLoaded && chats.length > 0 && !activeChatId) {
      // اگر دوست ندارید آخرین چت خودکار باز شود، می‌توانید این بخش را پاک کنید
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
    // اضافه کردن چت جدید به ابتدای لیست
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
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    let currentId = activeChatId;
    if (!currentId) {
      const newChat: ChatSession = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        title: text.substring(0, 30), // عنوان چت از روی پیام اول ساخته می‌شود
        messages: [],
        createdAt: Date.now(),
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      currentId = newChat.id;
    }

    const userMsg: Message = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      role: 'user',
      content: text,
    };

    setChats(prev =>
        prev.map(c => (c.id === currentId ? { ...c, messages: [...c.messages, userMsg] } : c))
    );

    setIsGenerating(true);

    setTimeout(() => {
      let aiMsg: Message;

      if (inputMode === 'image') {
        const seed = Math.floor(Math.random() * 1000);
        aiMsg = {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          role: 'image',
          content: `https://picsum.photos/seed/${seed}/512/512`,
          prompt: text
        };
      } else if (inputMode === 'video') {
        aiMsg = {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          role: 'ai',
          content: '🎬 **ویدیو شما در حال پردازش است...**\n\nبسته به حجم درخواست، این فرایند ممکن است چند دقیقه طول بکشد.',
        };
      } else {
        aiMsg = {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          role: 'ai',
          content: `این پاسخ شبیه‌سازی شده هوش مصنوعی برای: "${text}" است.`,
        };
      }

      setChats(prev =>
          prev.map(c => (c.id === currentId ? { ...c, messages: [...c.messages, aiMsg] } : c))
      );

      setIsGenerating(false);
      setInputMode('chat');
    }, 1200);
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