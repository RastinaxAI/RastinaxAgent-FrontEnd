'use client';

import React from 'react';
import { useChat } from '~/context/ChatContext';
import { useUI } from '~/context/UIContext';
import type { Lang } from '~/context/UIContext';

// داده‌های نمونه برای پیشنهادها (فعلاً هاردکد)
const SUGGESTIONS = {
  fa: [
    { key: 'sug1', label: 'کد', text: 'یک نوار ناوبری ریسپانسیو با تیلویند بساز' },
    { key: 'sug2', label: 'توضیح', text: 'محاسبه کوانتومی را به زبان ساده توضیح بده' },
    { key: 'sug3', label: 'نوشتن', text: 'یک ایمیل حرفه‌ای برای درخواست کار بنویس' },
    { key: 'sug4', label: 'تحلیل', text: 'مقایسه React و Vue برای یک پروژه جدید' },
  ],
  en: [
    { key: 'sug1', label: 'Code', text: 'Write a responsive navbar with Tailwind CSS' },
    { key: 'sug2', label: 'Explain', text: 'Explain quantum computing in simple terms' },
    { key: 'sug3', label: 'Write', text: 'Write a professional email for a job application' },
    { key: 'sug4', label: 'Analyze', text: 'Compare React vs Vue for a new project' },
  ],
};

const LOGO_URL = 'https://z-cdn-media.chatglm.cn/files/88ac9b08-2605-4b77-ac97-790e3b4f58cb.png?auth_key=1887733333-d4ca11bee00d46e3a896611b9d191a13-0-8a7ede6eda1129eecc50a6af6d7b30ce';

export const WelcomeScreen: React.FC = () => {
  const { lang } = useUI();
  const { createNewChat, sendMessage } = useChat();

  const handleSuggestionClick = (text: string) => {
    // ابتدا چت جدید بساز، سپس پیام را ارسال کن
    createNewChat();
    // ما یک تاخیر کوچک می‌دهیم تا چت فعال شود (در یک اپ واقعی این بهتر مدیریت می‌شود)
    setTimeout(() => {
      sendMessage(text);
    }, 10);
  };

  const texts = {
    fa: { title: 'چطور می‌تونم کمکت کنم؟', sub: 'مکالمه رو شروع کنید یا یکی از پیشنهادهای زیر رو انتخاب کنید' },
    en: { title: 'How can I help you today?', sub: 'Start a conversation or pick a suggestion below' },
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 bg-[var(--bg-p)]">
      {/* لوگوی بزرگ */}
      <img src={LOGO_URL} alt="NexChat Logo" className="w-16 h-16 rounded-2xl mb-6 shadow-lg shadow-brand-600/10" />
      
      {/* عنوان و زیرعنوان */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[var(--tx-p)]">
        {texts[lang].title}
      </h1>
      <p className="text-[var(--tx-m)] text-sm mb-8 text-center max-w-sm">
        {texts[lang].sub}
      </p>
      
      {/* گرید پیشنهادها */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl">
        {SUGGESTIONS[lang].map((sug) => (
          <div 
            key={sug.key} 
            onClick={() => handleSuggestionClick(sug.text)}
            className="bg-[var(--bg-sb)] border border-[var(--bc)] rounded-2xl p-4 cursor-pointer transition hover:border-brand-500 hover:bg-[var(--bg-h)] hover:translate-y-[-2px] hover:shadow-lg shadow-black/5"
          >
            <div className="text-xs text-brand-600 dark:text-brand-400 font-medium mb-1.5 uppercase">
              {sug.label}
            </div>
            <div className="text-sm text-[var(--tx-p)] leading-relaxed">
              {sug.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};