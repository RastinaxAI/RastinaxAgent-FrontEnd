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

// ۱. ایمپورت استایل‌های سراسری (تیلویند و متغیرهای پروژه)
import "./app.css";

// ۲. ایمپورت پرووایدرهای کانتکست (UI و Chat)
import { UIProvider, useUI } from "./context/UIContext";
import { ChatProvider } from "./context/ChatContext";

// ۳. تنظیم لینک‌های تگ <head> (فونت‌های گوگل)
export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
  },
];

// ۴. تنظیم متادیتاهای پیش‌فرض SEO
export const meta = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "NexChat AI | دستیار هوشمند و خلاق شما" },
  { name: "description", content: "NexChat پلتفرمی هوشمند و امن برای چت، تولید محتوا، و حل مسائل پیچیده با استفاده از قدرت هوش مصنوعی است." },
];

/**
 * کامپوننت اصلی App (پوسته سراسری پرووایدرها)
 * این کامپوننت فقط پرووایدرها را محصور می‌کند تا از بروز خطای
 * "Context undefined" جلوگیری شود.
 */
export default function App() {
  return (
    // محصور کردن کل برنامه در پرووایدر UI
    <UIProvider>
      {/* محصور کردن برنامه در پرووایدر چت */}
      <ChatProvider>
        {/* رندر کردن ساختار نهایی HTML در این کامپوننت داخلی */}
        <AppContent />
      </ChatProvider>
    </UIProvider>
  );
}

/**
 * کامپوننت داخلی AppContent
 * وظیفه این کامپوننت دسترسی به Stateهای کانتکست (UIContext)
 * و اعمال آن‌ها به تگ <html> است.
 */
function AppContent() {
  // دسترسی به تم و زبان از کانتکست UI
  const { lang, theme } = useUI();
  
  return (
    // اعمال تم (dark/light) به صورت کلاس، زبان (fa/en) به ویژگی lang،
    // و جهت متن (rtl/ltr) به ویژگی dir.
    <html lang={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'} className={`${theme} overflow-hidden h-full`}>
      <head>
        {/* متادیتای تعریف شده در تابع meta در بالاترین سطح رندر می‌شود */}
        <Meta />
        
        {/* لینک‌های تعریف شده در تابع links در بالاترین سطح رندر می‌شوند */}
        <Links />
        
        {/* افزودن فونت‌آیکون FontAwesome برای آیکون‌های پروژه */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="antialiased overflow-hidden h-full">
        {/* 
          تگ <Outlet />:
          این حیاتی‌ترین بخش است. React Router صفحاتی که در routes.ts
          تعریف شده‌اند (مثل home.tsx یا chat.tsx) را دقیقاً اینجا رندر می‌کند.
        */}
        <Outlet />
        
        {/* مدیریت اسکرول: اسکرول را هنگام ناوبری بین صفحات مدیریت می‌کند */}
        <ScrollRestoration />
        
        {/* اسکریپت‌ها: اسکریپت‌های کلاینت‌ساید React Router را تزریق می‌کند */}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * کامپوننت ErrorBoundary (مدیریت خطاهای کل پروژه)
 * این کامپوننت خطاهای غیرمنتظره در کل پروژه را مدیریت کرده و
 * یک صفحه خطای سراسری به کاربر نشان می‌دهد.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const { lang } = useUI(); // دسترسی به زبان برای نمایش خطا
  
  return (
    <html lang={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <head>
        <title>خطایی رخ داد! | NexChat</title>
        <Meta />
        <Links />
      </head>
      <body className="antialiased h-screen flex flex-col items-center justify-center gap-6 p-6 bg-[var(--bg-p)] text-[var(--tx-p)] font-fa">
        <i className="fa-solid fa-circle-exclamation text-8xl text-red-500 opacity-80"></i>
        
        {isRouteErrorResponse(error) ? (
          // خطاهای مربوط به روتینگ (مثل 404 یا 401)
          <>
            <h1 className="text-6xl font-extrabold text-brand-500">
              {error.status}
            </h1>
            <p className="text-xl text-tx-s">
              {error.status === 404 
                ? "متأسفانه صفحه مورد نظر شما پیدا نشد."
                : error.statusText}
            </p>
          </>
        ) : error instanceof Error ? (
          // خطاهای برنامه‌نویسی غیرمنتظره
          <>
            <h1 className="text-2xl font-bold text-red-600">خطای غیرمنتظره رخ داد!</h1>
            <pre className="bg-red-100 dark:bg-red-950 p-4 rounded-xl text-sm overflow-auto max-w-full font-en shadow-inner">
              {error.message}
            </pre>
          </>
        ) : (
          // خطاهای ناشناخته
          <h1 className="text-2xl font-bold text-tx-p">خطای ناشناخته!</h1>
        )}
        
        <a href="/" className="mt-6 px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition">
          بازگشت به صفحه اصلی
        </a>
        <Scripts />
      </body>
    </html>
  );
}