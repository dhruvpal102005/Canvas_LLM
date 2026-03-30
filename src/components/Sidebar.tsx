import { Plus, List, Folder } from 'lucide-react';
import { useCanvasStore, LLMNode, SupportedModel } from '@/store/useCanvasStore';

export default function Sidebar() {
  const { addNode } = useCanvasStore();

  const handleNewNode = () => {
    const newNode: LLMNode = {
      id: crypto.randomUUID(),
      type: 'llmNode',
      position: { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }, // Centerish screen
      data: {
        prompt: '',
        response: '',
        model: 'gpt-4o' as SupportedModel, // default model
        parentId: null,
        childrenIds: [],
      },
    };
    addNode(newNode);
  };

  return (
    <div className="w-64 border-r border-gray-800 bg-gray-950/80 backdrop-blur-md flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={handleNewNode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-5 h-5" />
          New Node
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative group">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <List className="w-3 h-3" />
          Saved Canvases
        </h3>
        
        {/* Placeholder UI for Canvases List - Currently just the single auto-saved instance */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer text-gray-300">
          <Folder className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">Default Canvas</span>
        </div>
        
        {/* Future Expandability UI Mock */}
        <div className="flex items-center gap-3 p-3 rounded-lg text-gray-500 hover:bg-gray-800/50 hover:text-gray-300 transition-colors cursor-not-allowed">
          <Folder className="w-4 h-4" />
          <span className="text-sm font-medium">Archived Project</span>
        </div>
        
        {/* Fade Out */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-950/80 pb-0" />
      </div>
    </div>
  );
}
