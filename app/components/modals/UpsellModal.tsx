'use client';

import React from 'react';
import { useModal } from '~/context/ModalContext';
import { useUI } from '~/context/UIContext';

export const UpsellModal: React.FC = () => {
    const { activeModal, closeModal, openModal } = useModal();
    const { lang } = useUI();

    if (activeModal !== 'upsell') return null;

    const t = {
        fa: {
            title: 'اعتبار شما به پایان رسید!',
            desc: 'شما از تمام ظرفیت پلن رایگان خود (۲۰ پیام در روز) استفاده کرده‌اید. برای ادامه مکالمه و دسترسی به امکانات نامحدود، پلن خود را ارتقا دهید.',
            upgradeBtn: 'مشاهده پلن‌ها و ارتقا',
            laterBtn: 'شاید بعدا',
            features: ['پیام‌های نامحدود با مدل 4o', 'تولید تصویر و ویدیو', 'پاسخگویی سریع‌تر و بدون قطعی']
        },
        en: {
            title: 'Out of Credits!',
            desc: 'You have used all your free plan credits (20 messages/day). Upgrade your plan to continue chatting and unlock unlimited features.',
            upgradeBtn: 'View Plans & Upgrade',
            laterBtn: 'Maybe Later',
            features: ['Unlimited messages with 4o model', 'Image & Video generation', 'Faster response times']
        }
    };

    const current = t[lang];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in-up" onClick={closeModal}>
            <div className="bg-[var(--bg-c)] border border-[var(--bc)] rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden relative text-center p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>

                {/* آیکون هشدار/الماس */}
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mx-auto mb-5">
                    <i className="fa-regular fa-gem text-3xl"></i>
                </div>

                <h2 className="text-xl font-bold text-[var(--tx-p)] mb-3">{current.title}</h2>
                <p className="text-sm text-[var(--tx-s)] leading-relaxed mb-6">
                    {current.desc}
                </p>

                {/* لیست امکانات پلن پولی */}
                <div className="bg-[var(--bg-s)] rounded-xl p-4 text-start mb-6 border border-[var(--bc)]">
                    <div className="space-y-3">
                        {current.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-[var(--tx-p)]">
                                <i className="fa-solid fa-bolt text-amber-500 text-xs"></i>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => openModal('plans')}
                        className="w-full py-3 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
                    >
                        {current.upgradeBtn}
                    </button>
                    <button
                        onClick={closeModal}
                        className="w-full py-3 text-[var(--tx-m)] hover:text-[var(--tx-p)] bg-transparent rounded-xl text-sm font-semibold transition-colors"
                    >
                        {current.laterBtn}
                    </button>
                </div>

            </div>
        </div>
    );
};