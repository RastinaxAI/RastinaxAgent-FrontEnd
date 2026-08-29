import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

// ایمپورت استایل‌ها
import "./app.css";

// لینک‌های پیش‌فرض (فونت گوگل)
export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
  },
];

// متادیتای پیش‌فرض
export const meta = () => [
  { title: "NexChat AI | دستیار هوشمند شما" },
  { name: "description", content: "NexChat پلتفرمی قدرتمند برای چت و تولید محتوا با هوش مصنوعی است." },
];

export default function App() {
  return (
    // تنظیمات زبان و جهت متن (فعلاً هاردکد برای فارسی و RTL)
    <html lang="fa" dir="rtl" className="light overflow-hidden h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased overflow-hidden h-full">
        {/* اینجاست که صفحات (routes) رندر می‌شوند */}
        <Outlet />
        
        {/* مدیریت اسکرول پس از ناوبری */}
        <ScrollRestoration />
        
        {/* اسکریپت‌های ضروری React Router */}
        <Scripts />
      </body>
    </html>
  );
}