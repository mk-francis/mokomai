"use client"

import { useState, useEffect } from "react"
import type { Assistant } from "@/types"
import { assistantAPI } from "@/lib/api"

// 中文化的模拟助手数据，按类别分组
const mockAssistants: Assistant[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "用于复杂推理和创意任务的高级语言模型",
    icon: "general",
    enabled: true,
    customizable: true,
    status: "idle",
    category: "professional",
  },
  {
    id: "claude-3",
    name: "Claude 3",
    description: "Anthropic 的 AI 助手，专注于有用、无害和诚实的回应",
    icon: "analytical",
    enabled: true,
    customizable: true,
    status: "idle",
    category: "professional",
  },
  {
    id: "code-assistant",
    name: "代码助手",
    description: "专门用于编程、调试和技术文档的助手",
    icon: "technical",
    enabled: true,
    customizable: false,
    status: "working",
    category: "professional",
  },
  {
    id: "creative-writer",
    name: "创意写手",
    description: "擅长创意写作、故事创作和内容创建的专家",
    icon: "creative",
    enabled: true,
    customizable: true,
    status: "idle",
    category: "professional",
  },
  {
    id: "productivity-helper",
    name: "效率助手",
    description: "协助任务管理、规划和工作流程优化",
    icon: "productivity",
    enabled: true,
    customizable: true,
    status: "idle",
    category: "professional",
  },
]

export function useAssistants() {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAssistants = async () => {
      try {
        const data = await assistantAPI.getAssistants()
        setAssistants(data)
      } catch (error) {
        console.warn("从 API 加载助手失败，使用模拟数据:", error)
        setAssistants(mockAssistants)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssistants()
  }, [])

  return { assistants, isLoading }
}
