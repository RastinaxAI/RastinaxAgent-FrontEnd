// اصلاح: ایمپورت React و کانتکست‌ها به صورت جدا
import React, { createContext, useContext, useState } from 'react';
// اصلاح: ایمپورت ReactNode فقط به عنوان یک TYPE
import type { ReactNode } from 'react';
// ایمپورت تایپ‌های چت
import type { Message, ChatSession } from '../types/chat';

// تعریف اینترفیس برای استیت کانتکست
interface ChatContextType {
  chats: ChatSession[]; // لیست تمامی چت‌ها
  activeChatId: string | null; // ID چت فعال
  activeChat: ChatSession | undefined; // داده‌های چت فعال
  isGenerating: boolean; // وضعیت در حال تولید پاسخ AI
  createNewChat: () => void; // متد ساخت چت جدید
  selectChat: (id: string) => void; // متد انتخاب چت
  deleteChat: (id: string) => void; // متد حذف چت
  sendMessage: (text: string) => Promise<void>; // متد ارسال پیام
}

// ساخت خود کانتکست با مقدار اولیه undefined
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// پیاده‌سازی پرووایدر کانتکست
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  // تعریف استیت‌ها (فعلاً با داده‌های هاردکد شده)
  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: 'chat1',
      title: 'نوار ناوبری ریسپانسیو',
      messages: [],
      createdAt: Date.now(),
    },
    {
      id: 'chat2',
      title: 'محاسبه کوانتومی',
      messages: [],
      createdAt: Date.now() - 86400000, // دیروز
    },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // پیدا کردن داده‌های چت فعال
  const activeChat = chats.find(c => c.id === activeChatId);

  // تعریف متدها
  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: 'چت جدید', // بعداً با اولین پیام آپدیت میشه
      messages: [],
      createdAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const selectChat = (id: string) => setActiveChatId(id);

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  // فعلاً یه متد ساده برای ارسال پیام
  const sendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;
    
    let currentId = activeChatId;
    // اگر چتی فعال نبود، یه چت جدید بساز
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
    }

    const userMsg: Message = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      role: 'user',
      content: text,
    };

    // آپدیت کردن پیام‌های چت فعال
    setChats(prev =>
      prev.map(c => (c.id === currentId ? { ...c, messages: [...c.messages, userMsg] } : c))
    );

    setIsGenerating(true);
    // شبیه‌سازی پاسخ AI (به زودی با استریم واقعی جایگزین میشه)
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        role: 'ai',
        content: `این پاسخ شبیه‌سازی شده برای: "${text}" است.`,
      };
      setChats(prev =>
        prev.map(c => (c.id === currentId ? { ...c, messages: [...c.messages, aiMsg] } : c))
      );
      setIsGenerating(false);
    }, 1000);
  };

  // تجمیع مقادیر برای ارسال به کانتکست
  const value = {
    chats,
    activeChatId,
    activeChat,
    isGenerating,
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// ساخت یه هوک سفارشی برای استفاده راحت از کانتکست
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};