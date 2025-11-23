import React, { useState } from 'react';
import { Header } from './components/Header';
import { OutputCard } from './components/OutputCard';
import { HistoryList } from './components/HistoryList';
import { SettingsModal } from './components/SettingsModal';
import { generateCinematicPrompt } from './services/gemini';
import { usePromptStore } from './store';
import { AppStatus, PromptResult } from './types';
import { Wand2, Loader2, Menu, X, Film, MessageSquare, Lightbulb } from 'lucide-react';

const SAMPLE_PROMPTS = [
  "Một thám tử cyberpunk điều tra vụ án robot trong mưa Neo-Tokyo.",
  "Một phi hành gia cô đơn khám phá khu vườn phát sáng trên sao Hỏa.",
  "Phim kinh dị về chiếc gương bị nguyền rủa trong dinh thự bỏ hoang.",
  "Đầu bếp vô tình triệu hồi quỷ khi đang nướng bánh kem."
];

export default function App() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentResult, setCurrentResult] = useState<PromptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { addToHistory, getCurrentApiKey, cycleApiKey, getTotalApiKeysCount } = usePromptStore();

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    const totalKeys = getTotalApiKeysCount();
    if (totalKeys === 0) {
      setStatus(AppStatus.ERROR);
      setError("Không có API Key nào được cấu hình. Mở Cài đặt (biểu tượng bánh răng) để thêm key của bạn.");
      return;
    }

    try {
      const generatedText = await generateCinematicPrompt(
        input,
        getCurrentApiKey,
        cycleApiKey,
        totalKeys
      );
      
      const result: PromptResult = {
        id: crypto.randomUUID(),
        originalInput: input,
        generatedPrompt: generatedText,
        timestamp: Date.now(),
      };

      setCurrentResult(result);
      addToHistory(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setStatus(AppStatus.ERROR);
      console.error("Lỗi trong handleGenerate:", err);
      setError(err.message || "Không thể tạo prompt. Vui lòng thử lại.");
    }
  };

  const handleHistorySelect = (item: PromptResult) => {
    setCurrentResult(item);
    setInput(item.originalInput);
    setSidebarOpen(false); // Close sidebar on mobile selection
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-cinema-accent selection:text-white">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - Desktop: Static, Mobile: Overlay */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-30 w-72 bg-cinema-900 border-r border-cinema-800 transform transition-transform duration-300 ease-in-out pt-16 md:pt-0 md:relative md:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-full flex flex-col">
            <HistoryList onSelect={handleHistorySelect} activeId={currentResult?.id} />
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative">
          
          {/* Mobile Toggle */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden absolute top-4 left-4 p-2 bg-cinema-800 rounded-lg border border-cinema-700 text-gray-300 z-10"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
            
            {/* Hero Text */}
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
                Đạo Diễn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-accent to-orange-500">Kiệt Tác</span> Của Bạn
              </h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                Mô tả ý tưởng video của bạn, AI sẽ tạo ra prompt poster điện ảnh chuẩn chỉnh cho thumbnail YouTube.
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-cinema-900 border border-cinema-700 rounded-2xl shadow-2xl p-2 group focus-within:border-cinema-500 transition-colors">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mô tả câu chuyện của bạn: ví dụ: Một samurai tương lai bảo vệ ngôi làng trong rừng neon..."
                  className="w-full h-32 bg-transparent text-lg text-white placeholder-gray-600 p-4 resize-none focus:outline-none rounded-xl"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                  {input.length} ký tự
                </div>
              </div>

              {/* Hint for Vietnamese Text */}
              <div className="mx-2 mt-2 px-3 py-2 bg-amber-950/20 border border-amber-900/30 rounded-lg flex items-start sm:items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  <strong className="text-amber-500">Mẹo:</strong> Nếu bạn muốn tạo Thumbnail có chứa <strong>Tiếng Việt</strong>, hãy ưu tiên sử dụng <strong>Nano Banana</strong> để hiển thị văn bản chính xác nhất.
                </p>
              </div>
              
              <div className="px-2 pb-2 flex justify-between items-center border-t border-cinema-800 pt-3 mt-2">
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar max-w-[60%]">
                  {/* Quick Suggestions */}
                  {input.length === 0 && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setInput(SAMPLE_PROMPTS[0])}
                        className="text-xs bg-cinema-800 hover:bg-cinema-700 text-gray-400 px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                      >
                        Viễn tưởng
                      </button>
                      <button 
                        onClick={() => setInput(SAMPLE_PROMPTS[2])}
                        className="text-xs bg-cinema-800 hover:bg-cinema-700 text-gray-400 px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                      >
                        Kinh dị
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={status === AppStatus.LOADING || !input.trim()}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-200
                    ${status === AppStatus.LOADING || !input.trim() 
                      ? 'bg-cinema-700 cursor-not-allowed opacity-50' 
                      : 'bg-gradient-to-r from-cinema-accent to-red-600 hover:shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98]'}
                  `}
                >
                  {status === AppStatus.LOADING ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Tạo Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            {/* Result Display */}
            {currentResult && (
              <OutputCard result={currentResult} />
            )}

            {/* Empty State / Features */}
            {!currentResult && !error && status === AppStatus.IDLE && (
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-xl bg-cinema-900/30 border border-cinema-800/30">
                  <div className="w-10 h-10 bg-cinema-800 rounded-full flex items-center justify-center mx-auto mb-3 text-cinema-accent">
                    <Film className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-200 font-medium mb-1">Phong cách Điện ảnh</h3>
                  <p className="text-gray-500 text-xs">Tự động áp dụng ánh sáng kịch tính và hiệu ứng film 4K.</p>
                </div>
                <div className="p-4 rounded-xl bg-cinema-900/30 border border-cinema-800/30">
                  <div className="w-10 h-10 bg-cinema-800 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-200 font-medium mb-1">Tiêu đề Ấn tượng</h3>
                  <p className="text-gray-500 text-xs">Tạo tiêu đề tiếng Anh mạnh mẽ, thu hút lượt click.</p>
                </div>
                <div className="p-4 rounded-xl bg-cinema-900/30 border border-cinema-800/30">
                  <div className="w-10 h-10 bg-cinema-800 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-500">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-200 font-medium mb-1">Một chạm</h3>
                  <p className="text-gray-500 text-xs">Nhận prompt sẵn sàng để dán vào Midjourney hoặc Flux ngay lập tức.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}