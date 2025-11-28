import { AppData, StyleConfig } from './types';

export const THEMES: Record<string, StyleConfig> = {
  'shockwave': {
    id: 'shockwave',
    name: '⚡ 冲击波',
    backgroundColor: '#eff6ff', 
    textColor: '#000000',
    accentColor: '#d9f99d', 
    fontFamilyHead: 'Inter',
    fontFamilyBody: 'Inter',
    titleFontSize: 56,
  },
  'diffused': {
    id: 'diffused',
    name: '🌈 弥散光',
    backgroundColor: '#faf5ff',
    textColor: '#4c1d95',
    accentColor: '#c084fc',
    fontFamilyHead: 'Playfair Display',
    fontFamilyBody: 'Inter',
    titleFontSize: 56,
  },
  'sticker': {
    id: 'sticker',
    name: '🍭 贴纸风',
    backgroundColor: '#fff1f2',
    textColor: '#be123c',
    accentColor: '#f43f5e',
    fontFamilyHead: 'Inter',
    fontFamilyBody: 'Inter',
    titleFontSize: 52,
  },
  'handdrawn': {
    id: 'handdrawn',
    name: '✏️ 手账感',
    backgroundColor: '#fef3c7',
    textColor: '#78350f',
    accentColor: '#fbbf24',
    fontFamilyHead: 'Playfair Display',
    fontFamilyBody: 'Inter',
    titleFontSize: 48,
  },
  'cinematic': {
    id: 'cinematic',
    name: '🎬 电影感',
    backgroundColor: '#18181b',
    textColor: '#f4f4f5',
    accentColor: '#71717a',
    fontFamilyHead: 'Inter',
    fontFamilyBody: 'Inter',
    titleFontSize: 56,
  },
  'tech': {
    id: 'tech',
    name: '🔵 科技蓝',
    backgroundColor: '#172554',
    textColor: '#dbeafe',
    accentColor: '#3b82f6',
    fontFamilyHead: 'JetBrains Mono',
    fontFamilyBody: 'Inter',
    titleFontSize: 48,
  },
  'minimal': {
    id: 'minimal',
    name: '⚪ 极简白',
    backgroundColor: '#ffffff',
    textColor: '#171717',
    accentColor: '#e5e5e5',
    fontFamilyHead: 'Inter',
    fontFamilyBody: 'Inter',
    titleFontSize: 56,
  },
  'memo': {
    id: 'memo',
    name: '🟡 备忘录',
    backgroundColor: '#fef9c3',
    textColor: '#422006',
    accentColor: '#eab308',
    fontFamilyHead: 'Inter',
    fontFamilyBody: 'Inter',
    titleFontSize: 48,
  },
  'geek': {
    id: 'geek',
    name: '🟢 极客黑',
    backgroundColor: '#09090b',
    textColor: '#4ade80',
    accentColor: '#22c55e',
    fontFamilyHead: 'JetBrains Mono',
    fontFamilyBody: 'JetBrains Mono',
    titleFontSize: 48,
  },
};

const INITIAL_THEME = THEMES['shockwave'];

export const DEFAULT_DATA: AppData = {
  meta: {
    author: "阿星AI工作室",
    handle: "RedNote Pro",
    date: "VOL.01 | 2025",
    topic: "超级全！快收藏！",
  },
  themeId: 'shockwave',
  styleConfig: { ...INITIAL_THEME },
  slides: [
    {
      id: 'slide-1',
      title: "李笑来\n最重要的任务永远只有一个",
      body: "第82天 | 李笑来：最重要的任务永远只有一个《把时间当作朋友》\n\n判断一件事情是否真的重要，标准只有一个：是否对目标的实现有益。",
    },
    {
      id: 'slide-2',
      title: "为什么这很重要？",
      body: "当你专注于本质时，你就消除了不必要的东西。这不仅关乎效率，更关乎心智的清晰。\n\n“设计就是可视化的智慧。”",
      highlight: "少即是多。",
    }
  ]
};