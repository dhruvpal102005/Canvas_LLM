import { Handle, Position } from '@xyflow/react';
import { Bot, Sparkles, Plus, CircleHelp, RefreshCw, Trash2, GitBranch } from 'lucide-react';
import { useCanvasStore, LLMNodeData } from '@/store/useCanvasStore';
import { useState, useRef, useEffect } from 'react';

export default function LLMNode({ id, data }: { id: string; data: LLMNodeData }) {
  const { updateNodeData, branchFromNode, deleteNode } = useCanvasStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [localPrompt, setLocalPrompt] = useState(data.prompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [localPrompt]);

  const handleGenerate = async (promptToUse = localPrompt) => {
    if (!promptToUse.trim()) return;

    updateNodeData(id, { prompt: promptToUse });
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptToUse, model: data.model }),
      });

      if (!response.ok) throw new Error('API Error');

      const result = await response.json();
      updateNodeData(id, { response: result.text });
    } catch (error) {
      console.error(error);
      updateNodeData(id, { response: 'Error: Failed to generate response.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestions = [
    { text: "fun things to do in nyc" },
    { text: "what is quantum computing" },
    { text: "explain how neural networks work" }
  ];

  return (
    <div className="relative">
      {/* Background Title for Root Node before interaction */}
      {!data.parentId && !data.response && localPrompt.trim() === '' && !isGenerating && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 flex flex-col items-center justify-center pointer-events-none select-none whitespace-nowrap">
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 mb-2 pointer-events-auto">LMCanvas</h1>
          <p className="text-gray-400 font-mono text-[10px] tracking-[0.2em] uppercase pointer-events-auto">Branch off your AI conversations</p>
        </div>
      )}

      {/* Main Node Card */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-[480px] overflow-hidden text-gray-800 font-sans group relative">
        <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-gray-300 border-none opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="px-5 py-4">

          {/* Header Row */}
          <div className="flex items-center justify-between mb-5">
            {/* Left Pill Group */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-1.5 py-1 box-border shadow-sm">
              <div className="flex items-center gap-1.5 px-2">
                <Bot className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">GPT-4.0</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <button className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Right Icon Actions */}
            <div className="flex items-center gap-2 text-gray-400">
              {data.response && (
                <button
                  onClick={() => handleGenerate(data.prompt)}
                  disabled={isGenerating}
                  className="p-1.5 hover:bg-gray-100 rounded-full hover:text-gray-700 transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button onClick={() => deleteNode(id)} className="p-1.5 hover:bg-gray-100 rounded-full hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full hover:text-gray-700 transition-colors">
                <CircleHelp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="mb-6 relative">
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-[15px] resize-none outline-none focus:ring-0 overflow-hidden leading-snug"
              rows={1}
              placeholder="Enter a prompt..."
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            {isGenerating && (
              <div className="absolute right-0 top-0 bottom-0 flex items-center">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm text-gray-400 animate-pulse">Generating</span>
              </div>
            )}
          </div>

          {/* Suggestions Row */}
          {!data.response && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLocalPrompt(suggestion.text);
                    handleGenerate(suggestion.text);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-xs font-semibold tracking-wide text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gray-400 font-light" />
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}

          {/* Response Area */}
          {data.response && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 text-[15px] leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {data.response}
                </div>
              </div>

              {/* Branching / Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => branchFromNode(id)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors shadow-md"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  Branch
                </button>
              </div>
            </div>
          )}
        </div>

        <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-gray-300 border-none opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
