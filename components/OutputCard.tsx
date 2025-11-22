import React, { useState } from 'react';
import { Copy, Check, Sparkles, Type, Aperture, Palette, PenTool, Terminal } from 'lucide-react';
import { PromptResult } from '../types';

interface OutputCardProps {
  result: PromptResult;
}

export const OutputCard: React.FC<OutputCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  // Helper to parse the specific format for better UI display
  const parsePrompt = (text: string) => {
    const titleMatch = text.match(/Title:\s*(.+)/);
    const descMatch = text.match(/Cinematic Description:\s*([\s\S]+?)(?=Poster Text:|$)/);
    const posterTextMatch = text.match(/Poster Text:\s*(.+)/);
    const styleMatch = text.match(/Style:\s*(.+)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : 'Untitled',
      description: descMatch ? descMatch[1].trim() : text,
      posterText: posterTextMatch ? posterTextMatch[1].trim() : '',
      style: styleMatch ? styleMatch[1].trim() : ''
    };
  };

  const parsed = parsePrompt(result.generatedPrompt);

  // Construct the seamless prompt for copying
  // Logic: Combine the parts into a single paragraph as requested by the user
  const seamlessPrompt = `Create a dramatic cinematic poster showing ${parsed.description} ${parsed.posterText ? `Add bold cinematic text on the poster: "${parsed.posterText.replace(/^Include the title text on the poster:\s*"?|"?$/g, '')}"` : ''} Style: ${parsed.style || 'Ultra cinematic, dramatic lighting, 4K detail, film-grain, epic tone.'}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(seamlessPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-cinema-800 border border-cinema-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 mt-8 animate-fade-in-up">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-cinema-900 to-cinema-800 px-6 py-4 border-b border-cinema-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="font-medium text-gray-200">Prompt Đã Tạo</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            copied 
              ? 'bg-green-900/30 text-green-400 border border-green-800' 
              : 'bg-cinema-700 hover:bg-cinema-600 text-gray-300 border border-transparent'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Đã sao chép' : 'Sao chép Prompt'}
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Title Section */}
        <div className="space-y-2 text-center pb-4 border-b border-cinema-700/50">
          <div className="flex items-center justify-center gap-2 text-cinema-accent uppercase text-xs font-bold tracking-widest">
            <Type className="w-4 h-4" />
            Tiêu đề
          </div>
          <div className="text-2xl sm:text-4xl font-display font-bold text-white tracking-wide leading-tight">
            {parsed.title}
          </div>
        </div>

        {/* Seamless Prompt Preview (What will be copied) */}
        <div className="bg-black/40 rounded-xl border border-cinema-600/50 p-4 relative group">
          <div className="absolute -top-3 left-4 bg-cinema-800 px-2 text-xs font-bold text-cinema-accent flex items-center gap-1">
             <Terminal className="w-3 h-3" />
             PROMPT SẴN SÀNG SỬ DỤNG
          </div>
          <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {seamlessPrompt}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80 hover:opacity-100 transition-opacity">
          
          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-gray-400 uppercase text-xs font-bold tracking-widest">
              <Aperture className="w-4 h-4" />
              Mô tả kịch bản
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {parsed.description}
            </p>
          </div>

          {/* Poster Text */}
          <div className="bg-cinema-900/30 p-3 rounded-lg border border-cinema-700/30">
             <div className="flex items-center gap-2 text-blue-400 uppercase text-xs font-bold tracking-widest mb-2">
              <PenTool className="w-4 h-4" />
              Văn bản trên ảnh
            </div>
            <div className="text-gray-300 font-mono text-xs">
              {parsed.posterText}
            </div>
          </div>

          {/* Style */}
          <div className="bg-cinema-900/30 p-3 rounded-lg border border-cinema-700/30">
             <div className="flex items-center gap-2 text-purple-400 uppercase text-xs font-bold tracking-widest mb-2">
              <Palette className="w-4 h-4" />
              Phong cách
            </div>
            <div className="text-gray-300 font-mono text-xs">
              {parsed.style}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};