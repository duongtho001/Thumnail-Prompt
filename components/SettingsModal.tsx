import React, { useState } from 'react';
import { X, KeyRound, Info, Copy, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalKeys: number;
  currentIndex: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, totalKeys, currentIndex }) => {
  const [copied, setCopied] = useState(false);
  const exampleText = 'API_KEY=key_cua_ban_1,key_cua_ban_2,key_cua_ban_3';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(exampleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-cinema-800 border border-cinema-700 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md m-auto flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-cinema-700">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-cinema-accent" />
            <h2 className="text-lg font-semibold text-white">Cài đặt API Key</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-cinema-700 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Status Section */}
          <div className="space-y-3">
             <h3 className="text-sm font-medium text-gray-400">Trạng thái hiện tại</h3>
             <div className="bg-cinema-900/50 border border-cinema-700 rounded-lg p-4 flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{totalKeys}</p>
                  <p className="text-xs text-gray-500">Key đã tải</p>
                </div>
                <div className="w-px bg-cinema-700"></div>
                 <div>
                  <p className={`text-2xl font-bold ${totalKeys > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalKeys > 0 ? `#${currentIndex + 1}` : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">Key đang dùng</p>
                </div>
             </div>
          </div>

          {/* Instructions Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">Cách cấu hình</h3>
            <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-4 text-sm text-blue-200/90 space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <p>
                  Ứng dụng này lấy API key từ một biến môi trường tên là <code className="bg-black/50 px-1 py-0.5 rounded text-white font-mono text-xs">process.env.API_KEY</code>. 
                  <strong>Bạn không thể nhập key trực tiếp tại đây.</strong>
                </p>
              </div>
               <p>Để sử dụng nhiều key, hãy thêm chúng vào biến môi trường, phân tách bằng dấu phẩy.</p>
            </div>
          </div>
          
          {/* Example Section */}
           <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Ví dụ</h3>
            <div className="flex items-center gap-2 bg-black/50 border border-cinema-600 rounded-lg p-3">
              <code className="flex-1 text-gray-300 font-mono text-xs overflow-x-auto">{exampleText}</code>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 p-1.5 rounded-md text-xs font-medium transition-colors ${
                  copied 
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-cinema-700 hover:bg-cinema-600 text-gray-300'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-cinema-900/50 border-t border-cinema-700 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-cinema-accent hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Đã hiểu
            </button>
        </div>
      </div>
    </div>
  );
};
