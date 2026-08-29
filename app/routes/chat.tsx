'use client';

import React from "react";
import { Sidebar } from "~/components/layout/Sidebar";
// ۱. ایمپورت کامپوننت Header
import { Header } from "~/components/layout/Header";
import { WelcomeScreen } from "~/components/chat/WelcomeScreen";
import { ChatInput } from "~/components/chat/ChatInput";
import { MessageList } from "~/components/chat/MessageList";
import { useChat } from "~/context/ChatContext";

export default function ChatPage() {
  const { activeChatId } = useChat();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-p)] font-fa">
      <Sidebar />

      <main className="main-area flex-1 min-w-0 flex flex-col h-full relative md:border-s md:border-[var(--bc)] bg-[var(--bg-sb)] dark:bg-[var(--bg-p)] transition-all duration-300">
        
        {/* ۲. استفاده از کامپوننت هدر در اینجا */}
        <Header />

        <div className="flex-1 overflow-y-auto overflow-x-hidden h-full scroll-smooth">
          {activeChatId === null ? (
            <WelcomeScreen />
          ) : (
            <MessageList />
          )}
        </div>

        <ChatInput />
        
      </main>
    </div>
  );
}