'use client';

import React from "react";
import { Sidebar } from "~/components/layout/Sidebar";
import { WelcomeScreen } from "~/components/chat/WelcomeScreen";
import { ChatInput } from "~/components/chat/ChatInput";
// ۱. ایمپورت MessageList
import { MessageList } from "~/components/chat/MessageList";
import { useUI } from "~/context/UIContext";
import { useChat } from "~/context/ChatContext";

export default function ChatPage() {
  const { toggleMobileSidebar } = useUI();
  const { activeChatId } = useChat();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-p)] font-fa">
      <Sidebar />

      <main className="main-area flex-1 min-w-0 flex flex-col h-full relative md:border-s md:border-[var(--bc)] bg-[var(--bg-sb)] dark:bg-[var(--bg-p)] transition-all duration-300">
        
        <header className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-[var(--bc)] bg-[var(--bg-c)] transition-all">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleMobileSidebar} className="hdr-icon md:hidden">
              <i className="fa-solid fa-bars text-base"></i>
            </button>
            <div className="flex items-center gap-2.5">
              <img 
                src="https://z-cdn-media.chatglm.cn/files/88ac9b08-2605-4b77-ac97-790e3b4f58cb.png?auth_key=1887733333-d4ca11bee00d46e3a896611b9d191a13-0-8a7ede6eda1129eecc50a6af6d7b30ce" 
                alt="NexChat" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-bold text-lg tracking-tight hidden sm:inline">NexChat</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--tx-m)]">مدل: NexChat-4o</span>
          </div>
        </header>

        {/* ۲. رندر داینامیک: اگر چتی نبود WelcomeScreen، در غیر این صورت MessageList */}
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