"use client";

import { Menu, Megaphone, CircleHelp, Settings } from 'lucide-react';

export default function FloatingNav() {
  return (
    <>
      {/* Top Left Menu Button */}
      <div className="absolute top-5 left-5 z-50">
        <button
          className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors"
          title="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Top Right: Individual icon buttons, no card */}
      <div className="absolute top-5 right-5 z-50 flex items-center gap-1">
        <button
          className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors"
          title="Announcements"
        >
          <Megaphone className="w-5 h-5" />
        </button>
        <button
          className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors"
          title="Help"
        >
          <CircleHelp className="w-5 h-5" />
        </button>
        <button
          className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
