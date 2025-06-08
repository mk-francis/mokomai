import type { Assistant } from "@/components/chat/assistant-panel"

export const DEFAULT_ASSISTANTS: Assistant[] = [
  {
    id: "general",
    name: "MOKOM 通用助手",
    description: "我是MOKOM AI的通用助手，可以帮助您解答各种问题、进行对话交流、翻译文本等。",
    icon: "bot",
    enabled: true,
    customizable: false,
    status: "idle",
    capabilities: ["对话交流", "问答解答", "文本翻译", "内容写作", "知识查询"],
  },
  {
    id: "code-assistant",
    name: "代码编程助手",
    description: "专业的编程助手，精通多种编程语言，可以帮助您解决代码问题、进行代码审查、提供技术建议。",
    icon: "code",
    enabled: true,
    customizable: true,
    status: "idle",
    capabilities: ["代码编写", "Bug调试", "代码审查", "技术咨询", "架构设计", "性能优化"],
  },
  {
    id: "creative-writer",
    name: "创意写作助手",
    description: "富有创意的写作助手，擅长各种文体创作，可以帮助您进行创意写作、内容策划、文案创作。",
    icon: "palette",
    enabled: true,
    customizable: true,
    status: "idle",
    capabilities: ["创意写作", "文案策划", "故事创作", "诗歌创作", "营销文案", "内容优化"],
  },
  {
    id: "data-analyst",
    name: "数据分析助手",
    description: "专业的数据分析助手，可以帮助您处理数据、生成报告、进行统计分析和数据可视化。",
    icon: "calculator",
    enabled: true,
    customizable: true,
    status: "idle",
    capabilities: ["数据分析", "报告生成", "统计计算", "图表制作", "趋势分析", "数据清洗"],
  },
  {
    id: "language-tutor",
    name: "语言学习助手",
    description: "多语言学习助手，可以帮助您学习各种语言、练习对话、纠正语法、提供学习建议。",
    icon: "globe",
    enabled: true,
    customizable: true,
    status: "idle",
    capabilities: ["语言教学", "语法纠错", "口语练习", "词汇扩展", "文化介绍", "学习规划"],
  },
  {
    id: "research-assistant",
    name: "研究分析助手",
    description: "学术研究助手，可以帮助您进行文献调研、数据收集、论文写作、学术分析等研究工作。",
    icon: "filetext",
    enabled: true,
    customizable: true,
    status: "idle",
    capabilities: ["文献调研", "数据收集", "论文写作", "学术分析", "引用格式", "研究方法"],
  },
]

// 助手图标映射
export const ASSISTANT_ICONS = {
  bot: "机器人",
  code: "代码",
  palette: "创意",
  calculator: "计算",
  globe: "语言",
  filetext: "文档",
  zap: "效率",
  settings: "工具",
} as const

// 助手状态映射
export const ASSISTANT_STATUS = {
  idle: { text: "空闲", color: "bg-green-500" },
  working: { text: "工作中", color: "bg-yellow-500" },
  offline: { text: "离线", color: "bg-gray-500" },
} as const
