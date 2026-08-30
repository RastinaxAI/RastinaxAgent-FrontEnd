// دیکشنری مرکزی متون اپلیکیشن
export const dictionary = {
    fa: {
        common: {
            loading: 'در حال پردازش...',
            copy: 'کپی',
            copied: 'کپی شد!',
            close: 'بستن',
        },
        sidebar: {
            newChat: 'چت جدید',
            searchPlaceholder: 'جستجو در چت‌ها...',
            noChats: 'هنوز مکالمه‌ای ندارید',
            today: 'امروز',
            yesterday: 'دیروز',
            previous: 'قبلی',
            darkTheme: 'حالت تاریک',
            lightTheme: 'حالت روشن',
            persian: 'فارسی',
            english: 'English',
            login: 'ورود / ثبت‌نام',
        },
        chat: {
            placeholder: 'پیام خود را بنویسید...',
            imagePlaceholder: 'تصویر مورد نظر را توصیف کنید...',
            videoPlaceholder: 'ویدیوی مورد نظر را توصیف کنید...',
            disclaimer: 'NexChat ممکن است اشتباه کند. اطلاعات مهم را بررسی کنید.',
            modelName: 'مدل: NexChat-4o',
            generateImage: 'تولید تصویر',
            generateVideo: 'ساخت ویدیو',
        }
    },
    en: {
        common: {
            loading: 'Processing...',
            copy: 'Copy',
            copied: 'Copied!',
            close: 'Close',
        },
        sidebar: {
            newChat: 'New Chat',
            searchPlaceholder: 'Search chats...',
            noChats: 'No conversations yet',
            today: 'Today',
            yesterday: 'Yesterday',
            previous: 'Previous',
            darkTheme: 'Dark Mode',
            lightTheme: 'Light Mode',
            persian: 'فارسی',
            english: 'English',
            login: 'Login / Register',
        },
        chat: {
            placeholder: 'Message NexChat...',
            imagePlaceholder: 'Describe the image...',
            videoPlaceholder: 'Describe the video...',
            disclaimer: 'NexChat can make mistakes. Consider checking important information.',
            modelName: 'Model: NexChat-4o',
            generateImage: 'Generate Image',
            generateVideo: 'Generate Video',
        }
    }
};

// یک تابع کمکی برای استخراج راحت‌تر ترجمه‌ها
export type Lang = 'fa' | 'en';
export const getTranslations = (lang: Lang) => dictionary[lang];