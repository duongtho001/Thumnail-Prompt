import React from 'react';
import { Clapperboard, Film, Phone, Users, Image as ImageIcon, ExternalLink, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <div className="sticky top-0 z-50 w-full flex flex-col font-sans">
      {/* Professional Top Bar */}
      <div className="bg-gradient-to-r from-gray-950 via-[#111] to-gray-950 border-b border-white/5 text-gray-400 py-2 px-2 sm:px-0 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] sm:text-xs font-medium relative z-10">
          
          {/* Developer Contact */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-default bg-white/5 sm:bg-transparent px-2 py-1 sm:p-0 rounded-full sm:rounded-none">
              <Phone className="w-3 h-3 text-cinema-accent" />
              <span className="tracking-wide">App của Thọ - 0934415387</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-center sm:justify-end">
            <a 
              href="https://zalo.me/g/sgkzgk550" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <div className="p-0.5 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-3 h-3" />
              </div>
              <span>Tham Gia Nhóm Zalo</span>
            </a>

            <div className="h-3 w-px bg-white/10 hidden sm:block"></div>

            <a 
              href="https://www.meta.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors group"
            >
              <div className="p-0.5 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                <ImageIcon className="w-3 h-3" />
              </div>
              <span>Tạo ảnh tại Meta AI</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-cinema-700 bg-cinema-900/80 backdrop-blur-xl shadow-lg shadow-black/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cinema-accent to-red-900 p-2 rounded-lg shadow-lg shadow-red-900/20 border border-white/5 group hover:shadow-red-500/20 transition-all duration-300">
              <Clapperboard className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                CINE<span className="text-cinema-accent">PROMPT</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500 border border-cinema-700/50 rounded-full px-3 py-1 bg-black/20">
              <Film className="w-3.5 h-3.5 text-cinema-accent" />
              <span className="tracking-wide font-medium">Đạo diễn Thumbnail AI</span>
            </div>
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-full text-gray-400 hover:bg-cinema-700 hover:text-white transition-colors"
              aria-label="Cài đặt API Key"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};