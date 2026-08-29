// اصلاح: ایمپورتReact و createContext به صورت جدا
import React, { createContext, useContext, useState, useEffect } from 'react';
// اصلاح: ایمپورت ReactNode فقط به عنوان یک TYPE
import type { ReactNode } from 'react';

// تعریف تایپ‌ها برای تم و زبان
type Theme = 'light' | 'dark';
type Lang = 'fa' | 'en';

// تعریف اینترفیس برای استیت کانتکست
interface UIContextType {
  sidebarOpen: boolean; // وضعیت سایدبار در دسکتاپ
  mobileSidebarOpen: boolean; // وضعیت سایدبار در موبایل
  theme: Theme; // تم فعلی
  lang: Lang; // زبان فعلی
  toggleSidebar: () => void; // متد سوییچ سایدبار دسکتاپ
  toggleMobileSidebar: () => void; // متد سوییچ سایدبار موبایل
  closeMobileSidebar: () => void; // متد بستن سایدبار موبایل (بعد از کلیک روی چت)
  setTheme: (theme: Theme) => void; // متد تغییر تم
  setLang: (lang: Lang) => void; // متد تغییر زبان
}

// ساخت خود کانتکست با مقدار اولیه undefined
const UIContext = createContext<UIContextType | undefined>(undefined);

// پیاده‌سازی پرووایدر کانتکست
export const UIProvider = ({ children }: { children: ReactNode }) => {
  // تعریف استیت‌ها
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // لود تم و زبان از localStorage (یا دیفالت)
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('nexchat_theme');
      return (savedTheme as Theme) || 'light';
    }
    return 'light';
  });
  
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('nexchat_lang');
      return (savedLang as Lang) || 'fa'; // فعلاً دیفالت فارسی
    }
    return 'fa';
  });

  // اعمال تم و زبان به DOM در زمان تغییر
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('nexchat_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    localStorage.setItem('nexchat_lang', lang);
  }, [lang]);

  // تعریف متدها
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleMobileSidebar = () => setMobileSidebarOpen(prev => !prev);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);
  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setLang = (newLang: Lang) => setLangState(newLang);

  // تجمیع مقادیر برای ارسال به کانتکست
  const value = {
    sidebarOpen,
    mobileSidebarOpen,
    theme,
    lang,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    setTheme,
    setLang,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// ساخت یه هوک سفارشی برای استفاده راحت از کانتکست
export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};