import React, { useState, useEffect } from 'react';
import { X, KeyRound, Save } from 'lucide-react';
import { usePromptStore } from '../store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { availableApiKeys, currentApiKeyIndex, setApiKeys } = usePromptStore();
  const [localKeys, setLocalKeys] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Load keys from store into local state when modal opens
      setLocalKeys(availableApiKeys.join('\n'));
    }
  }, [isOpen, availableApiKeys]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKeys(localKeys);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-cinema-800 border border-cinema-700 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg m-auto flex flex-col animate-fade-in-up"
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
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Status Section */}
          <div className="space-y-3">
             <h3 className="text-sm font-medium text-gray-400">Trạng thái hiện tại</h3>
             <div className="bg-cinema-900/50 border border-cinema-700 rounded-lg p-4 flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{availableApiKeys.length}</p>
                  <p className="text-xs text-gray-500">Key đã lưu</p>
                </div>
                <div className="w-px bg-cinema-700"></div>
                 <div>
                  <p className={`text-2xl font-bold ${availableApiKeys.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {availableApiKeys.length > 0 ? `#${currentApiKeyIndex + 1}` : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">Key đang dùng</p>
                </div>
             </div>
          </div>

          {/* Input Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">Danh sách API Key</h3>
            <p className="text-xs text-gray-500">
              Dán các API key của bạn vào đây, mỗi key một dòng. Ứng dụng sẽ tự động sử dụng key tiếp theo nếu key hiện tại hết hạn mức.
            </p>
            <textarea
              value={localKeys}
              onChange={(e) => setLocalKeys(e.target.value)}
              placeholder="AIzaSy... (dòng 1)&#10;AIzaSy... (dòng 2)&#10;..."
              className="w-full h-40 bg-black/50 border border-cinema-600 rounded-lg p-3 text-sm font-mono text-gray-300 resize-y focus:outline-none focus:ring-2 focus:ring-cinema-accent/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-cinema-900/50 border-t border-cinema-700 flex justify-end items-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:bg-cinema-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-cinema-accent hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu API Keys
            </button>
        </div>
      </div>
    </div>
  );
};