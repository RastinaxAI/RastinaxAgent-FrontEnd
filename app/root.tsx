import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";

import "./app.css";

// ایمپورت پرووایدرهای کانتکست
import { UIProvider, useUI } from "./context/UIContext";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext"; // اضافه شدن AuthProvider

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
  },
];

export const meta = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "NexChat AI | دستیار هوشمند و خلاق شما" },
  { name: "description", content: "NexChat پلتفرمی هوشمند و امن برای چت، تولید محتوا، و حل مسائل پیچیده با استفاده از قدرت هوش مصنوعی است." },
];

/**
 * کامپوننت اصلی App
 */
export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </AuthProvider>
    </UIProvider>
  );
}

/**
 * کامپوننت داخلی AppContent
 */
function AppContent() {
  const { lang, theme } = useUI();
  
  return (
    <html lang={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'} className={`${theme} overflow-hidden h-full`}>
      <head>
        <Meta />
        <Links />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="antialiased overflow-hidden h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * کامپوننت ErrorBoundary اصلاح‌شده
 * هوک useUI از اینجا حذف شد تا بیرون از کانتکست کرش نکند
 */
export function ErrorBoundary() {
  const error = useRouteError();
  
  // استفاده از مقادیر پیش‌فرض ثابت و ایمن برای صفحه خطا
  const fallbackLang = 'fa';
  
  return (
    <html lang={fallbackLang} dir="rtl" className="light overflow-hidden h-full">
      <head>
        <title>خطایی رخ داد! | NexChat</title>
        <Meta />
        <Links />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="antialiased h-screen flex flex-col items-center justify-center gap-6 p-6 bg-[#f8f9fa] text-[#1a1c22] font-fa">
        <i className="fa-solid fa-circle-exclamation text-8xl text-red-500 opacity-80"></i>
        
        {isRouteErrorResponse(error) ? (
          <>
            <h1 className="text-6xl font-extrabold text-[#3b50e6]">
              {error.status}
            </h1>
            <p className="text-xl text-[#555a64]">
              {error.status === 404 
                ? "متأسفانه صفحه مورد نظر شما پیدا نشد."
                : error.statusText}
            </p>
          </>
        ) : error instanceof Error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600">خطای غیرمنتظره رخ داد!</h1>
            <pre className="bg-red-50 p-4 rounded-xl text-sm overflow-auto max-w-full font-en shadow-inner text-left" dir="ltr">
              {error.message}
            </pre>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-[#1a1c22]">خطای ناشناخته!</h1>
        )}
        
        <a href="/" className="mt-6 px-6 py-3 bg-[#3b50e6] text-white rounded-xl hover:bg-[#2a38b8] transition">
          بازگشت به صفحه اصلی
        </a>
        <Scripts />
      </body>
    </html>
  );
}