import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Plan = 'free' | 'pro' | 'enterprise';

interface AuthContextType {
  isLoggedIn: boolean;
  userPhone: string;
  plan: Plan;
  login: (phone: string) => void;
  logout: () => void;
  setPlan: (newPlan: Plan) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // به صورت پیش‌فرض کاربر لاگین نیست
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [plan, setPlanState] = useState<Plan>('free');

  const login = (phone: string) => {
    setUserPhone(phone);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserPhone('');
    setIsLoggedIn(false);
    setPlanState('free');
  };

  const setPlan = (newPlan: Plan) => {
    setPlanState(newPlan);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userPhone, plan, login, logout, setPlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};