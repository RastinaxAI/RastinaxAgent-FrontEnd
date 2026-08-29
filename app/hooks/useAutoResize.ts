import { useRef, useEffect } from 'react';

// این هوک یک رفرنس به المنت تِکست‌اِریا و ارتفاع حداکثر را می‌گیرد
export const useAutoResize = (
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  maxHeight: number = 150
) => {
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    // ریست کردن ارتفاع برای محاسبهscrollHeight صحیح
    el.style.height = 'auto';
    
    // تنظیم ارتفاع بر اساسscrollHeight، اما حداکثر تا maxHeight
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    
    // اگر به سقف ارتفاع رسیدیم، اسکرول عمودی را فعال کنیم
    if (el.scrollHeight > maxHeight) {
      el.style.overflowY = 'auto';
    } else {
      el.style.overflowY = 'hidden';
    }
  };

  // هر بار که اینپوت تغییر کرد یا رفرنس تنظیم شد، ارتفاع را آپدیت کنیم
  useEffect(() => {
    resizeTextarea();
  }, [textareaRef]);

  // بازگرداندن متد برای استفاده در زمان تغییر اینپوت توسط کاربر
  return { resizeTextarea };
};