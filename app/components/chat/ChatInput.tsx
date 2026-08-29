'use client';

// اصلاح: ایمپورت React و هوک‌ها به صورت جدا
import React, { useState, useRef } from 'react';
// اصلاح: ایمپورت تایپ‌های رویداد فقط به عنوان TYPE با استفاده از کلمه کلیدی type
import type { ChangeEvent, KeyboardEvent } from 'react';

import { useChat } from '~/context/ChatContext';
import { useUI } from '~/context/UIContext';
import { useAutoResize } from '~/hooks/useAutoResize';

export const ChatInput: React.FC = () => {
  const { lang } = useUI();
  const { sendMessage, isGenerating } = useChat();
  
  // ۱. استیت محلی برای متن اینپوت
  const [messageText, setMessageText] = useState('');
  
  // ۲. رفرنس بهtextarea برای مدیریت ارتفاع و فوکوس
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // ۳. استفاده از هوک سفارشی برای مدیریت ارتفاع
  const { resizeTextarea } = useAutoResize(textareaRef);

  // ۴. مدیریت تغییر متن
  // تایپ ChangeEvent اینجا به درستی استفاده شده
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    resizeTextarea(); // آپدیت ارتفاع
  };

  // ۵. مدیریت کلید اینتر (ارسال پیام)
  // تایپ KeyboardEvent اینجا به درستی استفاده شده
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // اینتر بدون شیفت، پیام را ارسال کند
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // جلوگیری از ایجاد خط جدید
      handleSend();
    }
  };

  // ۶. متد ارسال پیام
  const handleSend = () => {
    if (!messageText.trim() || isGenerating) return;
    sendMessage(messageText);
    setMessageText(''); // ریست کردن متن
    // ریست کردن ارتفاع textarea بعد از ارسال
    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, 0);
  };

  const texts = {
    fa: { placeholder: 'پیام خود را بنویسید...', disclaimer: 'NexChat ممکن است اشتباه کند. اطلاعات مهم را بررسی کنید.' },
    en: { placeholder: 'Message NexChat...', disclaimer: 'NexChat can make mistakes. Consider checking important information.' },
  };

  // سوییچ زبان برای اینپوت (فعلاً هاردکد برای سادگی)
  const isRTL = lang === 'fa';

  return (
    <div className="input-area-container px-3 sm:px-4 pb-3 sm:pb-4 pt-2 bg-[var(--bg-p)]">
      <div className="max-w-3xl mx-auto rounded-2xl p-3 bg-[var(--bg-c)] border border-[var(--bc)] shadow-2xl shadow-black/5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15 transition relative">
        <div className="flex items-end gap-2.5 relative">
          
          {/* دکمه پاپ‌آپ گیره کاغذ (فعلاً آزمایشی) */}
          <button className="hdr-icon mb-0.5" onClick={() => alert('منوی گیره کاغذ باز شود')}>
            <i className="fa-solid fa-paperclip text-base"></i>
          </button>
          
          {/* تکست‌اِریا ورودی اصلی */}
          <textarea 
            ref={textareaRef}
            value={messageText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="input-field text-sm leading-relaxed py-1.5 flex-1 bg-transparent text-[var(--tx-p)] resize-none outline-none placeholder:text-[var(--tx-m)]" 
            placeholder={texts[lang].placeholder}
          />
          
          {/* دکمه ارسال پویان */}
          <button 
            id="sendBtn" 
            onClick={handleSend}
            disabled={!messageText.trim() || isGenerating}
            className={`
              send-btn w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 transition-all
              ${!messageText.trim() || isGenerating 
                ? 'bg-[var(--bg-t)] text-[var(--tx-m)] cursor-not-allowed' 
                : 'bg-brand-500 text-white hover:bg-brand-600 active:scale-95 hover:scale-105 shadow shadow-brand-600/20'}
            `}
          >
            <i className={`fa-solid ${isRTL ? 'fa-arrow-left' : 'fa-arrow-right'} text-sm`}></i>
          </button>
        </div>
        
        {/* سلب مسئولیت زیر اینپوت */}
        <div className="text-[10px] text-[var(--tx-m)] mt-2 text-center">
          {texts[lang].disclaimer}
        </div>
      </div>
    </div>
  );
};