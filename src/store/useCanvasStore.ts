import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addEdge,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type SupportedModel = 'gemini-2.0-flash' | 'gemini-1.5-pro' | 'gemini-1.5-flash';

export type LLMNodeData = {
  prompt: string;
  response: string;
  model: SupportedModel;
  parentId: string | null;
  childrenIds: string[];
};

export type LLMNode = Node<LLMNodeData>;

interface CanvasState {
  nodes: LLMNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange<LLMNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: LLMNode) => void;
  updateNodeData: (id: string, data: Partial<LLMNodeData>) => void;
  branchFromNode: (parentId: string) => string | undefined;
  deleteNode: (id: string) => void;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) as LLMNode[] });
      },
      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },
      onConnect: (connection) => {
        set({ edges: addEdge(connection, get().edges) });
      },
      addNode: (node) => set({ nodes: [...get().nodes, node] }),
      updateNodeData: (id, data) =>
        set({
          nodes: get().nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
          ),
        }),
      branchFromNode: (parentId) => {
        const state = get();
        const parentNode = state.nodes.find((n) => n.id === parentId);
        if (!parentNode) return undefined;

        const newNodeId = crypto.randomUUID();
        const newNode: LLMNode = {
          id: newNodeId,
          type: 'llmNode',
          position: {
            x: parentNode.position.x,
            y: parentNode.position.y + 350, // default spacing
          },
          data: {
            prompt: '',
            response: '',
            model: parentNode.data.model, // inherit model from parent
            parentId,
            childrenIds: [],
          },
        };

        const newEdge: Edge = {
          id: `e-${parentId}-${newNodeId}`,
          source: parentId,
          target: newNodeId,
          type: 'smoothstep',
        };

        // Update parent to include new child
        const updatedParentNodes = state.nodes.map((n) =>
          n.id === parentId
            ? { ...n, data: { ...n.data, childrenIds: [...n.data.childrenIds, newNodeId] } }
            : n
        );

        set({
          nodes: [...updatedParentNodes, newNode],
          edges: [...state.edges, newEdge],
        });

        return newNodeId;
      },
      deleteNode: (id) =>
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter((e) => e.source !== id && e.target !== id),
        }),
      clearCanvas: () => set({ nodes: [], edges: [] }),
    }),
    {
      name: 'canvas-storage',
      // We only persist the data, optionally omit selected flags or position if we want, but keeping full persistence for MVP
    }
  )
);
