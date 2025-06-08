"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Zap, Brain, Code, Palette, FileText, RefreshCw, MessageCircle } from "lucide-react"
import type { Assistant } from "@/types"
import { useAssistants } from "@/hooks/use-assistants"
import { cn } from "@/lib/utils"

interface AssistantPanelProps {
  selectedAssistant: Assistant | null
  onSelectAssistant: (assistant: Assistant) => void
  onStartCasualChat: () => void
}

const assistantIcons = {
  general: Bot,
  creative: Palette,
  technical: Code,
  analytical: Brain,
  productivity: FileText,
  default: Zap,
}

export function AssistantPanel({ selectedAssistant, onSelectAssistant, onStartCasualChat }: AssistantPanelProps) {
  const { assistants, isLoading } = useAssistants()
  const [refreshing, setRefreshing] = useState(false)

  const getIcon = (iconName: string) => {
    return assistantIcons[iconName as keyof typeof assistantIcons] || assistantIcons.default
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleSelectAssistant = (assistant: Assistant) => {
    console.log("选择助手并创建新对话:", assistant.name)
    onSelectAssistant(assistant)
  }

  const handleCasualChat = () => {
    console.log("开始闲聊")
    onStartCasualChat()
  }

  // 按类别分组助手
  const professionalAssistants = assistants.filter((a) => a.category === "professional")

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">AI 助手</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-slate-400 hover:text-slate-300"
            title="刷新助手列表"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </Button>
        </div>

        {/* 当前选中的助手 */}
        {selectedAssistant ? (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                {(() => {
                  const IconComponent = getIcon(selectedAssistant.icon)
                  return <IconComponent className="w-4 h-4 text-blue-400" />
                })()}
              </div>
              <div>
                <p className="text-sm font-medium text-blue-300">{selectedAssistant.name}</p>
                <p className="text-xs text-slate-400">当前对话助手</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-300">闲聊模式</p>
                <p className="text-xs text-slate-400">自由对话</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 助手列表 */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="text-center text-slate-500 py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            加载助手中...
          </div>
        ) : (
          <div className="space-y-6">
            {/* 闲聊选项 */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3">💬 话题聊天</h4>
              <Button
                variant="ghost"
                onClick={handleCasualChat}
                className={cn(
                  "w-full h-auto p-4 flex items-center space-x-3 text-left",
                  "border border-slate-700 hover:border-green-500/50 transition-all duration-200",
                  !selectedAssistant
                    ? "bg-green-500/10 border-green-500/50 shadow-lg shadow-green-500/10"
                    : "hover:bg-slate-800/50",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    !selectedAssistant ? "bg-green-500/20" : "bg-slate-700/50",
                  )}
                >
                  <MessageCircle className={cn("w-5 h-5", !selectedAssistant ? "text-green-400" : "text-slate-400")} />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", !selectedAssistant ? "text-green-300" : "text-slate-300")}>
                    开始闲聊
                  </p>
                  <p className="text-xs text-slate-500">自由话题，随意交流</p>
                </div>
              </Button>
            </div>

            {/* 专业助手 */}
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3">🤖 专业助手</h4>
              <div className="space-y-3">
                {professionalAssistants.map((assistant) => {
                  const IconComponent = getIcon(assistant.icon)
                  const isSelected = selectedAssistant?.id === assistant.id

                  return (
                    <Button
                      key={assistant.id}
                      variant="ghost"
                      onClick={() => handleSelectAssistant(assistant)}
                      className={cn(
                        "w-full h-auto p-4 flex flex-col items-start space-y-3 text-left",
                        "border border-slate-700 hover:border-blue-500/50 transition-all duration-200",
                        isSelected
                          ? "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10"
                          : "hover:bg-slate-800/50",
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              isSelected ? "bg-blue-500/20" : "bg-slate-700/50",
                            )}
                          >
                            <IconComponent className={cn("w-5 h-5", isSelected ? "text-blue-400" : "text-slate-400")} />
                          </div>
                          <div>
                            <p className={cn("text-sm font-medium", isSelected ? "text-blue-300" : "text-slate-300")}>
                              {assistant.name}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant={assistant.status === "working" ? "default" : "secondary"}
                          className={cn(
                            "text-xs px-2 py-1",
                            assistant.status === "working"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-slate-600/20 text-slate-400 border-slate-600/30",
                          )}
                        >
                          {assistant.status === "working" ? "工作中" : "空闲"}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 w-full text-left">{assistant.description}</p>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
