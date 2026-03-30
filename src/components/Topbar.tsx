import { BrainCircuit, Save, Trash } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';

export default function Topbar() {
  const { clearCanvas } = useCanvasStore();

  return (
    <div className="h-14 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md flex items-center justify-between px-6 z-10 w-full shrink-0">
      <div className="flex items-center gap-2">
        <BrainCircuit className="w-6 h-6 text-blue-500" />
        <span className="font-semibold text-gray-100 tracking-wide text-lg">AI Canvas</span>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        {/* Simple model indicator / dummy selector for global state if we wanted, 
          but per-node model selection handles the actual prompts. */}
        <div className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-gray-400">
          <span className="mr-2">Global Models:</span>
          gpt-4o / gpt-4o-mini / gpt-3.5-turbo
        </div>

        <div className="h-4 w-px bg-gray-700 mx-2" />

        {/* Buttons */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          onClick={() => {
            // LocalStorage persist handles saving automatically, 
            // this is more of a visual reassurance or manual trigger trigger if needed later.
            alert('Canvas state is auto-saved locally!');
          }}
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
          onClick={() => {
            if (confirm('Are you sure you want to clear the canvas?')) {
              clearCanvas();
            }
          }}
        >
          <Trash className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
