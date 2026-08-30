'use client';

import React, { useState } from 'react';
import { useModal } from '~/context/ModalContext';
import { useAuth } from '~/context/AuthContext';
import { useUI } from '~/context/UIContext';
import { useChat } from '~/context/ChatContext';

export const ProfileModal: React.FC = () => {
    const { activeModal, closeModal, openModal } = useModal();
    const { userPhone, plan } = useAuth();
    const { lang } = useUI();
    const { chats } = useChat();

    const [activeTab, setActiveTab] = useState<'profile' | 'payment'>('profile');

    // اگر مودال پروفایل فعال نیست، رندر نشود
    if (activeModal !== 'profile') return null;

    const texts = {
        fa: {
            title: 'حساب کاربری',
            tabProfile: 'پروفایل',
            tabPayment: 'پرداخت',
            joinDate: 'تاریخ عضویت',
            totalChats: 'کل مکالمات',
            imagesUsed: 'تصاویر استفاده شده',
            currentPlan: 'پلن فعلی',
            changePlan: 'تغییر پلن',
            invoices: 'فاکتورها',
            noInvoices: 'فاکتوری ندارید'
        },
        en: {
            title: 'Account',
            tabProfile: 'Profile',
            tabPayment: 'Payment',
            joinDate: 'Join Date',
            totalChats: 'Total Chats',
            imagesUsed: 'Images Used',
            currentPlan: 'Current Plan',
            changePlan: 'Change Plan',
            invoices: 'Invoices',
            noInvoices: 'No invoices'
        }
    };

    const t = texts[lang];

    // رنگ و نام پلن‌ها
    const planConfig = {
        free: { name: lang === 'fa' ? 'رایگان' : 'Free', color: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
        pro: { name: lang === 'fa' ? 'حرفه‌ای' : 'Pro', color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' },
        enterprise: { name: lang === 'fa' ? 'سازمانی' : 'Enterprise', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' }
    };

    const features = {
        free: lang === 'fa' ? ['۲۰ پیام در روز', '۱ تصویرسازی', 'مدل‌های پایه'] : ['20 messages/day', '1 image', 'Basic models'],
        pro: lang === 'fa' ? ['پیام نامحدود', '۵۰ تصویر در ماه', 'پاسخ اولویت‌دار'] : ['Unlimited messages', '50 images/month', 'Priority response'],
        enterprise: lang === 'fa' ? ['پیام نامحدود', 'دسترسی API', 'پشتیبانی اختصاصی'] : ['Unlimited messages', 'API access', 'Dedicated support']
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in-up" onClick={closeModal}>
            <div className="bg-[var(--bg-c)] border border-[var(--bc)] rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>

                <div className="p-6 sm:p-8">
                    {/* هدر مودال */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[var(--tx-p)]">{t.title}</h2>
                        <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-h)] text-[var(--tx-s)] transition-colors">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* تب‌ها */}
                    <div className="flex border-b border-[var(--bc)] mb-5">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 pb-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === 'profile' ? 'border-brand-500 text-[var(--tx-p)]' : 'border-transparent text-[var(--tx-m)] hover:text-[var(--tx-p)]'}`}
                        >
                            {t.tabProfile}
                        </button>
                        <button
                            onClick={() => setActiveTab('payment')}
                            className={`flex-1 pb-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === 'payment' ? 'border-brand-500 text-[var(--tx-p)]' : 'border-transparent text-[var(--tx-m)] hover:text-[var(--tx-p)]'}`}
                        >
                            {t.tabPayment}
                        </button>
                    </div>

                    {/* محتوای تب پروفایل */}
                    {activeTab === 'profile' && (
                        <div className="fade-in-up">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-600/20">
                                    {userPhone ? userPhone.slice(-2) : '?'}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-[var(--tx-p)]" dir="ltr">{userPhone || '—'}</div>
                                    <div className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-md font-bold ${planConfig[plan].color}`}>
                                        {planConfig[plan].name}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-sm py-3 border-b border-[var(--bc)]">
                                    <span className="text-[var(--tx-m)]">{t.joinDate}</span>
                                    <span className="text-[var(--tx-p)] font-medium" dir="ltr">{new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</span>
                                </div>
                                <div className="flex justify-between text-sm py-3 border-b border-[var(--bc)]">
                                    <span className="text-[var(--tx-m)]">{t.totalChats}</span>
                                    <span className="text-[var(--tx-p)] font-medium">{chats.length}</span>
                                </div>
                                <div className="flex justify-between text-sm py-3">
                                    <span className="text-[var(--tx-m)]">{t.imagesUsed}</span>
                                    <span className="text-[var(--tx-p)] font-medium">0</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* محتوای تب پرداخت */}
                    {activeTab === 'payment' && (
                        <div className="fade-in-up">
                            <div className="bg-[var(--bg-t)] rounded-xl p-4 mb-5 border border-[var(--bc)]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-[var(--tx-p)]">{t.currentPlan}</span>
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold ${planConfig[plan].color}`}>
                    {planConfig[plan].name}
                  </span>
                                </div>

                                <div className="space-y-2 mt-4">
                                    {features[plan].map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-[var(--tx-p)]">
                                            <i className="fa-solid fa-check text-emerald-500 text-xs"></i>
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => openModal('plans')}
                                    className="w-full mt-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/20"
                                >
                                    {t.changePlan}
                                </button>
                            </div>

                            <h3 className="text-sm font-semibold mb-3 text-[var(--tx-p)]">{t.invoices}</h3>
                            {plan === 'free' ? (
                                <p className="text-sm text-[var(--tx-m)] text-center py-6 bg-[var(--bg-s)] rounded-xl border border-dashed border-[var(--bc)]">
                                    {t.noInvoices}
                                </p>
                            ) : (
                                <div className="space-y-0">
                                    {/* فاکتور تستی */}
                                    <div className="flex items-center justify-between py-3 border-b border-[var(--bc)]">
                                        <div>
                                            <div className="font-medium text-sm text-[var(--tx-p)]">{planConfig[plan].name}</div>
                                            <div className="text-[11px] text-[var(--tx-m)] mt-0.5">{new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-sm font-semibold text-[var(--tx-p)]" dir="ltr">
                                                {plan === 'pro' ? (lang === 'fa' ? '۴۹۹,۰۰۰ ت' : '$9.99') : (lang === 'fa' ? '۱,۴۹۹,۰۰۰ ت' : '$29.99')}
                                            </div>
                                            <div className="text-[10px] text-emerald-500 font-medium">{lang === 'fa' ? 'پرداخت شده' : 'Paid'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};