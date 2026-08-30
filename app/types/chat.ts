// تعریف نقش‌های ممکن برای فرستنده پیام
export type MessageRole = 'user' | 'ai' | 'image' | 'video';

// ساختار یک پیام تکی
export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    prompt?: string; // برای زمانی که پیام، نتیجه یک پرامپت تصویری/ویدیویی است
}

// ساختار یک جلسه چت کامل (موجود در سایدبار)
export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}