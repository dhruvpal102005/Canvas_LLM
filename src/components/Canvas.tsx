"use client";

import { useMemo, useEffect, useState } from 'react';
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '@/store/useCanvasStore';
import LLMNode from './nodes/LLMNode';
import FloatingNav from './FloatingNav';
import Sidebar from './Sidebar';

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, sessions, createNewSession } = useCanvasStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // useMemo is recommended by React Flow for custom node types
  const nodeTypes = useMemo(() => ({ llmNode: LLMNode }), []);

  // Initialize first session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [sessions.length, createNewSession]);

  // Ensure there's always an initial node on screen
  useEffect(() => {
    if (nodes.length === 0 && sessions.length > 0) {
      addNode({
        id: crypto.randomUUID(),
        type: 'llmNode',
        position: { x: window.innerWidth / 2 - 240, y: window.innerHeight / 2 - 120 }, // Center node (width 480px)
        data: { prompt: '', response: '', model: 'llama-3.3-70b-versatile', parentId: null, childrenIds: [] }
      });
    }
  }, [nodes.length, sessions.length, addNode]);

  return (
    <div className="flex-1 h-full w-full bg-white relative">
      {/* Backdrop with fade animation */}
      <div 
        className={`absolute inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar with slide animation */}
      <div 
        className={`absolute left-0 top-0 bottom-0 z-50 transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <FloatingNav onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="touch-none z-10"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Cross} color="#d1d5db" gap={32} size={1} />
      </ReactFlow>
    </div>
  );
}
