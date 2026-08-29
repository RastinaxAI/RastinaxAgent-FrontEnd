'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '~/types/chat';
import { CodeBlock } from '../ui/CodeBlock'; // ایمپورت کامپوننت کدی که الان ساختیم

interface MessageBubbleProps {
  message: Message;
}

const LOGO_URL = 'https://z-cdn-media.chatglm.cn/files/88ac9b08-2605-4b77-ac97-790e3b4f58cb.png?auth_key=1887733333-d4ca11bee00d46e3a896611b9d191a13-0-8a7ede6eda1129eecc50a6af6d7b30ce';

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

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

  return (
    <div className={`flex w-full fade-in-up ${isUser ? 'justify-end' : 'justify-start items-start gap-3'}`}>
      
      {!isUser && (
        <img src={LOGO_URL} alt="AI" className="w-8 h-8 rounded-lg flex-shrink-0 mt-1 object-cover" />
      )}

      <div 
        className={`
          rounded-2xl px-4 py-3 max-w-[95%] sm:max-w-[85%] text-sm leading-relaxed
          ${isUser 
            ? 'bg-brand-600 text-white rounded-tr-sm shadow-sm' 
            : 'bg-[var(--bg-s)] text-[var(--tx-p)] rounded-tl-sm border border-[var(--bc)]'}
        `}
      >
        {/* رندر کردن متن با پشتیبانی از مارک‌داون */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          // اعمال استایل‌های سفارشی به المان‌های تولید شده توسط مارک‌داون
          components={{
            // مدیریت کدهای اینلاین و بلوک‌های کد
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              
              // اگر بلوک کد چندخطی بود، کامپوننت CodeBlock را رندر کن
              if (!inline) {
                return <CodeBlock code={codeString} language={match ? match[1] : undefined} />;
              }
              // اگر کد اینلاین (یک خطی) بود، این استایل را بده
              return (
                <code className="bg-[var(--bg-t)] px-1.5 py-0.5 rounded text-[0.9em] font-mono text-brand-600 dark:text-brand-400" dir="ltr" {...props}>
                  {children}
                </code>
              );
            },
            // استایل‌دهی به تگ‌های متداول در چت
            p: ({ node, ...props }) => <p className="my-1.5 whitespace-pre-wrap" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc ps-5 my-2 space-y-1" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal ps-5 my-2 space-y-1" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold text-[var(--tx-p)]" {...props} />,
            a: ({ node, ...props }) => <a className="text-brand-500 hover:underline" target="_blank" rel="noreferrer" {...props} />,
            // استایل‌دهی به جداول
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-3 rounded-lg border border-[var(--bc)]">
                <table className="w-full border-collapse text-sm text-start" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => <th className="border-b border-[var(--bc)] bg-[var(--bg-t)] px-4 py-2 font-semibold text-[var(--tx-p)]" {...props} />,
            td: ({ node, ...props }) => <td className="border-b border-[var(--bc)] px-4 py-2" {...props} />
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>

    </div>
  );
};