import React from 'react';
import { AppData } from '../types';

interface SlideRendererProps {
  data: AppData;
  slideIndex: number;
  scale?: number;
  id?: string;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({ data, slideIndex, scale = 1, id }) => {
  const slide = data.slides[slideIndex];
  const style = data.styleConfig;
  
  if (!slide) return null;

  // Xiaohongshu 3:4 aspect ratio
  // Base width 540px -> Height 720px
  const BASE_WIDTH = 540;
  const BASE_HEIGHT = 720;

  const containerStyle: React.CSSProperties = {
    width: `${BASE_WIDTH}px`,
    height: `${BASE_HEIGHT}px`,
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    fontFamily: style.fontFamilyBody,
    backgroundImage: style.backgroundImage ? `url(${style.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      id={id}
      className="relative flex flex-col overflow-hidden transition-all duration-300 shadow-sm"
      style={containerStyle}
    >
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: style.backgroundColor, opacity: style.overlayOpacity ?? 0, zIndex: 0 }}
      />

      {/* Grid Pattern Decoration (Subtle) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]" 
        style={{ 
          backgroundImage: `radial-gradient(${style.textColor} 1px, transparent 1px)`, 
          backgroundSize: '24px 24px',
          zIndex: 0
        }}
      />

      {/* RedNote Style Decorations */}
      {/* Top Right "Sticker" */}
      <div className="absolute top-4 right-4 z-0 opacity-20 transform rotate-12 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor" style={{ color: style.accentColor }}>
          <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" />
        </svg>
      </div>

      {/* Content Container - Increased Padding for better aesthetics */}
      <div className="relative z-10 flex-grow flex flex-col p-12">
        
        {/* Header Section */}
        <div className="mb-8 relative">
           {/* Decorative corner line */}
           <div className="absolute -left-6 top-1 w-1 h-8 rounded-full" style={{ backgroundColor: style.accentColor }}></div>

          {/* Main Title with wrapping support */}
          {slide.title && (
            <h1 
              className="font-black leading-[1.2] mb-5 tracking-tight whitespace-pre-wrap relative z-10"
              style={{ 
                fontFamily: style.fontFamilyHead,
                fontSize: `${style.titleFontSize}px`,
                textShadow: '2px 2px 0px rgba(0,0,0,0.05)'
              }}
            >
              {slide.title}
            </h1>
          )}

          {/* Meta Row: Vol/Date + Tag */}
          <div className="flex items-center gap-3 text-xs font-bold tracking-wide">
            <div 
              className="px-3 py-1.5 border-2 rounded-lg opacity-80" 
              style={{ borderColor: style.textColor }}
            >
              {data.meta.date}
            </div>
            {data.meta.topic && (
               <div 
                className="px-3 py-1.5 rounded-lg shadow-sm"
                style={{ backgroundColor: style.accentColor, color: style.backgroundColor }} 
              >
                {data.meta.topic}
              </div>
            )}
          </div>
        </div>

        {/* Divider (Optional, removed for cleaner look, relied on spacing) */}
        {/* <div className="w-16 h-1.5 mb-8 opacity-20 rounded-full" style={{ backgroundColor: style.textColor }}></div> */}

        {/* Body Content */}
        <div className="flex-grow flex flex-col justify-between">
          <div 
            className="leading-relaxed whitespace-pre-wrap font-medium opacity-90 relative"
            style={{ fontSize: '24px', lineHeight: '1.6' }} 
          >
            {slide.body}
          </div>

          {slide.highlight && (
            <div 
              className="mt-8 p-6 rounded-2xl relative overflow-hidden shrink-0 transform rotate-[-1deg] shadow-sm border-2 border-black/5"
              style={{ backgroundColor: style.backgroundColor === '#ffffff' ? '#f8f9fa' : `${style.backgroundColor}80`, backdropFilter: 'blur(4px)' }}
            >
              <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: style.accentColor }}></div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                 <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
              </div>
              <p className="font-bold italic opacity-90 text-xl relative z-10" style={{ fontFamily: style.fontFamilyHead, color: style.textColor }}>
                “{slide.highlight}”
              </p>
            </div>
          )}
        </div>

        {/* Footer: Account Brand */}
        <div className="mt-10 pt-6 border-t-2 border-black/5 flex justify-between items-end opacity-60 shrink-0">
           <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-[0.2em] mb-1.5 font-bold opacity-60">Created by</span>
              <div className="flex items-center gap-2">
                 <div className="font-black text-sm tracking-tight">{data.meta.handle}</div>
              </div>
           </div>
           <div className="text-5xl font-black opacity-10 leading-none -mb-2" style={{ fontFamily: style.fontFamilyHead }}>
             {String(slideIndex + 1).padStart(2, '0')}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SlideRenderer;