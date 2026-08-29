'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUI } from '~/context/UIContext';
import { useAuth } from '~/context/AuthContext';

export const Header: React.FC = () => {
  const { toggleMobileSidebar } = useUI();
  const { isLoggedIn, userPhone, plan, login, logout } = useAuth();
  
  // استیت برای باز و بسته کردن منوی کشویی کاربر
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // بستن منو با کلیک بیرون از آن
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    // فعلاً یک لاگین تستی می‌نویسیم (بعداً مودال واقعی باز می‌شود)
    login('+98 912 345 6789');
    setDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-[var(--bc)] bg-[var(--bg-c)] transition-all">
      
      {/* بخش راست هدر: دکمه موبایل + لوگو */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={toggleMobileSidebar} className="hdr-icon md:hidden text-[var(--tx-s)] hover:bg-[var(--bg-h)] p-2 rounded-lg transition-colors">
          <i className="fa-solid fa-bars text-base"></i>
        </button>
        
        <div className="flex items-center gap-2.5 cursor-pointer">
          <img 
            src="https://z-cdn-media.chatglm.cn/files/88ac9b08-2605-4b77-ac97-790e3b4f58cb.png?auth_key=1887733333-d4ca11bee00d46e3a896611b9d191a13-0-8a7ede6eda1129eecc50a6af6d7b30ce" 
            alt="NexChat" 
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-bold text-lg tracking-tight hidden sm:inline text-[var(--tx-p)]">NexChat</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 font-semibold hidden sm:inline">AI</span>
        </div>
      </div>
      
      {/* بخش چپ هدر: مدل + پروفایل */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--tx-m)] hidden md:block">مدل: NexChat-4o</span>
        
        <div className="relative" ref={dropdownRef}>
          {/* دکمه پروفایل */}
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-s)] hover:bg-[var(--bg-h)] border border-[var(--bc)] transition-colors text-[var(--tx-p)]"
          >
            {isLoggedIn ? (
              <span className="text-xs font-bold">{userPhone.slice(-2)}</span>
            ) : (
              <i className="fa-regular fa-user text-sm"></i>
            )}
          </button>

          {/* منوی کشویی کاربر */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-[var(--bg-c)] border border-[var(--bc)] rounded-xl p-1.5 min-w-[180px] shadow-lg shadow-black/5 z-50 fade-in-up">
              
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 border-b border-[var(--bc)] mb-1">
                    <div className="text-sm font-semibold text-[var(--tx-p)]" dir="ltr">{userPhone}</div>
                    <div className="text-[11px] text-[var(--tx-m)] uppercase mt-0.5">اشتراک: {plan}</div>
                  </div>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--tx-s)] hover:bg-[var(--bg-h)] hover:text-[var(--tx-p)] rounded-lg transition-colors text-start">
                    <i className="fa-regular fa-user w-4 text-center"></i> پروفایل
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--tx-s)] hover:bg-[var(--bg-h)] hover:text-[var(--tx-p)] rounded-lg transition-colors text-start">
                    <i className="fa-solid fa-crown text-amber-500 w-4 text-center"></i> ارتقا اشتراک
                  </button>
                  <button 
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-start"
                  >
                    <i className="fa-solid fa-right-from-bracket w-4 text-center"></i> خروج
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLoginClick}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--tx-p)] hover:bg-[var(--bg-h)] rounded-lg transition-colors text-start"
                >
                  <i className="fa-solid fa-right-to-bracket w-4 text-center"></i> ورود / ثبت‌نام
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};