"use client";
import { useEffect, useRef, useState } from 'react';

export default function GeminiChatbot() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="bg-white dark:bg-blue-dark text-gray-custom shadow-lg rounded-xl w-80 max-w-full p-4 flex flex-col gap-2 border-2 border-maroon">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-maroon">Gemini Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-maroon font-bold">×</button>
          </div>
          <div className="flex-1 min-h-[100px] text-sm text-gray-700 dark:text-gray-custom">Hi! How can I help you?</div>
          <input ref={inputRef} className="mt-2 p-2 rounded border border-gray-custom focus:outline-none focus:ring-2 focus:ring-blue-dark" placeholder="Type your message..." />
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-maroon text-white rounded-full p-4 shadow-lg hover:bg-maroon/80 transition-all"
          style={{
            boxShadow: '0 0 16px 4px #1A3A8F88, 0 0 32px 8px #8B000055',
            filter: 'drop-shadow(0 0 8px #1A3A8F88)',
            animation: 'glow 2s ease-in-out infinite alternate',
          }}
        >
          <span className="font-bold">Gemini</span>
        </button>
      )}
      <style>{`
        @keyframes glow {
          0% { box-shadow: 0 0 16px 4px #1A3A8F88, 0 0 32px 8px #8B000055; }
          100% { box-shadow: 0 0 32px 12px #1A3A8Fcc, 0 0 48px 16px #8B000099; }
        }
      `}</style>
    </div>
  );
}
