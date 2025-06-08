"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  Search,
  MoreHorizontal,
  Plus,
  Trash2,
  Archive,
  Edit,
  Download,
  FolderArchive,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: number
  messageCount: number
  archived?: boolean
}

interface SidebarProps {
  isOpen: boolean
  currentSessionId: string
  conversations: Conversation[]
  onSelectSession: (sessionId: string) => void
  onNewChat: () => void
  onDeleteConversation: (conversationId: string) => void
  onRenameConversation: (conversationId: string, newTitle: string) => void
  onArchiveConversation: (conversationId: string) => void
  onClose: () => void
}

export function Sidebar({
  isOpen,
  currentSessionId,
  conversations,
  onSelectSession,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onArchiveConversation,
  onClose,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditingId, setIsEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  const editInputRef = useRef<HTMLInputElement>(null)

  // 分离活跃对话和归档对话
  const activeConversations = conversations.filter((conv) => !conv.archived)
  const archivedConversations = conversations.filter((conv) => conv.archived)

  // 过滤对话
  const filteredActiveConversations = activeConversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredArchivedConversations = archivedConversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    if (isEditingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditingId])

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    return "刚刚"
  }

  const handleRenameStart = (id: string, title: string) => {
    setIsEditingId(id)
    setEditTitle(title)
  }

  const handleRenameSave = (id: string) => {
    if (editTitle.trim() && editTitle.trim() !== conversations.find((c) => c.id === id)?.title) {
      onRenameConversation(id, editTitle.trim())
    }
    setIsEditingId(null)
    setEditTitle("")
  }

  const handleRenameCancel = () => {
    setIsEditingId(null)
    setEditTitle("")
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleRenameSave(id)
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleRenameCancel()
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm("确定要删除这个对话吗？")) {
      onDeleteConversation(id)
    }
  }

  const handleArchiveClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    onArchiveConversation(id)
  }

  const handleExportClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    // 实现导出功能
    const conversation = conversations.find((c) => c.id === id)
    if (conversation) {
      const exportData = {
        title: conversation.title,
        timestamp: conversation.timestamp,
        messageCount: conversation.messageCount,
        // 这里可以添加实际的消息内容
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${conversation.title}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const renderConversationItem = (conversation: Conversation) => (
    <div
      key={conversation.id}
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors relative",
        currentSessionId === conversation.id ? "bg-blue-500/20 border border-blue-500/30" : "hover:bg-slate-800/50",
      )}
    >
      <div className="flex-shrink-0 mt-1">
        <MessageSquare className="h-4 w-4 text-slate-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          {isEditingId === conversation.id ? (
            <Input
              ref={editInputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => handleRenameSave(conversation.id)}
              onKeyDown={(e) => handleKeyDown(e, conversation.id)}
              className="h-6 py-0 px-1 text-sm bg-slate-700 border-slate-600 text-white"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3
              className="text-sm font-medium text-white truncate cursor-pointer"
              onClick={() => onSelectSession(conversation.id)}
            >
              {conversation.title}
            </h3>
          )}
          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{formatTime(conversation.timestamp)}</span>
        </div>

        <p
          className="text-xs text-slate-400 truncate mt-1 cursor-pointer"
          onClick={() => onSelectSession(conversation.id)}
        >
          {conversation.lastMessage || "暂无消息"}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500">{conversation.messageCount} 条消息</span>

          {/* 确保操作按钮在hover时显示 */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
                <DropdownMenuItem
                  className="hover:bg-slate-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRenameStart(conversation.id, conversation.title)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  重命名
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="hover:bg-slate-700 cursor-pointer"
                  onClick={(e) => handleExportClick(e, conversation.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  导出对话
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-700" />

                <DropdownMenuItem
                  className="hover:bg-slate-700 cursor-pointer"
                  onClick={(e) => handleArchiveClick(e, conversation.id)}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {conversation.archived ? "取消归档" : "归档对话"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-400 hover:bg-red-900/30 hover:text-red-300 cursor-pointer"
                  onClick={(e) => handleDeleteClick(e, conversation.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除对话
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* 添加hover指示器用于测试 */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  )

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* 侧边栏 */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 transform transition-transform duration-200 ease-in-out flex flex-col h-full",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* 新建对话按钮 */}
        <div className="p-4">
          <Button
            onClick={onNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新建对话
          </Button>
        </div>

        {/* 搜索栏 */}
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索对话..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 对话列表 */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* 活跃对话 */}
            {filteredActiveConversations.length > 0 ? (
              <div className="space-y-1">{filteredActiveConversations.map(renderConversationItem)}</div>
            ) : searchQuery ? (
              <div className="text-center py-8 text-slate-400">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>没有找到匹配的对话</p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无对话记录</p>
                <p className="text-sm mt-2">点击"新建对话"开始</p>
              </div>
            )}

            {/* 归档对话 */}
            {filteredArchivedConversations.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="flex items-center w-full p-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showArchived ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                  <FolderArchive className="h-4 w-4 mr-2" />
                  已归档对话 ({filteredArchivedConversations.length})
                </button>

                {showArchived && (
                  <div className="mt-2 space-y-1 pl-4 border-l border-slate-800">
                    {filteredArchivedConversations.map(renderConversationItem)}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
