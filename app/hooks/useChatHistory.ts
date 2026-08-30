'use client';

import { useState, useEffect } from 'react';
import type { ChatSession } from '~/types/chat';

const STORAGE_KEY = 'nexchat_history';

export const useChatHistory = () => {
    // استیت اصلی برای نگهداری چت‌ها
    const [chats, setChats] = useState<ChatSession[]>([]);
    // استیتی برای اینکه بفهمیم اطلاعات از حافظه لود شده یا نه (برای جلوگیری از باگ‌های Hydration)
    const [isLoaded, setIsLoaded] = useState(false);

    // ۱. خواندن اطلاعات از LocalStorage در زمان لود شدن برنامه
    useEffect(() => {
        try {
            const storedChats = localStorage.getItem(STORAGE_KEY);
            if (storedChats) {
                setChats(JSON.parse(storedChats));
            }
        } catch (error) {
            console.error('خطا در بارگذاری تاریخچه چت‌ها:', error);
        }
        setIsLoaded(true);
    }, []);

    // ۲. ذخیره خودکار اطلاعات در LocalStorage با هر تغییر در لیست چت‌ها
    useEffect(() => {
        // فقط زمانی ذخیره کن که اطلاعات اولیه لود شده باشه
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
        }
    }, [chats, isLoaded]);

    return { chats, setChats, isLoaded };
};