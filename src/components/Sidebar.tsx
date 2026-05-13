"use client";

import { Plus, Search, ChevronDown } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useState } from "react";

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { 
    sessions, 
    currentSessionId, 
    createNewSession, 
    loadSession, 
    deleteSession,
    getCurrentSessionTitle 
  } = useCanvasStore();
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTitle = getCurrentSessionTitle();

  return (
    <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col h-full shadow-lg">
      {/* Header with title - aligned with FloatingNav button */}
      <div className="h-[76px] border-b border-gray-200 flex items-center px-5 bg-gray-50">
        {/* Space for the FloatingNav button (20px left margin + 40px button width + 16px gap) */}
        <div className="w-[76px]"></div>
        <h1 className="text-sm font-normal text-gray-900 truncate flex-1">
          {currentTitle}
        </h1>
      </div>

      {/* New Canvas Button */}
      <div className="p-4">
        <button
          onClick={() => {
            createNewSession();
            onClose();
          }}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-normal py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New canvas
          <ChevronDown className="w-4 h-4 ml-auto" />
        </button>
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-normal text-gray-600">
            Chats
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No chats yet
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  loadSession(session.id);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group relative ${
                  session.id === currentSessionId
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm line-clamp-1">{session.title}</span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Delete this canvas?")) {
                      deleteSession(session.id);
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
                >
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Profile at bottom */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">D</span>
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-normal text-gray-900">Dhruv Pal</div>
            <div className="text-xs text-gray-500">Free plan</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
