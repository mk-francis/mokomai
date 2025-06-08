"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Trash2,
  Edit2,
  MessageCircle,
  Bot,
  Check,
  X,
  MoreHorizontal,
  Archive,
  Star,
  StarOff,
  ArchiveRestore,
} from "lucide-react"
import type { Conversation } from "@/types"
import { cn } from "@/lib/utils"

interface ConversationItemProps {
  conversation: Conversation
  currentConversation: Conversation | null
  onSelectConversation: (conversation: Conversation) => void
  onDeleteConversation: (conversationId: string) => void
  onRenameConversation?: (conversationId: string, newTitle: string) => void
  onArchiveConversation?: (conversationId: string, archived: boolean) => void
  onToggleImportant?: (conversationId: string, important: boolean) => void
}

export function ConversationItem({
  conversation,
  currentConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onArchiveConversation,
  onToggleImportant,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTitle, setEditingTitle] = useState(conversation.title)
  const [showMenu, setShowMenu] = useState(false)

  const isChat = conversation.category === "chat"
  const isSelected = currentConversation?.id === conversation.id

  // 开始编辑
  const startEditing = () => {
    console.log("开始编辑:", conversation.id)
    setIsEditing(true)
    setEditingTitle(conversation.title)
    setShowMenu(false)
  }

  // 保存编辑
  const saveEdit = () => {
    console.log("保存编辑:", conversation.id, editingTitle)
    if (editingTitle.trim() && onRenameConversation) {
      onRenameConversation(conversation.id, editingTitle.trim())
    }
    setIsEditing(false)
  }

  // 取消编辑
  const cancelEdit = () => {
    console.log("取消编辑")
    setIsEditing(false)
    setEditingTitle(conversation.title)
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      saveEdit()
    } else if (e.key === "Escape") {
      e.preventDefault()
      cancelEdit()
    }
  }

  // 处理删除
  const handleDelete = () => {
    console.log("删除对话:", conversation.id)
    onDeleteConversation(conversation.id)
    setShowMenu(false)
  }

  // 处理归档
  const handleArchive = () => {
    console.log("归档对话:", conversation.id, !conversation.archived)
    if (onArchiveConversation) {
      onArchiveConversation(conversation.id, !conversation.archived)
    }
    setShowMenu(false)
  }

  // 处理重要标记
  const handleImportant = () => {
    console.log("重要标记:", conversation.id, !conversation.important)
    if (onToggleImportant) {
      onToggleImportant(conversation.id, !conversation.important)
    }
    setShowMenu(false)
  }

  return (
    <div
      onClick={() => !isEditing && !showMenu && onSelectConversation(conversation)}
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors relative",
        "hover:bg-slate-800/50",
        isSelected
          ? isChat
            ? "bg-slate-800 border border-green-500/30"
            : "bg-slate-800 border border-blue-500/30"
          : "",
        isEditing && "bg-slate-800/70",
        conversation.archived && "opacity-60",
      )}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* 对话图标 */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative",
            isChat ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400",
          )}
        >
          {isChat ? <MessageCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          {conversation.important && (
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 absolute -top-1 -right-1" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            // 编辑模式
            <div className="flex items-center space-x-2">
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm bg-slate-700 border-slate-600 text-slate-200"
                autoFocus
                onFocus={(e) => e.target.select()}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  saveEdit()
                }}
                className="w-6 h-6 p-0 text-green-400 hover:text-green-300"
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  cancelEdit()
                }}
                className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            // 显示模式
            <div>
              <div className="flex items-center space-x-2">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    conversation.archived ? "text-slate-500" : "text-slate-300",
                  )}
                >
                  {conversation.title}
                </p>
                {conversation.assistant_name && (
                  <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                    {conversation.assistant_name}
                  </span>
                )}
                {conversation.archived && (
                  <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">已归档</span>
                )}
              </div>
              <p className="text-xs text-slate-500">{conversation.message_count} 条消息</p>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      {!isEditing && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-slate-400 hover:text-slate-300"
              onClick={(e) => {
                e.stopPropagation()
                console.log("点击菜单按钮")
                setShowMenu(!showMenu)
              }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>

            {/* 自定义下拉菜单 */}
            {showMenu && (
              <>
                {/* 背景遮罩 */}
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />

                {/* 菜单内容 */}
                <div className="absolute right-0 top-8 z-50 min-w-[160px] bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditing()
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    重命名
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleImportant()
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center"
                  >
                    {conversation.important ? (
                      <>
                        <StarOff className="w-4 h-4 mr-2" />
                        取消重要
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        标为重要
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleArchive()
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center"
                  >
                    {conversation.archived ? (
                      <>
                        <ArchiveRestore className="w-4 h-4 mr-2" />
                        取消归档
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4 mr-2" />
                        归档
                      </>
                    )}
                  </button>

                  <div className="h-px bg-slate-700 my-1" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
