"use client";

import { useMemo, useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '@/store/useCanvasStore';
import LLMNode from './nodes/LLMNode';
import FloatingNav from './FloatingNav';

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useCanvasStore();

  // useMemo is recommended by React Flow for custom node types
  const nodeTypes = useMemo(() => ({ llmNode: LLMNode }), []);

  // Ensure there's always an initial node on screen
  useEffect(() => {
    if (nodes.length === 0) {
      addNode({
        id: crypto.randomUUID(),
        type: 'llmNode',
        position: { x: window.innerWidth / 2 - 240, y: window.innerHeight / 2 - 120 }, // Center node (width 480px)
        data: { prompt: '', response: '', model: 'gemini-2.0-flash', parentId: null, childrenIds: [] }
      });
    }
  }, [nodes.length, addNode]);

  return (
    <div className="flex-1 h-full w-full bg-white relative">
      <FloatingNav />

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
