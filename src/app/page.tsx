"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [Components, setComponents] = useState<{
    Canvas: React.ComponentType;
  } | null>(null);

  useEffect(() => {
    // Import Canvas only on client side
    import('@/components/Canvas').then((CanvasModule) => {
      setComponents({
        Canvas: CanvasModule.default
      });
    });
  }, []);

  if (!Components) {
    return null;
  }

  const { Canvas } = Components;

  return (
    <main className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Canvas />
    </main>
  );
}
