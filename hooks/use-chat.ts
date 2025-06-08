"use client"

import { useState, useCallback, useEffect } from "react"
import type { Message, Assistant, Conversation } from "@/types"
import { chatAPI } from "@/lib/api"

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null)

  // 加载对话列表
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = useCallback(async () => {
    try {
      const data = await chatAPI.getConversations()
      setConversations(data)
    } catch (error) {
      console.error("加载对话失败:", error)
      // 使用更多模拟数据来测试滚动和归档功能
      const mockConversations: Conversation[] = [
        {
          id: "chat-1",
          title: "日常闲聊",
          assistant_id: null,
          assistant_name: null,
          updated_at: Date.now() - 1000 * 60 * 30,
          created_at: Date.now() - 1000 * 60 * 60 * 2,
          message_count: 5,
          category: "chat",
          important: true,
        },
        {
          id: "chat-2",
          title: "周末计划讨论",
          assistant_id: null,
          assistant_name: null,
          updated_at: Date.now() - 1000 * 60 * 60,
          created_at: Date.now() - 1000 * 60 * 60 * 3,
          message_count: 8,
          category: "chat",
          archived: true,
        },
        {
          id: "gpt4-1",
          title: "React 项目优化",
          assistant_id: "gpt-4",
          assistant_name: "GPT-4",
          updated_at: Date.now() - 1000 * 60 * 60 * 3,
          created_at: Date.now() - 1000 * 60 * 60 * 4,
          message_count: 12,
          category: "assistant",
          important: true,
        },
        {
          id: "claude-1",
          title: "与Claude 3的对话",
          assistant_id: "claude-3",
          assistant_name: "Claude 3",
          updated_at: Date.now() - 1000 * 60 * 60 * 5,
          created_at: Date.now() - 1000 * 60 * 60 * 6,
          message_count: 15,
          category: "assistant",
        },
        {
          id: "code-1",
          title: "Python 爬虫开发",
          assistant_id: "code-assistant",
          assistant_name: "代码助手",
          updated_at: Date.now() - 1000 * 60 * 60 * 24,
          created_at: Date.now() - 1000 * 60 * 60 * 25,
          message_count: 8,
          category: "assistant",
          archived: true,
        },
        // 添加更多模拟数据
        ...Array.from({ length: 15 }, (_, i) => ({
          id: `claude-${i + 2}`,
          title: `与Claude 3的对话 ${i + 2}`,
          assistant_id: "claude-3",
          assistant_name: "Claude 3",
          updated_at: Date.now() - 1000 * 60 * 60 * 24 * (i + 1),
          created_at: Date.now() - 1000 * 60 * 60 * 24 * (i + 1),
          message_count: Math.floor(Math.random() * 20) + 1,
          category: "assistant" as const,
          important: i % 5 === 0,
          archived: i % 7 === 0,
        })),
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `chat-${i + 3}`,
          title: `闲聊话题 ${i + 3}`,
          assistant_id: null,
          assistant_name: null,
          updated_at: Date.now() - 1000 * 60 * 60 * 24 * (i + 1),
          created_at: Date.now() - 1000 * 60 * 60 * 24 * (i + 1),
          message_count: Math.floor(Math.random() * 15) + 1,
          category: "chat" as const,
          important: i % 4 === 0,
          archived: i % 6 === 0,
        })),
      ]
      setConversations(mockConversations)
    }
  }, [])

  // 创建新对话
  const createNewConversation = useCallback((assistant: Assistant | null = null) => {
    const isChat = assistant === null
    const conversationId = isChat ? `chat-${Date.now()}` : `${assistant.id}-${Date.now()}`

    const newConversation: Conversation = {
      id: conversationId,
      title: isChat ? "新的闲聊" : `与${assistant.name}的对话`,
      assistant_id: assistant?.id || null,
      assistant_name: assistant?.name || null,
      updated_at: Date.now(),
      created_at: Date.now(),
      message_count: 0,
      category: isChat ? "chat" : "assistant",
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversation(newConversation)
    setMessages([])
    setSelectedAssistant(assistant)

    console.log("创建新对话:", newConversation)
    return newConversation
  }, [])

  // 选择助手并创建新对话
  const selectAssistantAndCreateChat = useCallback(
    (assistant: Assistant) => {
      console.log("选择助手并创建新对话:", assistant.name)
      createNewConversation(assistant)
    },
    [createNewConversation],
  )

  // 开始闲聊
  const startCasualChat = useCallback(() => {
    console.log("开始闲聊")
    createNewConversation(null)
  }, [createNewConversation])

  // 加载指定对话
  const loadConversation = useCallback(async (conversation: Conversation) => {
    try {
      setCurrentConversation(conversation)
      const messages = await chatAPI.getMessages(conversation.id)
      setMessages(messages)

      // 设置对应的助手
      if (conversation.assistant_id) {
        setSelectedAssistant({
          id: conversation.assistant_id,
          name: conversation.assistant_name || "",
          description: "",
          icon: "general",
          enabled: true,
          customizable: true,
          status: "idle",
          category: "professional",
        })
      } else {
        setSelectedAssistant(null)
      }

      console.log("加载对话:", conversation.title)
    } catch (error) {
      console.error("加载对话失败:", error)
      // 模拟一些消息
      const mockMessages: Message[] = [
        {
          id: "1",
          role: "user",
          content: "你好！",
          timestamp: Date.now() - 1000 * 60 * 10,
        },
        {
          id: "2",
          role: "assistant",
          content: "您好！我是" + (conversation.assistant_name || "闲聊助手") + "，有什么可以帮助您的吗？",
          timestamp: Date.now() - 1000 * 60 * 9,
          assistant_id: conversation.assistant_id || undefined,
          assistant_name: conversation.assistant_name || undefined,
        },
      ]
      setMessages(mockMessages)
    }
  }, [])

  // 发送消息
  const sendMessage = useCallback(
    async (content: string, attachments?: File[]) => {
      if (!content.trim() || !currentConversation) return

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await chatAPI.sendMessage({
          message: content,
          assistant_id: selectedAssistant?.id,
          session_id: currentConversation.id,
        })

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.response,
          timestamp: response.timestamp,
          assistant_id: response.assistant_id,
          assistant_name: response.assistant_name,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // 更新对话信息
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversation.id
              ? {
                  ...conv,
                  updated_at: Date.now(),
                  message_count: conv.message_count + 2,
                  title: conv.message_count === 0 ? content.slice(0, 20) + "..." : conv.title,
                }
              : conv,
          ),
        )
      } catch (error) {
        console.error("发送消息失败:", error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "system",
          content: "发送消息失败，请重试。",
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [currentConversation, selectedAssistant],
  )

  // 删除对话
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        console.log("删除对话:", conversationId)

        // 先从 API 删除（如果有的话）
        // await chatAPI.deleteConversation(conversationId)

        // 从本地状态中删除
        setConversations((prev) => {
          const newConversations = prev.filter((conv) => conv.id !== conversationId)
          console.log("删除后的对话列表:", newConversations.length)
          return newConversations
        })

        // 如果删除的是当前对话，清空聊天区域
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null)
          setMessages([])
          setSelectedAssistant(null)
          console.log("清空当前对话")
        }
      } catch (error) {
        console.error("删除对话失败:", error)
      }
    },
    [currentConversation],
  )

  // 重命名对话
  const renameConversation = useCallback(
    async (conversationId: string, newTitle: string) => {
      try {
        console.log("重命名对话:", conversationId, "新标题:", newTitle)

        // 更新本地状态
        setConversations((prev) => {
          const newConversations = prev.map((conv) =>
            conv.id === conversationId ? { ...conv, title: newTitle } : conv,
          )
          console.log(
            "重命名后的对话:",
            newConversations.find((c) => c.id === conversationId),
          )
          return newConversations
        })

        // 如果是当前对话，也更新当前对话状态
        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) => (prev ? { ...prev, title: newTitle } : null))
        }
      } catch (error) {
        console.error("重命名对话失败:", error)
      }
    },
    [currentConversation],
  )

  // 归档对话
  const archiveConversation = useCallback(
    async (conversationId: string, archived: boolean) => {
      try {
        console.log("归档对话:", conversationId, "归档状态:", archived)

        // 更新本地状态
        setConversations((prev) => {
          const newConversations = prev.map((conv) => (conv.id === conversationId ? { ...conv, archived } : conv))
          console.log(
            "归档后的对话:",
            newConversations.find((c) => c.id === conversationId),
          )
          return newConversations
        })

        // 如果是当前对话，也更新当前对话状态
        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) => (prev ? { ...prev, archived } : null))
        }
      } catch (error) {
        console.error("归档对话失败:", error)
      }
    },
    [currentConversation],
  )

  // 切换重要标记
  const toggleImportant = useCallback(
    async (conversationId: string, important: boolean) => {
      try {
        console.log("切换重要标记:", conversationId, "重要状态:", important)

        // 更新本地状态
        setConversations((prev) => {
          const newConversations = prev.map((conv) => (conv.id === conversationId ? { ...conv, important } : conv))
          console.log(
            "重要标记后的对话:",
            newConversations.find((c) => c.id === conversationId),
          )
          return newConversations
        })

        // 如果是当前对话，也更新当前对话状态
        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) => (prev ? { ...prev, important } : null))
        }
      } catch (error) {
        console.error("切换重要标记失败:", error)
      }
    },
    [currentConversation],
  )

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    selectedAssistant,
    selectAssistantAndCreateChat,
    startCasualChat,
    loadConversation,
    sendMessage,
    deleteConversation,
    renameConversation,
    archiveConversation,
    toggleImportant,
  }
}
