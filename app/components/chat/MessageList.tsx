'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from '~/context/ChatContext';
import { MessageBubble } from './MessageBubble';

const LOGO_URL = 'https://z-cdn-media.chatglm.cn/files/88ac9b08-2605-4b77-ac97-790e3b4f58cb.png?auth_key=1887733333-d4ca11bee00d46e3a896611b9d191a13-0-8a7ede6eda1129eecc50a6af6d7b30ce';

export const MessageList: React.FC = () => {
  const { activeChat, isGenerating } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // هر بار که پیام‌ها تغییر می‌کنند یا وضعیت isGenerating عوض می‌شود، به پایین اسکرول کن
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages, isGenerating]);

  // اگر چت فعالی نداریم، چیزی رندر نکن (WelcomeScreen جای آن را می‌گیرد)
  if (!activeChat) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6 flex-1">
      
      {/* رندر کردن تک‌تک پیام‌ها */}
      {activeChat.messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* نشانگر در حال تایپ... (فقط وقتی isGenerating درست است) */}
      {isGenerating && (
        <div className="flex items-start gap-3 fade-in-up">
          <img src={LOGO_URL} alt="AI" className="w-8 h-8 rounded-lg flex-shrink-0 mt-1 object-cover" />
          <div className="bg-[var(--bg-s)] border border-[var(--bc)] rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5 w-16">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--tx-m)] animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--tx-m)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--tx-m)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}

      {/* یک عنصر نامرئی در انتهای لیست برای تارگت اسکرول */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
};