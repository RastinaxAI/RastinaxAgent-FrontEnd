import type { Config } from 'tailwindcss';

export default {
    // مشخص کردن فایل‌هایی که تیلویند باید کلاس‌های آن‌ها را پردازش کند
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './index.html',
    ],
    // فعال‌سازی دارک مود بر اساس کلاس 'dark' در تگ html
    darkMode: 'class',
    theme: {
        extend: {
            // تعریف فونت‌فمیلی‌ها برای استفاده در کلاس‌های Tailwind
            fontFamily: {
                fa: ['Vazirmatn', 'sans-serif'],
                en: ['Space Grotesk', 'sans-serif'],
            },
            // شما رنگ‌های برند را در فایل app.css تعریف کرده‌اید،
            // بنابراین تیلویند به صورت خودکار از آن‌ها استفاده می‌کند.
        },
    },
    plugins: [
        // پلاگین‌های احتمالی مانند typography را می‌توانید اینجا اضافه کنید
    ],
} satisfies Config;