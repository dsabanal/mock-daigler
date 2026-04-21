"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { THREAD_CONTENT } from "../data";

type Message = {
  user: string;
  text: string;
  time: string;
  isMe: boolean;
};

function ThreadContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "best-coffee-shops";

  const thread = THREAD_CONTENT[id] ?? THREAD_CONTENT["best-coffee-shops"];

  const [messages, setMessages] = useState<Message[]>(thread.messages);
  const [inputValue, setInputValue] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // send message
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        user: "Lebron James",
        text,
        time: "Just now",
        isMe: true,
      },
    ]);

    setInputValue("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm font-medium text-stone-400">
        <Link href="/forums" className="hover:text-stone-600">
          Discussion Forums
        </Link>
        <span>/</span>
        <Link
          href={`/forums/view?topic=${thread.catId}`}
          className="hover:text-stone-600"
        >
          {thread.category}
        </Link>
        <span>/</span>
        <span className="text-stone-800 font-bold">Thread</span>
      </nav>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Header */}
        <div className="p-8 border-b border-stone-50 bg-stone-50/30">
          <h2 className="text-2xl font-bold text-stone-900">
            {thread.title}
          </h2>
          <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1">
            {messages.length} Active Replies
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center space-x-2 mb-2 px-1">
                <span className="text-[10px] font-black text-stone-500 uppercase">
                  {msg.user}
                </span>
                <span className="text-[10px] text-stone-300">
                  {msg.time}
                </span>
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.isMe
                    ? "bg-amber-500 text-white rounded-tr-none"
                    : "bg-stone-50 text-stone-700 rounded-tl-none border border-stone-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-stone-50/50 border-t border-stone-100">
          <div className="flex space-x-4">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Write a reply..."
              className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />

            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-stone-900 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThreadPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-stone-400 font-bold uppercase tracking-widest text-xs">
          Loading Discussion...
        </div>
      }
    >
      <ThreadContent />
    </Suspense>
  );
}
