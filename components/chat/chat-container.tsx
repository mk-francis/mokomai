"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "./message-bubble"
import { MessageInput } from "./message-input"
import type { Conversation, Message } from "@/types"

interface ChatContainerProps {
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string, attachments?: File[]) => void
}

export function ChatContainer({ currentConversation, messages, isLoading, onSendMessage }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {!currentConversation ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-300 mb-2">欢迎使用 MOKOM AI</h2>
              <p className="text-slate-500 max-w-md">
                从右侧面板选择一个 AI 助手开始专业对话，或者点击"开始闲聊"进行自由交流。
              </p>
            </div>
          ) : (
            <>
              {/* 对话标题 */}
              <div className="text-center mb-6 pb-4 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-slate-300">{currentConversation.title}</h3>
                {currentConversation.assistant_name && (
                  <p className="text-sm text-slate-500 mt-1">与 {currentConversation.assistant_name} 的对话</p>
                )}
              </div>

              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-slate-400 mb-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-sm">{currentConversation.assistant_name || "AI"} 正在思考中...</span>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} disabled={!currentConversation} />
    </div>
  )
}
