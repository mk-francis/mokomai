"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, ImageIcon, Mic, Camera, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void
  isLoading: boolean
  disabled?: boolean
}

export function MessageInput({ onSendMessage, isLoading, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleSend = useCallback(() => {
    if (!message.trim() && attachments.length === 0) return
    if (disabled) return

    console.log("发送消息:", message, "附件数量:", attachments.length)
    onSendMessage(message, attachments)
    setMessage("")
    setAttachments([])
  }, [message, attachments, onSendMessage, disabled])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    console.log(
      "选择文件:",
      files.map((f) => f.name),
    )
    setAttachments((prev) => [...prev, ...files])
    e.target.value = ""
  }

  const removeAttachment = (index: number) => {
    console.log("移除附件，索引:", index)
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    const files = Array.from(e.dataTransfer.files)
    console.log(
      "拖拽文件:",
      files.map((f) => f.name),
    )
    setAttachments((prev) => [...prev, ...files])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const toggleRecording = () => {
    if (disabled) return
    console.log("语音录制切换:", !isRecording)
    setIsRecording(!isRecording)
  }

  const handleFileUpload = () => {
    if (disabled) return
    console.log("文件上传按钮被点击")
    fileInputRef.current?.click()
  }

  const handleImageUpload = () => {
    if (disabled) return
    console.log("图片上传按钮被点击")
    imageInputRef.current?.click()
  }

  const handleCamera = () => {
    if (disabled) return
    console.log("摄像头按钮被点击")
  }

  return (
    <div className="border-t border-slate-800 bg-slate-900/30 p-4">
      {/* 附件预览 */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700"
            >
              <span className="text-sm text-slate-300 truncate max-w-32">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(index)}
                className="w-4 h-4 p-0 text-slate-400 hover:text-red-400"
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="relative" onDrop={handleDrop} onDragOver={handleDragOver}>
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={disabled ? "请先选择一个助手或开始闲聊..." : "输入您的消息... (Ctrl+Enter 发送)"}
          className={cn(
            "min-h-[60px] max-h-32 resize-none pr-32",
            "bg-slate-800/50 border-slate-700 text-slate-300 placeholder-slate-500",
            "focus:border-blue-500/50 focus:ring-blue-500/20",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={isLoading || disabled}
        />

        {/* 输入控制按钮 */}
        <div className="absolute right-2 bottom-2 flex items-center space-x-1">
          <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFileUpload}
            className="w-8 h-8 p-0 text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
            disabled={isLoading || disabled}
            title="上传文件"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            className="w-8 h-8 p-0 text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
            disabled={isLoading || disabled}
            title="上传图片"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            className={cn(
              "w-8 h-8 p-0 hover:bg-slate-700 transition-colors",
              isRecording ? "text-red-400 hover:text-red-300" : "text-slate-400 hover:text-slate-300",
            )}
            disabled={isLoading || disabled}
            title={isRecording ? "停止录音" : "开始录音"}
          >
            <Mic className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCamera}
            className="w-8 h-8 p-0 text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
            disabled={isLoading || disabled}
            title="拍照"
          >
            <Camera className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleSend}
            disabled={(!message.trim() && attachments.length === 0) || isLoading || disabled}
            className={cn(
              "w-8 h-8 p-0 ml-2 transition-all",
              "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            title="发送消息"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-500 text-center">
        {disabled ? "选择助手或开始闲聊后即可发送消息" : "按 Ctrl+Enter 发送 • 拖拽文件到此处上传"}
      </div>
    </div>
  )
}
