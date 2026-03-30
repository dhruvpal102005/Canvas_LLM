"use client";

import { Menu, Megaphone, CircleHelp, Settings } from 'lucide-react';

export default function FloatingNav() {
  return (
    <>
      {/* Top Left Menu Button */}
      <div className="absolute top-6 left-6 z-50">
        <button className="flex items-center justify-center w-11 h-11 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-gray-700">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Top Right Controls Group */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm p-1">
          <button className="flex items-center justify-center p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors" title="Announcements">
            <Megaphone className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors" title="Help">
            <CircleHelp className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
