'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { ChatSession, Message, ToolType } from '~/types/chat';
import { useChatHistory } from '~/hooks/useChatHistory';
import { useAuth } from '~/context/AuthContext';
import { useUI } from '~/context/UIContext';
import { getTranslations } from '~/lib/i18n';
import { STORAGE_KEYS } from '~/lib/constants';

export type InputMode = 'chat' | ToolType;

interface ChatContextType {
  chats: ChatSession[];
  activeChatId: string | null;
  activeChat: ChatSession | undefined;
  activeTool: ToolType | null;
  isGenerating: boolean;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  createNewChat: () => void;
  startToolChat: (tool: ToolType) => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const getDemoResponse = (message: string, lang: 'fa' | 'en') => {
  const value = message.toLowerCase();

  const responses = {
    en: {
      default: [
        'Great question! **Key Points:**\n\n1. Understand fundamentals\n2. Applications vary\n3. Consider trade-offs\n\nWant more detail?',
        "I'd be happy to help!\n\n- **Technical**: Well-documented\n- **Practical**: Varied\n- **Future**: Growth expected",
      ],
      navbar: `Responsive navbar:

\`\`\`html
<nav class="bg-white dark:bg-gray-900 shadow-lg">
  <div class="max-w-7xl mx-auto px-4 flex justify-between h-16">
    <a href="/" class="text-xl font-bold">Brand</a>
    <div class="hidden md:flex items-center space-x-8">
      <a href="#">Home</a><a href="#">About</a>
      <a href="#" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Start</a>
    </div>
  </div>
</nav>
\`\`\``,
      quantum: `**Quantum Computing:**

| Feature | Classical | Quantum |
|---------|-----------|---------|
| States | 0 or 1 | Both |
| Processing | Sequential | Parallel |

1. **Superposition** 2. **Entanglement** 3. **Interference**`,
      email: `Professional email:

---
**Subject:** Application for [Position]

Dear Hiring Manager,

I'm writing re: **[Position]** at **[Company]**.

**Highlights:**
- [Achievement 1]
- [Achievement 2]

Resume attached.

---`,
      reactVue: `**React vs Vue:**

| Scenario | Choose |
|----------|--------|
| Large team | React |
| Rapid prototyping | Vue |

Both excellent.`,
    },
    fa: {
      default: [
        'سوال خوبی بود!\n\n**نکات:**\n\n۱. مبانی رو درک کنید\n۲. کاربردها گسترده\n۳. معاوضه‌ها\n\nبیشتر توضیح بدم؟',
        'خوشحال می‌شم کمک کنم!\n\n- **فنی**: مستندات خوب\n- **عملی**: تفاوت زیاد\n- **آینده**: رشد ادامه‌دار',
      ],
      navbar: `نوار ناوبری:

\`\`\`html
<nav class="bg-white dark:bg-gray-900 shadow-lg">
  <div class="max-w-7xl mx-auto px-4 flex justify-between h-16">
    <a href="/" class="text-xl font-bold">برند</a>
    <div class="hidden md:flex items-center space-x-8">
      <a href="#">خانه</a><a href="#">خدمات</a>
      <a href="#" class="bg-blue-600 text-white px-4 py-2 rounded-lg">شروع</a>
    </div>
  </div>
</nav>
\`\`\``,
      quantum: `**محاسبه کوانتومی:**

| ویژگی | معمولی | کوانتومی |
|---------|--------|----------|
| وضعیت | ۰ یا ۱ | هر دو |
| پردازش | متوالی | موازی |

۱. **برهم‌نهی** ۲. **درهم‌تنیدگی** ۳. **تداخل**`,
      email: `ایمیل حرفه‌ای:

---
**موضوع:** درخواست [جایگاه]

مدیر محترم،

جهت **[جایگاه]** در **[شرکت]**.

- [دستاورد ۱]
- [دستاورد ۲]

با احترام،
[نام]

---`,
      reactVue: `**مقایسه React و Vue:**

| سناریو | انتخاب |
|----------|--------|
| تیم بزرگ | React |
| نمونه‌سازی سریع | Vue |

هر دو عالی هستن.`,
    },
  } as const;

  const responseSet = responses[lang];
  if (
    value.includes('navbar') ||
    value.includes('nav') ||
    value.includes('نوار ناوبری')
  ) {
    return responseSet.navbar;
  }
  if (value.includes('quantum') || value.includes('کوانتوم')) {
    return responseSet.quantum;
  }
  if (value.includes('email') || value.includes('ایمیل')) {
    return responseSet.email;
  }
  if (
    value.includes('react') ||
    value.includes('vue') ||
    value.includes('ری‌اکت')
  ) {
    return responseSet.reactVue;
  }
  return responseSet.default[Math.floor(Math.random() * responseSet.default.length)];
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const { chats, setChats, isLoaded } = useChatHistory();
  const { lang } = useUI();
  const { plan, markImageUsed } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('chat');
  const [activeChatLoaded, setActiveChatLoaded] = useState(false);
  const translations = getTranslations(lang);

  useEffect(() => {
    if (!isLoaded || activeChatLoaded) return;

    try {
      const storedActiveChat = localStorage.getItem(STORAGE_KEYS.activeChat);
      if (storedActiveChat && chats.some((chat) => chat.id === storedActiveChat)) {
        setActiveChatId(storedActiveChat);
      } else if (chats.length > 0) {
        setActiveChatId(chats[0].id);
      }
    } catch {
      if (chats.length > 0) {
        setActiveChatId(chats[0].id);
      }
    } finally {
      setActiveChatLoaded(true);
    }
  }, [activeChatLoaded, chats, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !activeChatLoaded) return;
    if (activeChatId) {
      localStorage.setItem(STORAGE_KEYS.activeChat, activeChatId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeChat);
    }
  }, [activeChatId, activeChatLoaded, isLoaded]);

  useEffect(() => {
    if (activeChatId && !chats.some((chat) => chat.id === activeChatId)) {
      setActiveChatId(chats[0]?.id ?? null);
    }
  }, [activeChatId, chats]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const activeTool = activeChat?.tool ?? null;

  useEffect(() => {
    if (activeChat) {
      setInputMode(activeChat.tool ?? 'chat');
    }
  }, [activeChat?.id, activeChat?.tool]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: createId(),
      title: translations.sidebar.newChat,
      messages: [],
      createdAt: Date.now(),
    };

    setChats((current) => [newChat, ...current]);
    setActiveChatId(newChat.id);
    setInputMode('chat');
  };

  const startToolChat = (tool: ToolType) => {
    const toolTitle =
      tool === 'image'
        ? translations.sidebar.imageGeneration
        : tool === 'video'
          ? translations.sidebar.videoGeneration
          : translations.sidebar.siteGeneration;
    const newChat: ChatSession = {
      id: createId(),
      title: toolTitle,
      messages: [],
      createdAt: Date.now(),
      tool,
    };

    setChats((current) => [newChat, ...current]);
    setActiveChatId(newChat.id);
    setInputMode(tool);
  };

  const selectChat = (id: string) => {
    const chat = chats.find((item) => item.id === id);
    if (!chat) return;
    setActiveChatId(id);
    setInputMode(chat.tool ?? 'chat');
  };

  const deleteChat = (id: string) => {
    const nextChats = chats.filter((chat) => chat.id !== id);
    setChats(nextChats);
    if (activeChatId === id) {
      setActiveChatId(nextChats[0]?.id ?? null);
      setInputMode(nextChats[0]?.tool ?? 'chat');
    }
  };

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || isGenerating) return;

    const mode = activeChat?.tool ?? inputMode;
    const currentId = activeChatId ?? createId();
    const newChat: ChatSession = {
      id: currentId,
      title: translations.sidebar.newChat,
      messages: [],
      createdAt: Date.now(),
      ...(mode !== 'chat' ? { tool: mode } : {}),
    };

    const userMessage: Message = {
      id: createId(),
      role: 'user',
      content: trimmedText,
    };

    const shortTitle =
      trimmedText.slice(0, 40) + (trimmedText.length > 40 ? '...' : '');
    const modeTitle =
      mode === 'image'
        ? `${lang === 'fa' ? 'تصویر: ' : 'Image: '}${trimmedText.slice(0, 30)}`
        : mode === 'video'
          ? `${lang === 'fa' ? 'ویدیو: ' : 'Video: '}${trimmedText.slice(0, 30)}`
          : mode === 'site'
            ? `${lang === 'fa' ? 'سایت: ' : 'Site: '}${trimmedText.slice(0, 30)}`
          : shortTitle;

    setActiveChatId(currentId);
    setChats((current) => {
      const base = current.some((chat) => chat.id === currentId)
        ? current
        : [newChat, ...current];

      return base.map((chat) =>
        chat.id === currentId
          ? {
              ...chat,
              title: chat.messages.length === 0 ? modeTitle : chat.title,
              messages: [...chat.messages, userMessage],
            }
          : chat,
      );
    });

    setIsGenerating(true);

    try {
      await wait(mode === 'chat' ? 800 + Math.random() * 1000 : 650);

      if (mode === 'image') {
        const seed = `${trimmedText.replace(/\s+/g, '-').slice(0, 30)}-${Date.now()}`;
        const imageMessage: Message = {
          id: createId(),
          role: 'image',
          content: `https://picsum.photos/seed/${encodeURIComponent(seed)}/512/512`,
          prompt: trimmedText,
          showUpsell: plan === 'free',
        };

        if (plan === 'free') {
          markImageUsed();
        }
        setChats((current) =>
          current.map((chat) =>
            chat.id === currentId
              ? { ...chat, messages: [...chat.messages, imageMessage] }
              : chat,
          ),
        );
        return;
      }

      const response =
        mode === 'video'
          ? `${translations.chat.videoStarted}\n\n${translations.chat.videoProcessing}`
          : mode === 'site'
            ? lang === 'fa'
              ? `**سایت‌ساز NexChat آماده است.**\n\nدرخواست شما دریافت شد و می‌توانم بر اساس آن ساختار صفحات، ظاهر رابط کاربری و کد اولیه سایت را طراحی کنم.\n\nبرای نتیجه بهتر، نوع سایت، رنگ‌های برند، صفحات مورد نیاز و سبک بصری را توضیح دهید.`
              : `**NexChat Site Builder is ready.**\n\nI received your brief and can design the page structure, interface direction, and starter code for your website.\n\nFor a better result, describe the site type, brand colors, required pages, and visual style.`
          : getDemoResponse(trimmedText, lang);

      const assistantMessage: Message = {
        id: createId(),
        role: 'ai',
        content: response,
      };

      setChats((current) =>
        current.map((chat) =>
          chat.id === currentId
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat,
        ),
      );
    } finally {
      setIsGenerating(false);
      setInputMode('chat');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        activeTool,
        isGenerating,
        inputMode,
        setInputMode,
        createNewChat,
        startToolChat,
        selectChat,
        deleteChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
