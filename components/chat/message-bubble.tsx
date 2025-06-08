"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import type { Message } from "@/types"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-slate-800/50 text-slate-400 text-sm px-4 py-2 rounded-full border border-slate-700">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex gap-3 mb-6", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-blue-500 text-white">U</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">AI</AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={cn("flex flex-col max-w-[70%]", isUser ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2 mb-1">
          {!isUser && message.assistant_name && (
            <span className="text-sm font-medium text-blue-400">{message.assistant_name}</span>
          )}
          <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
        </div>

        <div
          className={cn(
            "relative group rounded-2xl px-4 py-3 max-w-full",
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-slate-800/50 text-slate-200 border border-slate-700",
          )}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-600 rounded flex items-center justify-center">
                      <span className="text-xs text-slate-300">
                        {attachment.type.split("/")[1]?.toUpperCase() || "FILE"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">{attachment.name}</p>
                      <p className="text-xs text-slate-500">{(attachment.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div
            className={cn(
              "absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity",
              isUser ? "left-2" : "right-2",
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="w-6 h-6 p-0 text-slate-400 hover:text-slate-300 bg-slate-800/80"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
