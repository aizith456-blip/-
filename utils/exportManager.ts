import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export const exportToZip = async (slideIds: string[], filename: string = 'rednote-export') => {
  const zip = new JSZip();
  const folder = zip.folder("slides");

  if (!folder) return;

  // 顺序处理以避免浏览器资源耗尽
  for (let i = 0; i < slideIds.length; i++) {
    const element = document.getElementById(slideIds[i]);
    if (element) {
      try {
        // 高倍率以获得更好的质量
        const canvas = await html2canvas(element, {
          scale: 2, 
          useCORS: true,
          backgroundColor: null, // 如果样式规定透明则透明，否则继承
          logging: false,
        });

        const dataUrl = canvas.toDataURL('image/png');
        // 移除头部以获取纯 base64
        const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
        
        folder.file(`slide-${i + 1}.png`, base64Data, { base64: true });
      } catch (err) {
        console.error(`无法捕获幻灯片 ${i + 1}`, err);
      }
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  
  // 处理 file-saver 在不同模块环境下的导出差异
  // Handle file-saver export differences in various module environments
  const saveAs = (FileSaver as any).saveAs || FileSaver;
  saveAs(content, `${filename}.zip`);
};

// 将长文本分割成块的工具（智能分页助手）
// 优化版：支持 Emoji 字符统计，优先按句、按逗号分割，保证阅读连贯性
export const paginateText = (text: string, maxChars: number = 100): string[] => {
  if (!text) return [];

  // 辅助函数：安全地按长度分割字符串（正确处理 Emoji 等代理对）
  const safeSplit = (str: string, limit: number): string[] => {
    const chars = Array.from(str); // Array.from 正确处理 Unicode 代理对
    const result: string[] = [];
    let current = '';
    
    for (const char of chars) {
      // 简单估算：虽然 Emoji visually 可能是 2 宽，但在 JS string length 中通常是 2。
      // maxChars 通常是字符数限制，不是严格的像素宽度。
      if (current.length + char.length > limit) {
        if (current) result.push(current);
        current = char;
      } else {
        current += char;
      }
    }
    if (current) result.push(current);
    return result;
  };

  const chunks: string[] = [];
  let currentChunk = '';

  const pushChunk = () => {
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
  };

  // 1. 预处理：按段落分割（双换行视为段落间隔）
  // 保留段落结构，用于逻辑分块
  const paragraphs = text.split(/\n\s*\n/);

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    // 尝试将整个段落加入当前块
    // 如果当前块不为空，需要加上换行符作为间隔
    const separator = currentChunk ? '\n\n' : '';
    const potentialContent = currentChunk + separator + cleanPara;

    if (potentialContent.length <= maxChars) {
      currentChunk = potentialContent;
      continue;
    }

    // --- 段落无法直接放入当前块 ---

    // 策略 A: 如果段落本身能放入一个新的空白页，则直接换页
    if (cleanPara.length <= maxChars) {
      pushChunk(); // 结束当前页
      currentChunk = cleanPara; // 在新页放入该段落
      continue;
    }

    // 策略 B: 段落超长，必须进行拆分
    // 首先，将当前缓存的内容推入（如果存在），腾出空间处理这个长段落
    if (currentChunk) {
        pushChunk();
    }

    // 拆分层级 1: 按句子拆分 (保留分隔符)
    // 匹配中文和英文的句号、感叹号、问号
    const sentences = cleanPara.split(/([。！？.!?\n]+)/).reduce<string[]>((acc, part, i, arr) => {
        if (i % 2 === 0) {
            const delim = arr[i + 1];
            if (part || delim) {
                acc.push(part + (delim || ''));
            }
        }
        return acc;
    }, []);

    for (const sentence of sentences) {
      // 尝试放入当前块
      const sentSep = currentChunk ? '' : ''; // 句子间通常不需要额外换行，紧跟即可（或者加个空格视情况而定，这里假设原文自带标点）
      const potentialSent = currentChunk + sentSep + sentence;
      
      if (potentialSent.length <= maxChars) {
        currentChunk = potentialSent;
      } else {
        // 句子放不下 -> 换页
        if (currentChunk) pushChunk();

        if (sentence.length <= maxChars) {
            currentChunk = sentence;
        } else {
            // 句子本身超长 -> 拆分层级 2: 按从句/逗号拆分
            const clauses = sentence.split(/([，,、;；：:\s]+)/).reduce<string[]>((acc, part, i, arr) => {
                if (i % 2 === 0) {
                    const delim = arr[i + 1];
                    if (part || delim) {
                        acc.push(part + (delim || ''));
                    }
                }
                return acc;
            }, []);

            for (const clause of clauses) {
                 if ((currentChunk + clause).length <= maxChars) {
                     currentChunk += clause;
                 } else {
                     if (currentChunk) pushChunk();
                     
                     if (clause.length <= maxChars) {
                         currentChunk = clause;
                     } else {
                         // 拆分层级 3: 暴力按字符安全拆分
                         const parts = safeSplit(clause, maxChars);
                         for (let k = 0; k < parts.length; k++) {
                             if (k < parts.length - 1) {
                                 chunks.push(parts[k]); // 填满的块直接推入
                             } else {
                                 currentChunk = parts[k]; // 剩余部分放入 buffer
                             }
                         }
                     }
                 }
            }
        }
      }
    }
  }

  // 处理剩余内容
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};
