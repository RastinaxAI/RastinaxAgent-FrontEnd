'use client';

import React, { useState } from 'react';
import { useUI } from '~/context/UIContext';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const { lang } = useUI();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      // بعد از ۲ ثانیه وضعیت کپی به حالت اول برمی‌گردد
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[var(--bc)] bg-[#1e1e1e] text-gray-300 shadow-sm" dir="ltr">
      {/* هدر بلوک کد */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-xs">
        <span className="text-gray-400 font-mono lowercase">{language || 'code'}</span>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors focus:outline-none"
        >
          {copied ? (
            <>
              <i className="fa-solid fa-check text-emerald-500"></i>
              <span>{lang === 'fa' ? 'کپی شد!' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <i className="fa-regular fa-copy"></i>
              <span>{lang === 'fa' ? 'کپی' : 'Copy'}</span>
            </>
          )}
        </button>
      </div>
      
      {/* محتوای کد */}
      <div className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
};