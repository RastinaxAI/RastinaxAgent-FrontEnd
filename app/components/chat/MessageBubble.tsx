'use client';

import React from 'react';
import type { Message } from '~/types/chat';

interface MessageBubbleProps {
  message: Message;
}

const LOGO_URL = 'https://z-cdn-media.chatglm.cn/files/88ac9b08-2605-4b77-ac97-790e3b4f58cb.png?auth_key=1887733333-d4ca11bee00d46e3a896611b9d191a13-0-8a7ede6eda1129eecc50a6af6d7b30ce';

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // اگر پیام از نوع تصویر بود
  if (message.role === 'image') {
    return (
      <div className="flex items-start gap-3 w-full fade-in-up">
        <img src={LOGO_URL} alt="AI" className="w-8 h-8 rounded-lg flex-shrink-0 mt-1 object-cover" />
        <div className="bg-[var(--bg-s)] rounded-2xl rounded-tl-sm p-3 max-w-[85%] sm:max-w-[80%] border border-[var(--bc)]">
          <img src={message.content} alt="Generated" className="rounded-xl w-full max-w-sm shadow-md" />
        </div>
      </div>
    );
  }

  // رندر کردن پیام متنی
  return (
    <div className={`flex w-full fade-in-up ${isUser ? 'justify-end' : 'justify-start items-start gap-3'}`}>
      
      {/* آواتار هوش مصنوعی (فقط برای پیام‌های AI) */}
      {!isUser && (
        <img src={LOGO_URL} alt="AI" className="w-8 h-8 rounded-lg flex-shrink-0 mt-1 object-cover" />
      )}

      {/* حباب پیام */}
      <div 
        className={`
          rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap
          ${isUser 
            ? 'bg-brand-600 text-white rounded-tr-sm shadow-sm' 
            : 'bg-[var(--bg-s)] text-[var(--tx-p)] rounded-tl-sm border border-[var(--bc)]'}
        `}
      >
        {message.content}
      </div>

    </div>
  );
};