import React, { useState } from 'react';
import { Download, LayoutTemplate, Github, ExternalLink, CheckCircle } from 'lucide-react';
import { DEFAULT_DATA, THEMES } from './constants';
import { AppData } from './types';
import EditorPanel from './components/EditorPanel';
import SlideRenderer from './components/SlideRenderer';
import { exportToZip } from './utils/exportManager';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Generate IDs based on current slide count
    const ids = data.slides.map((_, i) => `capture-slide-${i}`);
    await exportToZip(ids, `RedNote-Export-${Date.now()}`);
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f0f2f5] font-sans">
      {/* Header / Toolbar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/20">
            <LayoutTemplate size={20} />
          </div>
          <div>
            <h1 className="font-black text-gray-800 tracking-tight text-lg leading-tight">RedNote <span className="text-blue-600">Pro</span></h1>
            <p className="text-[10px] text-gray-400 font-medium">阿星AI工作室</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center text-xs text-gray-500 gap-4 mr-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
             <span className="flex items-center gap-1.5 font-medium"><CheckCircle size={12} className="text-green-500" /> 准备就绪</span>
             <span className="w-px h-3 bg-gray-300"></span>
             <span>{data.slides.length} 张幻灯片</span>
           </div>
           
           <button 
             onClick={handleExport}
             disabled={isExporting}
             className={`flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-95 ${isExporting ? 'opacity-70 cursor-wait' : ''}`}
           >
             {isExporting ? (
               <>
                 <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                 生成中...
               </>
             ) : (
               <>
                 <Download size={18} />
                 打包下载
               </>
             )}
           </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Editor Panel */}
        <div className="w-[400px] shrink-0 h-full shadow-xl z-10 bg-white">
          <EditorPanel data={data} onChange={setData} />
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 bg-[#f0f2f5] overflow-y-auto p-8 relative flex justify-center">
          <div className="w-full max-w-5xl">
             <div className="flex justify-between items-end mb-6 px-4">
                <div>
                   <h2 className="text-xl font-black text-gray-800">实时预览</h2>
                   <p className="text-sm text-gray-400 mt-1">3:4 纵向排版 (小红书/RedNote 封面标准)</p>
                </div>
                {/* Scale control could go here */}
             </div>

             <div className="flex flex-wrap gap-10 justify-center pb-20">
               {data.slides.map((_, index) => (
                 <div key={index} className="relative group flex flex-col items-center">
                   {/* This wrapper handles the visual display scaling */}
                   <div className="origin-top scale-[0.65] md:scale-[0.75] shadow-2xl rounded-sm transition-transform duration-500 group-hover:-translate-y-2">
                      {/* The actual component to capture */}
                      <SlideRenderer 
                        data={data} 
                        slideIndex={index} 
                        id={`capture-slide-${index}`}
                        scale={1} 
                      />
                   </div>
                   
                   {/* Overlay to block interaction on preview */}
                   <div className="absolute inset-0 z-10 pointer-events-none"></div>
                   
                   {/* Page Indicator */}
                   <div className="mt-[-80px] md:mt-[-40px] bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-gray-200 z-0">
                      第 {index + 1} 页
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;