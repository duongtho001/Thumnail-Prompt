import React from 'react';
import { Trash2, Clock, ChevronRight } from 'lucide-react';
import { usePromptStore } from '../store';
import { PromptResult } from '../types';

interface HistoryListProps {
  onSelect: (item: PromptResult) => void;
  activeId?: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ onSelect, activeId }) => {
  const { history, deleteItem, clearHistory } = usePromptStore();

  if (history.length === 0) {
    return (
      <div className="text-center py-10 px-4 text-gray-600">
        <Clock className="w-8 h-8 mx-auto mb-3 opacity-20" />
        <p className="text-sm">Chưa có lịch sử.</p>
        <p className="text-xs mt-1">Hãy tạo prompt để xem lại tại đây.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-3 border-b border-cinema-800">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Kịch bản gần đây</h3>
        <button 
          onClick={clearHistory}
          className="text-xs text-red-500 hover:text-red-400 hover:underline"
        >
          Xóa tất cả
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group relative flex flex-col gap-1 p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
              activeId === item.id 
                ? 'bg-cinema-800 border-cinema-600 shadow-lg' 
                : 'bg-transparent border-transparent hover:bg-cinema-800/50 hover:border-cinema-700/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-200 font-medium line-clamp-2 leading-snug">
                {item.originalInput}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-600">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
              <ChevronRight className={`w-3 h-3 text-gray-600 ${activeId === item.id ? 'text-cinema-accent' : ''}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};