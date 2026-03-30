"use client";

import Canvas from '@/components/Canvas';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration mismatch from Zustand persist or ReactFlow rendering server-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center text-gray-500">
        Loading Canvas...
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen w-full bg-white overflow-hidden font-sans">
      <div className="flex flex-1 overflow-hidden relative">
        <Canvas />
      </div>
    </main>
  );
}
