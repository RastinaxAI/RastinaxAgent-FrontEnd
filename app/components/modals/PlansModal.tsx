'use client';

import React from 'react';
import { useModal } from '~/context/ModalContext';
import { useAuth } from '~/context/AuthContext';
import { useUI } from '~/context/UIContext';

// تعریف داده‌های پلن‌ها
const PLANS = {
    fa: [
        { id: 'free', name: 'رایگان', price: '۰ تومان', desc: 'شروع با امکانات پایه', featured: false, features: ['۲۰ پیام در روز', '۱ تصویرسازی', 'بدون ویدیو', 'مدل‌های پایه'] },
        { id: 'pro', name: 'حرفه‌ای', price: '۴۹۹,۰۰۰ تومان/ماه', desc: 'برای کاربران حرفه‌ای', featured: true, features: ['پیام نامحدود', '۵۰ تصویر در ماه', '۱۰ ویدیو در ماه', 'پاسخ اولویت‌دار'] },
        { id: 'enterprise', name: 'سازمانی', price: '۱,۴۹۹,۰۰۰ تومان/ماه', desc: 'برای تیم‌ها و شرکت‌ها', featured: false, features: ['تصویر و ویدیو نامحدود', 'دسترسی API', 'پشتیبانی اختصاصی', 'همکاری تیمی'] }
    ],
    en: [
        { id: 'free', name: 'Free', price: '$0', desc: 'Get started', featured: false, features: ['20 messages/day', '1 image', 'No video', 'Basic models'] },
        { id: 'pro', name: 'Pro', price: '$9.99/mo', desc: 'For power users', featured: true, features: ['Unlimited messages', '50 images/month', '10 videos/month', 'Priority response'] },
        { id: 'enterprise', name: 'Enterprise', price: '$29.99/mo', desc: 'For teams', featured: false, features: ['Unlimited media', 'API access', 'Dedicated support', 'Team collaboration'] }
    ]
};

export const PlansModal: React.FC = () => {
    const { activeModal, closeModal } = useModal();
    const { plan: currentPlan, setPlan } = useAuth();
    const { lang } = useUI();

    if (activeModal !== 'plans') return null;

    const handleSelectPlan = (planId: 'free' | 'pro' | 'enterprise') => {
        if (planId !== currentPlan) {
            setPlan(planId);
            // نمایش یه پیام موفقیت (در اپلیکیشن واقعی اینجا به درگاه پرداخت وصل می‌شه)
            alert(lang === 'fa' ? 'پلن شما با موفقیت ارتقا یافت!' : 'Plan upgraded successfully!');
        }
        closeModal();
    };

    const texts = {
        fa: { title: 'انتخاب پلن', sub: 'قدرت کامل NexChat AI را آزاد کنید', popular: 'محبوب‌ترین', current: 'پلن فعلی', choose: 'انتخاب پلن' },
        en: { title: 'Choose Your Plan', sub: 'Unlock the full power of NexChat AI', popular: 'Popular', current: 'Current Plan', choose: 'Choose Plan' },
    };

    const currentTexts = texts[lang];
    const plansData = PLANS[lang];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in-up" onClick={closeModal}>
            <div className="bg-[var(--bg-c)] border border-[var(--bc)] rounded-[20px] w-full max-w-4xl shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                <div className="p-6 sm:p-8">
                    {/* هدر مودال */}
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold text-[var(--tx-p)]">{currentTexts.title}</h2>
                        <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-h)] text-[var(--tx-s)] transition-colors">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <p className="text-sm text-[var(--tx-s)] mb-8">{currentTexts.sub}</p>

                    {/* گرید پلن‌ها */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {plansData.map((p) => {
                            const isCurrent = currentPlan === p.id;
                            return (
                                <div
                                    key={p.id}
                                    className={`
                    relative flex flex-col p-6 rounded-2xl border transition-all duration-300 bg-[var(--bg-c)]
                    ${p.featured
                                        ? 'border-brand-500 shadow-lg shadow-brand-500/15 md:-translate-y-2'
                                        : 'border-[var(--bc)] hover:border-[var(--tx-m)] hover:-translate-y-1 shadow-sm'}
                  `}
                                >
                                    {p.featured && (
                                        <div className="absolute top-0 inset-inline-end-0 bg-brand-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl tracking-wider uppercase">
                                            {currentTexts.popular}
                                        </div>
                                    )}

                                    <div className="mb-5">
                                        <div className="text-lg font-bold mb-1 text-[var(--tx-p)]">{p.name}</div>
                                        <div className="text-2xl font-extrabold mb-1 text-brand-600 dark:text-brand-400" dir="ltr">{p.price}</div>
                                        <div className="text-xs text-[var(--tx-m)]">{p.desc}</div>
                                    </div>

                                    <div className="space-y-3 mb-8 flex-1">
                                        {p.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-sm text-[var(--tx-p)]">
                                                <i className="fa-solid fa-check text-emerald-500 text-sm"></i>
                                                <span>{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleSelectPlan(p.id as any)}
                                        disabled={isCurrent}
                                        className={`
                      w-full py-2.5 rounded-xl font-semibold text-sm transition-all mt-auto
                      ${isCurrent
                                            ? 'bg-[var(--bg-t)] text-[var(--tx-s)] cursor-default'
                                            : p.featured
                                                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/20'
                                                : 'bg-[var(--bg-s)] text-[var(--tx-p)] border border-[var(--bc)] hover:bg-[var(--bg-h)]'}
                    `}
                                    >
                                        {isCurrent ? currentTexts.current : currentTexts.choose}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};