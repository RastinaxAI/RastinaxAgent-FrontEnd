'use client';

import { useMemo, useState } from 'react';
import { useUI } from '~/context/UIContext';
import { useChat } from '~/context/ChatContext';
import { useAuth } from '~/context/AuthContext';
import { useModal } from '~/context/ModalContext';
import { useToast } from '~/components/ui/Toast';
import { getTranslations } from '~/lib/i18n';
import { cn } from '~/lib/utils';
import type { ToolType } from '~/types/chat';

type DateGroup = 'today' | 'yesterday' | 'previous';

function getDateGroup(timestamp: number): DateGroup {
  const now = new Date();
  const date = new Date(timestamp);

  if (now.toDateString() === date.toDateString()) return 'today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) return 'yesterday';

  return 'previous';
}

export function Sidebar() {
  const {
    sidebarOpen,
    mobileSidebarOpen,
    theme,
    lang,
    toggleSidebar,
    closeMobileSidebar,
    setTheme,
    setLang,
  } = useUI();
  const {
    chats,
    activeChatId,
    createNewChat,
    startToolChat,
    selectChat,
    deleteChat,
  } = useChat();
  const { isLoggedIn, userPhone, plan, imageGenUsed, logout } = useAuth();
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const translations = getTranslations(lang);

  const filteredChats = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return chats;
    return chats.filter((chat) => chat.title.toLowerCase().includes(query));
  }, [chats, searchTerm]);

  const groupedChats = useMemo(
    () =>
      ({
        today: filteredChats.filter((chat) => getDateGroup(chat.createdAt) === 'today'),
        yesterday: filteredChats.filter(
          (chat) => getDateGroup(chat.createdAt) === 'yesterday',
        ),
        previous: filteredChats.filter(
          (chat) => getDateGroup(chat.createdAt) === 'previous',
        ),
      }) satisfies Record<DateGroup, typeof chats>,
    [filteredChats],
  );

  const handleNewChat = () => {
    createNewChat();
    closeMobileSidebar();
  };

  const handleToolClick = (mode: ToolType) => {
    if (!isLoggedIn) {
      openModal('auth');
      return;
    }

    if (mode === 'image' && plan === 'free' && imageGenUsed) {
      openModal('upsell');
      return;
    }

    if (mode === 'video' && plan === 'free') {
      openModal('upsell');
      return;
    }

    startToolChat(mode);
    closeMobileSidebar();
  };

  const handleDelete = (id: string) => {
    deleteChat(id);
    showToast(lang === 'fa' ? 'چت حذف شد' : 'Chat deleted');
  };

  const toggleSearch = () => {
    setSearchOpen((open) => {
      if (open) setSearchTerm('');
      return !open;
    });
  };

  const renderChatItem = (chat: (typeof chats)[number]) => {
    const isActive = chat.id === activeChatId;
    return (
      <div
        key={chat.id}
        className={cn(
          'sidebar-item group mx-1 mb-0.5 flex cursor-pointer items-center gap-2 px-3 py-2.5',
          isActive && 'active',
        )}
        onClick={() => {
          selectChat(chat.id);
          closeMobileSidebar();
        }}
      >
        <i
          className={cn(
            'fa-regular fa-message flex-shrink-0 text-xs',
            isActive ? 'text-brand-500' : 'text-[var(--tx-m)]',
          )}
        />
        <span className="min-w-0 flex-1 truncate text-sm text-[var(--tx-p)]">
          {chat.title}
        </span>
        <button
          type="button"
          aria-label={lang === 'fa' ? 'حذف چت' : 'Delete chat'}
          className="chat-item-delete flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[var(--tx-m)] transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(chat.id);
          }}
        >
          <i className="fa-solid fa-xmark text-xs" />
        </button>
      </div>
    );
  };

  return (
    <>
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label={lang === 'fa' ? 'بستن منو' : 'Close menu'}
          className="sidebar-overlay active"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={cn(
          'sidebar border-e',
          !sidebarOpen && 'collapsed',
          mobileSidebarOpen && 'mobile-open',
        )}
        aria-label={lang === 'fa' ? 'تاریخچه چت' : 'Chat history'}
      >
        <div className="flex min-w-[252px] items-center gap-1 p-3">
          <button
            type="button"
            className="hdr-icon"
            aria-label={lang === 'fa' ? 'بستن سایدبار' : 'Close sidebar'}
            onClick={toggleSidebar}
          >
            <i className="fa-solid fa-xmark text-base" />
          </button>
          <button
            type="button"
            className={cn('hdr-icon', searchOpen && 'bg-[var(--bg-h)]')}
            aria-label={lang === 'fa' ? 'جستجو' : 'Search'}
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            <i className="fa-solid fa-magnifying-glass text-sm" />
          </button>
          <button
            type="button"
            className="new-chat-btn flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium"
            onClick={handleNewChat}
          >
            <i className="fa-solid fa-plus text-xs" />
            <span>{translations.sidebar.newChat}</span>
          </button>
        </div>

        <div className={cn('search-wrap px-3 pb-1', searchOpen && 'open')}>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-xs text-[var(--tx-m)]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="search-input text-xs"
              placeholder={translations.sidebar.searchPlaceholder}
              aria-label={translations.sidebar.searchPlaceholder}
              autoFocus={searchOpen}
            />
          </div>
        </div>

        <div className="min-w-[252px] flex-1 overflow-y-auto px-2 pb-2">
          <button
            type="button"
            className="tool-item"
            onClick={() => handleToolClick('image')}
          >
            <div className="tool-icon bg-violet-100 text-violet-700 dark:bg-violet-200 dark:text-violet-900">
              <i className="fa-solid fa-wand-magic-sparkles" />
            </div>
            <div className="flex-1 text-start">
              <div className="font-medium text-[13px]">
                {translations.sidebar.imageGeneration}
              </div>
            </div>
          </button>
          <button
            type="button"
            className="tool-item"
            onClick={() => handleToolClick('video')}
          >
            <div className="tool-icon bg-rose-100 text-rose-700 dark:bg-rose-200 dark:text-rose-900">
              <i className="fa-solid fa-clapperboard" />
            </div>
            <div className="flex-1 text-start">
              <div className="font-medium text-[13px]">
                {translations.sidebar.videoGeneration}
              </div>
            </div>
          </button>
          <button
            type="button"
            className="tool-item"
            onClick={() => handleToolClick('site')}
          >
            <div className="tool-icon bg-cyan-100 text-cyan-700 dark:bg-cyan-200 dark:text-cyan-900">
              <i className="fa-solid fa-globe" />
            </div>
            <div className="flex-1 text-start">
              <div className="font-medium text-[13px]">
                {translations.sidebar.siteGeneration}
              </div>
            </div>
          </button>

          <div className="history-sep" />

          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <i className="fa-regular fa-comment-dots mb-2 text-2xl text-[var(--tx-m)]" />
              <p className="text-xs text-[var(--tx-m)]">
                {translations.sidebar.noChats}
              </p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <i className="fa-solid fa-magnifying-glass mb-2 text-lg text-[var(--tx-m)]" />
              <p className="text-xs text-[var(--tx-m)]">
                {translations.sidebar.noResults}
              </p>
            </div>
          ) : (
            ([
              ['today', translations.sidebar.today],
              ['yesterday', translations.sidebar.yesterday],
              ['previous', translations.sidebar.previous],
            ] as const).map(([key, label]) =>
              groupedChats[key].length > 0 ? (
                <div key={key}>
                  <div className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-[var(--tx-m)]">
                    {label}
                  </div>
                  {groupedChats[key].map(renderChatItem)}
                </div>
              ) : null,
            )
          )}
        </div>

        <div className="min-w-[252px] border-t border-[var(--bc)] p-3">
          {isLoggedIn && (
            <button
              type="button"
              className="sb-user-card w-[calc(100%-16px)] text-start"
              onClick={() => openModal('profile')}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {userPhone.slice(-2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold" dir="ltr">
                    {userPhone}
                  </div>
                  <span
                    className={cn(
                      'plan-tag',
                      plan === 'pro' &&
                        'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
                      plan === 'enterprise' &&
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                      plan === 'free' &&
                        'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                    )}
                  >
                    {translations.plans[plan].name}
                  </span>
                </div>
              </div>
            </button>
          )}

          <div className="space-y-0.5">
            <button
              type="button"
              className="sidebar-item flex w-full items-center justify-between px-3 py-2.5"
              onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
            >
              <span className="flex items-center gap-3">
                <i className="fa-solid fa-language w-5 text-center text-sm text-[var(--tx-m)]" />
                <span className="text-sm text-[var(--tx-p)]">
                  {lang === 'fa'
                    ? translations.sidebar.persian
                    : translations.sidebar.english}
                </span>
              </span>
              <span className={cn('toggle-track', lang === 'fa' && 'active')}>
                <span className="toggle-thumb" />
              </span>
            </button>

            <button
              type="button"
              className="sidebar-item flex w-full items-center justify-between px-3 py-2.5"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <span className="flex items-center gap-3">
                <i
                  className={cn(
                    'fa-solid w-5 text-center text-sm text-[var(--tx-m)]',
                    theme === 'dark' ? 'fa-sun' : 'fa-moon',
                  )}
                />
                <span className="text-sm text-[var(--tx-p)]">
                  {theme === 'dark'
                    ? translations.sidebar.lightTheme
                    : translations.sidebar.darkTheme}
                </span>
              </span>
              <span className={cn('toggle-track', theme === 'dark' && 'active')}>
                <span className="toggle-thumb" />
              </span>
            </button>

            {isLoggedIn ? (
              <button
                type="button"
                className="sidebar-item flex w-full items-center gap-3 px-3 py-2.5 text-start"
                onClick={() => {
                  logout();
                  showToast(translations.common.logout);
                }}
              >
                <i className="fa-solid fa-right-from-bracket w-5 text-center text-sm text-[var(--tx-m)]" />
                <span className="text-sm text-[var(--tx-p)]">
                  {translations.sidebar.logout}
                </span>
              </button>
            ) : (
              <div className="px-0.5 pb-1 pt-2">
                <button
                  type="button"
                  className="sb-login-btn"
                  onClick={() => openModal('auth')}
                >
                  <i className="fa-solid fa-right-to-bracket" />
                  <span>{translations.sidebar.login}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
