'use client'; // این کامپوننت نیاز به تعامل کاربر دارد

import React, { useState } from 'react';
import { useUI } from '~/context/UIContext';
import { useChat } from '~/context/ChatContext';

// توابع کمکی برای تاریخ (به فارسی)
const getPersianDateLabel = (timestamp: number): string => {
  const now = new Date();
  const date = new Date(timestamp);
  
  const isToday = now.toDateString() === date.toDateString();
  if (isToday) return 'امروز';
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();
  if (isYesterday) return 'دیروز';
  
  return 'قبلی'; // برای سادگی فعلاً
};

export const Sidebar: React.FC = () => {
  // ۱. دریافت وضعیت و متدها از UIContext
  const { 
    sidebarOpen, mobileSidebarOpen, theme, lang,
    toggleSidebar, toggleMobileSidebar, closeMobileSidebar,
    setTheme, setLang 
  } = useUI();

  // ۲. دریافت داده‌ها و متدها از ChatContext
  const { 
    chats, activeChatId, createNewChat, selectChat, deleteChat 
  } = useChat();

  // ۳. استیت محلی برای سرچ (فعلاً ساده)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // ۴. گروه‌بندی چت‌ها بر اساس تاریخ
  const groupedChats = chats
    .filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .reduce((groups, chat) => {
      const label = getPersianDateLabel(chat.createdAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(chat);
      return groups;
    }, {} as Record<string, typeof chats>);

  const dateOrders = ['امروز', 'دیروز', 'قبلی'];

  return (
    <>
      {/* ۵. Overlay برای موبایل (وقتی سایدبار باز است) */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity" 
          onClick={closeMobileSidebar}
        />
      )}

      {/* ۶. خود سایدبار (با کلاس‌های ریسپانسیو) */}
      <aside 
        className={`
          sidebar fixed inset-y-0 z-50 flex flex-col h-full bg-[var(--bg-sb)] border-e border-[var(--bc)] transition-transform duration-300 ease-in-out shrink-0 overflow-hidden
          ${sidebarOpen ? 'w-[280px] translate-x-0' : 'w-0 -translate-x-full md:w-0'}
          ${mobileSidebarOpen ? 'translate-x-0!' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
        style={{ minWidth: sidebarOpen ? '280px' : '0' }}
      >
        {/* هدر سایدبار */}
        <div className="p-3 flex items-center gap-1 min-w-[252px]">
          <button onClick={toggleMobileSidebar} className="hdr-icon md:hidden">
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
          <button onClick={() => setSearchOpen(prev => !prev)} className="hdr-icon">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </button>
          <button 
            onClick={() => { createNewChat(); closeMobileSidebar(); }} 
            className="new-chat-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>چت جدید</span>
          </button>
        </div>

        {/* بخش سرچ داینامیک */}
        <div className={`search-wrap px-3 pb-1 ${searchOpen ? 'open' : ''}`}>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute start-3 top-1/2 -translate-y-1/2 text-[var(--tx-m)] text-xs pointer-events-none hover:text-red-600 transition-colors"></i>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input text-xs" 
              placeholder="جستجو در چت‌ها..." 
            />
          </div>
        </div>

        {/* لیست چت‌ها (با اسکرول) */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 min-w-[252px] space-y-0.5 mt-1">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <i className="fa-regular fa-comment-dots text-2xl text-[var(--tx-m)] mb-2"></i>
              <p className="text-xs text-[var(--tx-m)]">هنوز مکالمه‌ای ندارید</p>
            </div>
          ) : (
            dateOrders.map(dateLabel => groupedChats[dateLabel] && (
              <div key={dateLabel}>
                <div className="px-3 pt-3 pb-1 text-[11px] font-medium text-[var(--tx-m)] uppercase tracking-wider">
                  {dateLabel}
                </div>
                {groupedChats[dateLabel].map(chat => (
                  <div 
                    key={chat.id} 
                    className={`sidebar-item flex items-center gap-2.5 px-3 py-2.5 mx-1 mb-0.5 cursor-pointer group rounded-lg transition ${chat.id === activeChatId ? 'active bg-[var(--bg-t)]' : 'hover:bg-[var(--bg-h)]'}`}
                    onClick={() => { selectChat(chat.id); closeMobileSidebar(); }}
                  >
                    <i className={`fa-regular fa-message text-xs ${chat.id === activeChatId ? 'text-brand-500' : 'text-[var(--tx-m)]'} flex-shrink-0`}></i>
                    <span className="text-sm truncate flex-1 text-[var(--tx-p)]">{chat.title}</span>
                    <button 
                      className="chat-item-delete w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-[var(--tx-m)] hover:text-red-500 transition-colors flex-shrink-0" 
                      onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                    >
                      <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* فوتر سایدبار (تنظیمات) */}
        <div className="min-w-[252px] p-3 border-t border-[var(--bc)] space-y-1">
          {/* سوییچ زبان */}
          <div 
            className="sidebar-item flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-lg hover:bg-[var(--bg-h)]" 
            onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-language text-[var(--tx-m)] text-sm w-5 text-center"></i>
              <span className="text-sm text-[var(--tx-p)]">{lang === 'fa' ? 'فارسی' : 'English'}</span>
            </div>
            <div className={`toggle-track ${lang === 'en' ? 'active bg-brand-500' : 'bg-[var(--bg-t)]'}`}>
              <div className="toggle-thumb bg-white shadow"></div>
            </div>
          </div>

          {/* سوییچ تم */}
          <div 
            className="sidebar-item flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-lg hover:bg-[var(--bg-h)]" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <div className="flex items-center gap-3">
              <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-[var(--tx-m)] text-sm w-5 text-center`}></i>
              <span className="text-sm text-[var(--tx-p)]">{theme === 'dark' ? 'حالت تاریک' : 'حالت روشن'}</span>
            </div>
            <div className={`toggle-track ${theme === 'dark' ? 'active bg-brand-500' : 'bg-[var(--bg-t)]'}`}>
              <div className="toggle-thumb bg-white shadow"></div>
            </div>
          </div>
          
          {/* دکمه لاگین (فعلاً ساده) */}
          <div className="pb-1 pt-2 px-0.5">
            <button className="sb-login-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border hover:border-brand-500 transition" onClick={() => alert('مودال لاگین باز شود')}>
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>ورود / ثبت‌نام</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};