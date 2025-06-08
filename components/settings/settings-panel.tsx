"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { X, Moon, Sun, Volume2, Bell, Shield, Database, Download } from "lucide-react"
import { AssistantManager } from "./assistant-manager"

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"general" | "assistants" | "data">("general")
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [volume, setVolume] = useState([80])
  const [fontSize, setFontSize] = useState([14])

  const handleExportData = () => {
    const exportData = {
      settings: {
        darkMode,
        notifications,
        voiceEnabled,
        autoSave,
        volume: volume[0],
        fontSize: fontSize[0],
      },
      timestamp: Date.now(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mokom-ai-settings.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (confirm("确定要清除所有数据吗？此操作不可撤销。")) {
      localStorage.clear()
      sessionStorage.clear()
      alert("数据已清除")
    }
  }

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-slate-900/95 backdrop-blur-sm border-l border-slate-800 z-30">
      <div className="flex flex-col h-full">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">设置</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 px-4 py-2 text-sm ${
              activeTab === "general" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400"
            }`}
          >
            常规设置
          </button>
          <button
            onClick={() => setActiveTab("assistants")}
            className={`flex-1 px-4 py-2 text-sm ${
              activeTab === "assistants" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400"
            }`}
          >
            AI助手
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 px-4 py-2 text-sm ${
              activeTab === "data" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400"
            }`}
          >
            数据管理
          </button>
        </div>

        {/* 设置内容 */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {activeTab === "general" && (
              <div className="space-y-6">
                {/* 外观设置 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    外观设置
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">深色模式</span>
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">字体大小</span>
                        <span className="text-xs text-slate-500">{fontSize[0]}px</span>
                      </div>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        max={20}
                        min={12}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* 音频设置 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    音频设置
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">启用语音功能</span>
                      <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">音量</span>
                        <span className="text-xs text-slate-500">{volume[0]}%</span>
                      </div>
                      <Slider value={volume} onValueChange={setVolume} max={100} min={0} step={5} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* 通知设置 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    通知设置
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">桌面通知</span>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "assistants" && <AssistantManager />}

            {activeTab === "data" && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  数据管理
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">自动保存对话</span>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={handleExportData}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    导出设置
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-red-700 text-red-400 hover:bg-red-900/30"
                    onClick={handleClearData}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    清除所有数据
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 底部信息 */}
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 text-center">
            <p>MOKOM AI v1.0.0</p>
            <p className="mt-1">© 2024 MOKOM AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
