import React, { useState } from 'react';
import { Trash2, Plus, SplitSquareHorizontal, Type, Image as ImageIcon, Sliders, Upload, Palette, Sparkles, FileText } from 'lucide-react';
import { AppData, SlideContent, ThemeType, StyleConfig } from '../types';
import { THEMES } from '../constants';
import { paginateText } from '../utils/exportManager';

interface EditorPanelProps {
  data: AppData;
  onChange: (newData: AppData) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'style' | 'content'>('style');
  const [showSmartPaste, setShowSmartPaste] = useState(false);
  const [smartText, setSmartText] = useState('');

  const updateMeta = (key: keyof AppData['meta'], value: string) => {
    onChange({
      ...data,
      meta: { ...data.meta, [key]: value }
    });
  };

  const updateSlide = (index: number, field: keyof SlideContent, value: string) => {
    const newSlides = [...data.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    onChange({ ...data, slides: newSlides });
  };

  const addSlide = () => {
    const newSlide: SlideContent = {
      id: `slide-${Date.now()}`,
      title: '新标题',
      body: '在此输入正文内容...',
    };
    onChange({ ...data, slides: [...data.slides, newSlide] });
  };

  const removeSlide = (index: number) => {
    const newSlides = data.slides.filter((_, i) => i !== index);
    onChange({ ...data, slides: newSlides });
  };

  // 单页内部分裂
  const splitSlideContent = (index: number) => {
    const slideToSplit = data.slides[index];
    const chunks = paginateText(slideToSplit.body, 100); 
    
    if (chunks.length <= 1) return; 

    const newSlidesFromSplit: SlideContent[] = chunks.map((chunk, i) => ({
      id: `split-${Date.now()}-${i}`,
      title: i === 0 ? slideToSplit.title : `${slideToSplit.title} (续)`,
      body: chunk,
      highlight: i === 0 ? slideToSplit.highlight : undefined 
    }));

    const newSlides = [
      ...data.slides.slice(0, index),
      ...newSlidesFromSplit,
      ...data.slides.slice(index + 1)
    ];

    onChange({ ...data, slides: newSlides });
  };

  // 智能长文处理
  const handleSmartBatch = () => {
    if (!smartText.trim()) return;

    // 假设第一行是标题，或者没有标题
    const lines = smartText.split('\n');
    let title = '智能生成主题';
    let bodyText = smartText;

    if (lines.length > 0 && lines[0].length < 30) {
       title = lines[0];
       bodyText = lines.slice(1).join('\n');
    }

    const chunks = paginateText(bodyText, 110); // 适合封面的字数

    const newSlides: SlideContent[] = chunks.map((chunk, i) => ({
      id: `smart-${Date.now()}-${i}`,
      title: i === 0 ? title : `${title}`, // 每一页都保留标题，或者可以设为空
      body: chunk,
      highlight: i === chunks.length - 1 ? '一键三连 · 关注不迷路' : undefined // 最后一页加引导
    }));

    onChange({ ...data, slides: newSlides });
    setSmartText('');
    setShowSmartPaste(false);
  };

  const handleThemeChange = (themeId: ThemeType) => {
    const newTheme = THEMES[themeId];
    onChange({
      ...data,
      themeId: themeId,
      styleConfig: { ...newTheme } // Reset overrides when changing theme
    });
  };

  const updateStyle = (key: keyof StyleConfig, value: any) => {
    onChange({
      ...data,
      styleConfig: {
        ...data.styleConfig,
        [key]: value
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateStyle('backgroundImage', reader.result as string);
        updateStyle('overlayOpacity', 0.5); // Set default opacity when image is added
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    updateStyle('backgroundImage', undefined);
    updateStyle('overlayOpacity', 0);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Visual Tab Switcher */}
      <div className="flex p-3 gap-2 border-b border-gray-100 bg-gray-50/50">
        <button 
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'style' ? 'bg-white shadow text-blue-600 ring-1 ring-black/5' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Palette size={16} /> 样式
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'content' ? 'bg-white shadow text-blue-600 ring-1 ring-black/5' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Type size={16} /> 内容
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'style' ? (
          <div className="p-5 space-y-8">
            {/* Style Grid */}
            <section>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    🎨 风格选择
                 </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.values(THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id as ThemeType)}
                    className={`relative p-2 rounded-lg border text-left transition-all overflow-hidden group ${data.themeId === theme.id ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                       <div className="w-4 h-4 rounded-full shadow-sm border border-black/5" style={{ backgroundColor: theme.backgroundColor }}></div>
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 block truncate">{theme.name.split(' ')[1] || theme.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Appearance Micro-tuning */}
            <section className="space-y-5 pt-5 border-t border-gray-100">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-800 flex items-center gap-2">
                     <Sliders size={14} /> 外观微调
                  </h3>
                  <Sliders size={14} className="text-gray-400 opacity-50" />
               </div>
               
               {/* Font Sliders */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-gray-600">标题字号</label>
                        <span className="text-xs font-mono text-gray-400">{data.styleConfig.titleFontSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="32" 
                        max="80" 
                        value={data.styleConfig.titleFontSize} 
                        onChange={(e) => updateStyle('titleFontSize', Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                   </div>
                   
                   <div>
                      <label className="text-xs font-bold text-gray-600 block mb-3">配色方案</label>
                      <div className="flex gap-4">
                         <div className="flex flex-col gap-1.5 flex-1">
                            <input 
                               type="color" 
                               value={data.styleConfig.backgroundColor}
                               onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                               className="w-full h-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-[10px] text-center text-gray-500">背景色</span>
                         </div>
                         <div className="flex flex-col gap-1.5 flex-1">
                            <input 
                               type="color" 
                               value={data.styleConfig.textColor}
                               onChange={(e) => updateStyle('textColor', e.target.value)}
                               className="w-full h-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-[10px] text-center text-gray-500">文字色</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Background Image */}
                <div className="space-y-3">
                   <h4 className="text-xs font-bold text-gray-600">封面配图</h4>
                   <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative group">
                      {data.styleConfig.backgroundImage ? (
                        <div className="relative">
                           <img src={data.styleConfig.backgroundImage} alt="Background" className="h-20 w-full object-cover rounded-md opacity-50" />
                           <button onClick={clearImage} className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={16} /> 删除
                           </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                           <ImageIcon className="text-gray-300" size={24} />
                           <span className="text-xs text-gray-400">点击上传图片</span>
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      )}
                   </div>
                   {data.styleConfig.backgroundImage && (
                     <div>
                        <div className="flex justify-between mb-1">
                           <label className="text-xs text-gray-500">遮罩浓度</label>
                           <span className="text-xs text-gray-400">{Math.round((data.styleConfig.overlayOpacity || 0) * 100)}%</span>
                        </div>
                        <input 
                           type="range" 
                           min="0" 
                           max="1" 
                           step="0.05"
                           value={data.styleConfig.overlayOpacity || 0}
                           onChange={(e) => updateStyle('overlayOpacity', Number(e.target.value))}
                           className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-blue-600"
                        />
                     </div>
                   )}
                </div>
            </section>
          </div>
        ) : (
          <div className="p-5 space-y-6">
             {/* Global Meta Inputs */}
             <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">全局信息</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="账号名称"
                    value={data.meta.handle}
                    onChange={(e) => updateMeta('handle', e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="作者/来源"
                    value={data.meta.author}
                    onChange={(e) => updateMeta('author', e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="期数/日期"
                    value={data.meta.date}
                    onChange={(e) => updateMeta('date', e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="标签"
                    value={data.meta.topic}
                    onChange={(e) => updateMeta('topic', e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
             </div>

             {/* Smart Pagination Tool */}
             <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4">
                <button 
                  onClick={() => setShowSmartPaste(!showSmartPaste)}
                  className="flex items-center justify-between w-full text-blue-700 font-bold text-sm"
                >
                  <span className="flex items-center gap-2"><Sparkles size={16} /> 智能长文转幻灯片</span>
                  <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-800">{showSmartPaste ? '收起' : '展开'}</span>
                </button>
                
                {showSmartPaste && (
                  <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <textarea 
                      value={smartText}
                      onChange={(e) => setSmartText(e.target.value)}
                      placeholder="在此粘贴长篇文章，系统将自动识别段落并拆分为多张幻灯片（每页约110字）..."
                      className="w-full h-32 text-xs p-3 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                    />
                    <div className="flex gap-2">
                       <button 
                         onClick={handleSmartBatch}
                         disabled={!smartText.trim()}
                         className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                       >
                         开始智能分页
                       </button>
                       <button 
                         onClick={() => { setSmartText(''); setShowSmartPaste(false); }}
                         className="px-3 bg-white text-gray-500 text-xs font-bold py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                       >
                         取消
                       </button>
                    </div>
                    <p className="text-[10px] text-gray-400">提示：这将覆盖当前的所有幻灯片内容。</p>
                  </div>
                )}
             </div>

             {/* Slide Editor */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-bold text-gray-800">幻灯片内容</h3>
                   <span className="text-xs text-gray-400">{data.slides.length} 页</span>
                </div>

                {data.slides.map((slide, idx) => (
                  <div key={slide.id} className="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-black text-gray-400 bg-gray-100 px-2 py-1 rounded">P.{String(idx + 1).padStart(2, '0')}</div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => splitSlideContent(idx)}
                          title="从此页拆分剩余文本"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <SplitSquareHorizontal size={14} />
                        </button>
                        <button 
                          onClick={() => removeSlide(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <textarea 
                          value={slide.title || ''}
                          onChange={(e) => updateSlide(idx, 'title', e.target.value)}
                          placeholder="输入标题 (可选)..."
                          className="w-full text-sm font-bold border-b border-gray-100 pb-2 focus:border-blue-500 focus:outline-none placeholder-gray-300 resize-none h-10"
                      />
                      
                      <textarea 
                          value={slide.body}
                          onChange={(e) => updateSlide(idx, 'body', e.target.value)}
                          placeholder="输入正文内容..."
                          className="w-full text-xs leading-relaxed p-3 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-200 focus:outline-none min-h-[120px] resize-y"
                      />

                      <input 
                          type="text"
                          placeholder="金句 / 重点高亮..."
                          value={slide.highlight || ''}
                          onChange={(e) => updateSlide(idx, 'highlight', e.target.value)}
                          className="w-full text-xs p-2.5 rounded bg-yellow-50 border border-yellow-100 text-yellow-800 placeholder-yellow-800/30 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}

                <button 
                    onClick={addSlide}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                >
                    <Plus size={18} /> 添加新页面
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPanel;