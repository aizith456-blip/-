export type ThemeType = 'shockwave' | 'diffused' | 'sticker' | 'handdrawn' | 'cinematic' | 'tech' | 'minimal' | 'memo' | 'geek';

export interface StyleConfig {
  id: ThemeType;
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamilyHead: string;
  fontFamilyBody: string;
  titleFontSize: number;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export interface SlideContent {
  id: string;
  title?: string;
  body: string;
  highlight?: string; // 用于引用或强调
}

export interface AppData {
  meta: {
    author: string;
    handle: string; // 账号名称
    date: string;
    topic: string; // 标签
  };
  themeId: ThemeType;
  styleConfig: StyleConfig; // 当前激活的样式配置（支持微调）
  slides: SlideContent[];
}