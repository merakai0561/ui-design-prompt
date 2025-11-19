import { PromptData, UIConstants, LocalizedText } from './types';

export const UI_TEXT: UIConstants = {
  headerTitle: { zh: "Global UI Prompt Master", en: "Global UI Prompt Master" },
  copyButton: { zh: "复制提示词", en: "Copy Prompt" },
  clearButton: { zh: "清空", en: "Clear" },
  refineButton: { zh: "✨ AI 润色优化", en: "✨ AI Refine" },
  refining: { zh: "优化中...", en: "Refining..." },
  placeholder: { zh: "选择下方标签生成提示词，或在此处直接编辑...", en: "Select tags below to generate prompt, or edit here..." },
  copied: { zh: "已复制!", en: "Copied!" },
  clearConfirm: { zh: "确定要清空所有内容吗？", en: "Are you sure you want to clear everything?" },
  settingsTitle: { zh: "设置", en: "Settings" },
  modelLabel: { zh: "AI 模型选择", en: "AI Model" },
  modelFlash: { zh: "标准 (Gemini 2.5 Flash) - 快速", en: "Standard (Gemini 2.5 Flash) - Fast" },
  modelPro: { zh: "专业 (Gemini 3 Pro) - 高质量", en: "Pro (Gemini 3 Pro) - High Quality" },
  apiKeyLabel: { zh: "API Key 状态", en: "API Key Status" },
  apiKeyConnected: { zh: "已连接 (环境变量)", en: "Connected (Env Variable)" },
  apiKeyMissing: { zh: "未检测到环境变量 (使用自定义 Key)", en: "Env Variable Missing (Using Custom Key)" },
  apiKeyInputLabel: { zh: "输入 Gemini API Key", en: "Enter Gemini API Key" },
  apiKeyInputPlaceholder: { zh: "粘贴你的 API Key (AIza...)", en: "Paste your API Key here (AIza...)" },
  close: { zh: "关闭", en: "Close" },
  customPlaceholder: { zh: "自定义输入...", en: "Custom input..." },
  customButton: { zh: "自定义", en: "Custom" }
};

export const PROMPT_CATEGORIES: PromptData = {
  platform: {
    title: { zh: "📱 1. 平台与场景", en: "📱 1. Platform & Context" },
    options: [
      { label: { zh: "iOS 应用", en: "iOS App" }, value: "iOS Mobile App UI, Human Interface Guidelines" },
      { label: { zh: "SaaS 后台", en: "SaaS Dashboard" }, value: "SaaS Dashboard Interface, B2B Web App" },
      { label: { zh: "落地页/官网", en: "Landing Page" }, value: "High conversion Landing Page, Hero Section" },
      { label: { zh: "移动端网页", en: "Mobile Web" }, value: "Responsive Mobile Website Layout" },
      { label: { zh: "智能手表", en: "Smartwatch" }, value: "Smartwatch Interface, WearOS UI" }
    ]
  },
  subject: {
    title: { zh: "🖼️ 2. 页面类型", en: "🖼️ 2. Page Type" },
    options: [
      { label: { zh: "登录/注册", en: "Login/Signup" }, value: "Login Screen, Sign Up Flow, Authentication" },
      { label: { zh: "个人中心", en: "User Profile" }, value: "User Profile, Settings Page" },
      { label: { zh: "数据图表", en: "Charts" }, value: "Data Visualization, Analytics Charts" },
      { label: { zh: "电商详情", en: "E-commerce" }, value: "Product Detail Page, Shopping Cart" }
    ]
  },
  style: {
    title: { zh: "🎨 3. 设计风格", en: "🎨 3. Visual Style" },
    groups: [
      { 
        name: { zh: "现代标准", en: "Modern Standard" }, 
        items: [
          { label: { zh: "极简主义", en: "Minimalist" }, value: "Minimalist UI, Clean interface, Excessive whitespace" },
          { label: { zh: "扁平化 2.0", en: "Flat 2.0" }, value: "Flat Design 2.0, Vector style, Solid colors" }
        ]
      },
      { 
        name: { zh: "质感光影", en: "Texture & Depth" }, 
        items: [
          { label: { zh: "毛玻璃", en: "Glassmorphism" }, value: "Glassmorphism, Frosted glass effect, Translucent blur" },
          { label: { zh: "3D黏土风", en: "Claymorphism" }, value: "Claymorphism, 3D soft shapes, Cute 3D render" },
          { label: { zh: "全息幻彩", en: "Holographic" }, value: "Holographic UI, Iridescent, Aurora gradients" }
        ]
      },
      { 
        name: { zh: "个性趋势", en: "Bold Trends" }, 
        items: [
          { label: { zh: "Bento网格", en: "Bento Grid" }, value: "Bento Grid layout, Modular blocks, Apple style" },
          { label: { zh: "新野兽派", en: "Neo-Brutalism" }, value: "Neo-Brutalism, High contrast, Black outlines" }
        ]
      }
    ]
  },
  typography: {
    title: { zh: "🔤 4. 字体排版", en: "🔤 4. Typography" },
    options: [
      { label: { zh: "现代无衬线", en: "Modern Sans" }, value: "Inter Font, Clean Sans-Serif Typography" },
      { label: { zh: "优雅衬线体", en: "Elegant Serif" }, value: "Editorial Serif Font, Elegant Typography" },
      { label: { zh: "科技代码风", en: "Tech Mono" }, value: "Monospaced Font, Coding style typography" },
      { label: { zh: "粗体大标题", en: "Big & Bold" }, value: "Big Bold Typography, Heavy weight font" }
    ]
  },
  color: {
    title: { zh: "🌈 5. 配色主题", en: "🌈 5. Color Palette" },
    options: [
      { label: { zh: "蓝白科技", en: "Blue & White" }, value: "Professional Blue and White, Medical/Tech Theme" },
      { label: { zh: "暗黑模式", en: "Dark Mode" }, value: "Dark Mode, Deep Grey background, Neon accents" },
      { label: { zh: "柔和粉彩", en: "Pastel" }, value: "Pastel color palette, Soft, Friendly" },
      { label: { zh: "黑金奢华", en: "Black & Gold" }, value: "Black and Gold, Luxury palette" }
    ]
  },
  quality: {
    title: { zh: "✨ 6. 画质与渲染", en: "✨ 6. Quality" },
    options: [
      { label: { zh: "Dribbble热门", en: "Dribbble Trending" }, value: "Trending on Dribbble, High fidelity mockup" },
      { label: { zh: "8K超清", en: "8K Resolution" }, value: "8k resolution, Unreal Engine 5 Render, Sharp focus" }
    ]
  }
};