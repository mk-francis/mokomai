"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageCircle, Bot, Plus, Archive, Star } from "lucide-react"
import type { Conversation, ConversationGroup } from "@/types"
import { cn } from "@/lib/utils"
import { ConversationItem } from "./conversation-item"

interface ConversationListProps {
  conversations: Conversation[]
  currentConversation: Conversation | null
  onSelectConversation: (conversation: Conversation) => void
  onDeleteConversation: (conversationId: string) => void
  onStartCasualChat: () => void
  onRenameConversation?: (conversationId: string, newTitle: string) => void
  onArchiveConversation?: (conversationId: string, archived: boolean) => void
  onToggleImportant?: (conversationId: string, important: boolean) => void
}

export function ConversationList({
  conversations,
  currentConversation,
  onSelectConversation,
  onDeleteConversation,
  onStartCasualChat,
  onRenameConversation,
  onArchiveConversation,
  onToggleImportant,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "assistant">("chat")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  // 按时间分组对话
  const groupConversationsByDate = (conversations: Conversation[]): ConversationGroup[] => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    const groups: { [key: string]: Conversation[] } = {
      重要: [],
      今天: [],
      昨天: [],
      更早: [],
    }

    conversations.forEach((conv) => {
      if (conv.important && !conv.archived) {
        groups["重要"].push(conv)
      } else {
        const convDate = new Date(conv.updated_at)
        if (convDate >= today) {
          groups["今天"].push(conv)
        } else if (convDate >= yesterday) {
          groups["昨天"].push(conv)
        } else {
          groups["更早"].push(conv)
        }
      }
    })

    return Object.entries(groups)
      .filter(([, convs]) => convs.length > 0)
      .map(([date, convs]) => ({
        date,
        conversations: convs.sort((a, b) => b.updated_at - a.updated_at),
      }))
  }

  // 过滤并分类对话
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesArchiveFilter = showArchived ? conv.archived : !conv.archived
    return matchesSearch && matchesArchiveFilter
  })

  const chatConversations = filteredConversations.filter((conv) => conv.category === "chat")
  const assistantConversations = filteredConversations.filter((conv) => conv.category === "assistant")

  const groupedChatConversations = groupConversationsByDate(chatConversations)
  const groupedAssistantConversations = groupConversationsByDate(assistantConversations)

  // 处理删除对话
  const handleDeleteConversation = (conversationId: string) => {
    console.log("处理删除对话:", conversationId)
    onDeleteConversation(conversationId)
  }

  // 处理归档对话
  const handleArchiveConversation = (conversationId: string, archived: boolean) => {
    console.log("处理归档对话:", conversationId, archived)
    if (onArchiveConversation) {
      onArchiveConversation(conversationId, archived)
    }
  }

  // 处理重要标记
  const handleToggleImportant = (conversationId: string, important: boolean) => {
    console.log("处理重要标记:", conversationId, important)
    if (onToggleImportant) {
      onToggleImportant(conversationId, important)
    }
  }

  // 开始编辑对话标题
  const startEditing = (conversation: Conversation) => {
    console.log("开始编辑:", conversation.id, conversation.title)
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  // 保存编辑
  const saveEdit = (conversationId: string) => {
    console.log("保存编辑:", conversationId, editingTitle)
    if (editingTitle.trim() && onRenameConversation) {
      onRenameConversation(conversationId, editingTitle.trim())
    }
    setEditingId(null)
    setEditingTitle("")
  }

  // 取消编辑
  const cancelEdit = () => {
    console.log("取消编辑")
    setEditingId(null)
    setEditingTitle("")
  }

  // 处理编辑输入框的键盘事件
  const handleEditKeyDown = (e: React.KeyboardEvent, conversationId: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      saveEdit(conversationId)
    } else if (e.key === "Escape") {
      e.preventDefault()
      cancelEdit()
    }
  }

  // 当前选中的对话类型决定默认标签页
  React.useEffect(() => {
    if (currentConversation) {
      setActiveTab(currentConversation.category)
    }
  }, [currentConversation])

  // 渲染对话项
  const renderConversationItem = (conversation: Conversation) => {
    return (
      <ConversationItem
        key={conversation.id}
        conversation={conversation}
        currentConversation={currentConversation}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={onRenameConversation}
        onArchiveConversation={onArchiveConversation}
        onToggleImportant={onToggleImportant}
      />
    )
  }

  return (
    <div className="w-80 h-full bg-slate-900/30 border-r border-slate-800 flex flex-col">
      {/* 搜索框 */}
      <div className="p-4 border-b border-slate-800 flex-shrink-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="搜索对话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-slate-300 placeholder-slate-500"
          />
        </div>

        {/* 快速开始按钮 */}
        <Button
          onClick={onStartCasualChat}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white mb-3"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          开始闲聊
        </Button>

        {/* 归档切换 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("切换归档显示:", !showArchived)
            setShowArchived(!showArchived)
          }}
          className={cn(
            "w-full border-slate-700 text-slate-400 hover:bg-slate-800",
            showArchived && "bg-slate-800 text-orange-400 border-orange-500/30",
          )}
        >
          <Archive className="w-4 h-4 mr-2" />
          {showArchived ? "显示活跃对话" : "显示归档对话"}
        </Button>
      </div>

      {/* 标签页切换 */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "chat" | "assistant")}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="border-b border-slate-800 flex-shrink-0">
          <TabsList className="w-full bg-slate-900/30 p-0 h-12">
            <TabsTrigger
              value="chat"
              className={cn(
                "flex-1 h-full rounded-none data-[state=active]:bg-slate-800/50",
                "data-[state=active]:text-blue-400 data-[state=active]:shadow-none",
                "border-b-2 data-[state=active]:border-blue-500 border-transparent",
              )}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              话题
            </TabsTrigger>
            <TabsTrigger
              value="assistant"
              className={cn(
                "flex-1 h-full rounded-none data-[state=active]:bg-slate-800/50",
                "data-[state=active]:text-blue-400 data-[state=active]:shadow-none",
                "border-b-2 data-[state=active]:border-blue-500 border-transparent",
              )}
            >
              <Bot className="w-4 h-4 mr-2" />
              助手
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 闲聊对话列表 */}
        <TabsContent value="chat" className="flex-1 m-0 p-0 data-[state=inactive]:hidden min-h-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {groupedChatConversations.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  {searchQuery ? "未找到闲聊对话" : showArchived ? "暂无归档的闲聊对话" : "暂无闲聊对话"}
                  {!showArchived && (
                    <div className="mt-4">
                      <Button variant="outline" onClick={onStartCasualChat} className="border-slate-700 text-slate-400">
                        <Plus className="w-4 h-4 mr-2" />
                        开始第一个闲聊
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                groupedChatConversations.map((group) => (
                  <div key={`chat-${group.date}`} className="mb-6">
                    {/* 日期分组标题 */}
                    <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center">
                      {group.date === "重要" && <Star className="w-3 h-3 mr-1 text-yellow-400" />}
                      {group.date}
                    </div>

                    {/* 对话列表 */}
                    <div className="space-y-1">{group.conversations.map(renderConversationItem)}</div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 助手对话列表 */}
        <TabsContent value="assistant" className="flex-1 m-0 p-0 data-[state=inactive]:hidden min-h-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {groupedAssistantConversations.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  {searchQuery ? "未找到助手对话" : showArchived ? "暂无归档的助手对话" : "暂无助手对话"}
                  {!showArchived && (
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 mb-2">从右侧选择一个助手开始对话</p>
                    </div>
                  )}
                </div>
              ) : (
                groupedAssistantConversations.map((group) => (
                  <div key={`assistant-${group.date}`} className="mb-6">
                    {/* 日期分组标题 */}
                    <div className="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center">
                      {group.date === "重要" && <Star className="w-3 h-3 mr-1 text-yellow-400" />}
                      {group.date}
                    </div>

                    {/* 对话列表 */}
                    <div className="space-y-1">{group.conversations.map(renderConversationItem)}</div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
