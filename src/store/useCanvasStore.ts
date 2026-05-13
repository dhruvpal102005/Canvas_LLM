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

export type SupportedModel = 
  | 'llama-3.3-70b-versatile'
  | 'llama-3.1-70b-versatile' 
  | 'llama-3.1-8b-instant'
  | 'mixtral-8x7b-32768'
  | 'gemma2-9b-it';

export type LLMNodeData = {
  prompt: string;
  response: string;
  model: SupportedModel;
  parentId: string | null;
  childrenIds: string[];
};

export type LLMNode = Node<LLMNodeData>;

export type CanvasSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  nodes: LLMNode[];
  edges: Edge[];
};

interface CanvasState {
  // Current canvas
  nodes: LLMNode[];
  edges: Edge[];
  
  // Canvas sessions
  sessions: CanvasSession[];
  currentSessionId: string | null;
  
  // Canvas operations
  onNodesChange: (changes: NodeChange<LLMNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: LLMNode) => void;
  updateNodeData: (id: string, data: Partial<LLMNodeData>) => void;
  branchFromNode: (parentId: string) => string | undefined;
  deleteNode: (id: string) => void;
  clearCanvas: () => void;
  getConversationHistory: (nodeId: string) => Array<{ role: 'user' | 'assistant'; content: string }>;
  
  // Session operations
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  saveCurrentSession: () => void;
  getCurrentSessionTitle: () => string;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      sessions: [],
      currentSessionId: null,
      
      onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) as LLMNode[] });
        get().saveCurrentSession();
      },
      onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
        get().saveCurrentSession();
      },
      onConnect: (connection) => {
        set({ edges: addEdge(connection, get().edges) });
        get().saveCurrentSession();
      },
      addNode: (node) => {
        set({ nodes: [...get().nodes, node] });
        get().saveCurrentSession();
      },
      updateNodeData: (id, data) => {
        set({
          nodes: get().nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
          ),
        });
        get().saveCurrentSession();
      },
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
      deleteNode: (id) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter((e) => e.source !== id && e.target !== id),
        });
        get().saveCurrentSession();
      },
      clearCanvas: () => {
        set({ nodes: [], edges: [] });
        get().saveCurrentSession();
      },
      getConversationHistory: (nodeId) => {
        const state = get();
        const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
        
        // Build conversation chain by traversing up the parent chain
        const buildChain = (currentId: string): void => {
          const node = state.nodes.find((n) => n.id === currentId);
          if (!node) return;
          
          // Recursively get parent's history first
          if (node.data.parentId) {
            buildChain(node.data.parentId);
          }
          
          // Add current node's conversation to history
          if (node.data.prompt && node.data.response) {
            history.push({ role: 'user', content: node.data.prompt });
            history.push({ role: 'assistant', content: node.data.response });
          }
        };
        
        buildChain(nodeId);
        return history;
      },
      
      // Session management
      createNewSession: () => {
        const state = get();
        const newSessionId = crypto.randomUUID();
        const newSession: CanvasSession = {
          id: newSessionId,
          title: 'New Canvas',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          nodes: [],
          edges: [],
        };
        
        set({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSessionId,
          nodes: [],
          edges: [],
        });
      },
      
      loadSession: (sessionId) => {
        const state = get();
        const session = state.sessions.find((s) => s.id === sessionId);
        if (session) {
          set({
            currentSessionId: sessionId,
            nodes: session.nodes,
            edges: session.edges,
          });
        }
      },
      
      deleteSession: (sessionId) => {
        const state = get();
        const updatedSessions = state.sessions.filter((s) => s.id !== sessionId);
        
        // If deleting current session, switch to another or create new
        if (state.currentSessionId === sessionId) {
          if (updatedSessions.length > 0) {
            const newCurrent = updatedSessions[0];
            set({
              sessions: updatedSessions,
              currentSessionId: newCurrent.id,
              nodes: newCurrent.nodes,
              edges: newCurrent.edges,
            });
          } else {
            // No sessions left, create a new one
            set({ sessions: [], currentSessionId: null, nodes: [], edges: [] });
            get().createNewSession();
          }
        } else {
          set({ sessions: updatedSessions });
        }
      },
      
      saveCurrentSession: () => {
        const state = get();
        if (!state.currentSessionId) {
          // No current session, create one
          get().createNewSession();
          return;
        }
        
        const updatedSessions = state.sessions.map((session) => {
          if (session.id === state.currentSessionId) {
            // Generate title from first node's prompt
            const firstNode = state.nodes.find((n) => !n.data.parentId);
            const title = firstNode?.data.prompt 
              ? firstNode.data.prompt.slice(0, 50) + (firstNode.data.prompt.length > 50 ? '...' : '')
              : 'New Canvas';
            
            return {
              ...session,
              title,
              updatedAt: Date.now(),
              nodes: state.nodes,
              edges: state.edges,
            };
          }
          return session;
        });
        
        set({ sessions: updatedSessions });
      },
      
      getCurrentSessionTitle: () => {
        const state = get();
        if (!state.currentSessionId) return 'New Canvas';
        const session = state.sessions.find((s) => s.id === state.currentSessionId);
        return session?.title || 'New Canvas';
      },
    }),
    {
      name: 'canvas-storage',
      // We only persist the data, optionally omit selected flags or position if we want, but keeping full persistence for MVP
    }
  )
);
