'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '~/context/ModalContext';
import { useAuth } from '~/context/AuthContext';
import { useUI } from '~/context/UIContext';

export const AuthModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { login } = useAuth();
  const { lang } = useUI();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [error, setError] = useState(false);

  // ریست کردن استیت‌ها وقتی مودال باز می‌شه
  useEffect(() => {
    if (activeModal === 'auth') {
      setStep(1);
      setPhone('');
      setOtp(['', '', '', '', '']);
      setError(false);
    }
  }, [activeModal]);

  // اگر مودال فعال لاگین نیست، چیزی رندر نکن
  if (activeModal !== 'auth') return null;

  const handleSendCode = () => {
    if (phone.length === 10) setStep(2);
  };

  const handleVerify = () => {
    const code = otp.join('');
    // کد تستی برای لاگین 11111 است
    if (code === '11111') {
      setError(false);
      setStep(3);
      login(`+98 ${phone}`);
      // بعد از ۱.۵ ثانیه مودال رو ببند
      setTimeout(() => closeModal(), 1500);
    } else {
      setError(true);
      setOtp(['', '', '', '', '']);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '').slice(-1);
    setOtp(newOtp);

    // فوکوس خودکار روی اینپوت بعدی
    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in-up" onClick={closeModal}>
      {/* جلوگیری از بسته شدن مودال وقتی روی خود کارت کلیک می‌شه */}
      <div className="bg-[var(--bg-c)] border border-[var(--bc)] rounded-[20px] w-full max-w-sm shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        
        <div className="p-6 sm:p-8">
          {/* هدر مودال */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--tx-p)]">
              {lang === 'fa' ? 'ورود به NexChat' : 'Login to NexChat'}
            </h2>
            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-h)] text-[var(--tx-s)] transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* مرحله ۱: دریافت شماره موبایل */}
          {step === 1 && (
            <div className="fade-in-up">
              <p className="text-sm text-[var(--tx-s)] mb-4">
                {lang === 'fa' ? 'شماره موبایل خود را وارد کنید' : 'Enter your phone number'}
              </p>
              <div className="flex flex-row-reverse gap-2 mb-4" dir="ltr">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9123456789"
                  className="flex-1 bg-[var(--bg-s)] border-2 border-[var(--bc)] rounded-xl px-4 py-3 text-base text-[var(--tx-p)] outline-none focus:border-brand-500 transition-colors"
                />
                <div className="flex items-center gap-1 px-3 py-3 bg-[var(--bg-t)] rounded-xl text-sm font-medium border-2 border-transparent">
                  <span>🇮🇷</span><span>+98</span>
                </div>
              </div>
              <button 
                onClick={handleSendCode}
                disabled={phone.length < 10}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-brand-500 text-white disabled:bg-[var(--bg-t)] disabled:text-[var(--tx-m)] disabled:cursor-not-allowed hover:bg-brand-600"
              >
                {lang === 'fa' ? 'ارسال کد' : 'Send Code'}
              </button>
            </div>
          )}

          {/* مرحله ۲: دریافت کد تایید */}
          {step === 2 && (
            <div className="fade-in-up">
              <p className="text-sm text-[var(--tx-s)] mb-1">
                {lang === 'fa' ? 'کد ارسال شده به' : 'Code sent to'}
              </p>
              <p className="text-sm font-semibold mb-5 text-[var(--tx-p)]" dir="ltr">
                +98 {phone}
              </p>
              
              <div className="flex justify-center gap-2 mb-4" dir="ltr">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-[var(--bc)] rounded-xl bg-[var(--bg-s)] text-[var(--tx-p)] outline-none focus:border-brand-500 transition-colors"
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center mb-3">
                  {lang === 'fa' ? 'کد نامعتبر است (کد تستی: 11111)' : 'Invalid code (Test code: 11111)'}
                </p>
              )}

              <button 
                onClick={handleVerify}
                disabled={otp.join('').length < 5}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-brand-500 text-white disabled:bg-[var(--bg-t)] disabled:text-[var(--tx-m)] disabled:cursor-not-allowed hover:bg-brand-600 mb-3"
              >
                {lang === 'fa' ? 'تایید' : 'Verify'}
              </button>

              <button onClick={() => setStep(1)} className="w-full text-sm text-[var(--tx-m)] hover:text-[var(--tx-p)] transition-colors">
                {lang === 'fa' ? 'تغییر شماره' : 'Change number'}
              </button>
            </div>
          )}

          {/* مرحله ۳: موفقیت */}
          {step === 3 && (
            <div className="text-center fade-in-up">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-check text-emerald-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--tx-p)]">
                {lang === 'fa' ? 'خوش آمدید!' : 'Welcome!'}
              </h3>
              <p className="text-sm text-[var(--tx-s)]">
                {lang === 'fa' ? 'با موفقیت وارد شدید.' : 'Logged in successfully.'}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};