"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Plus, Moon, Sun, User, Database, Palette, Bell, Shield, HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  onNewChat: () => void
}

export function Header({ onNewChat }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [dataCollection, setDataCollection] = useState(false)

  const handleNewChat = () => {
    console.log("新对话按钮被点击")
    onNewChat()
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    console.log("主题切换，切换到:", newTheme)
    setTheme(newTheme)
  }

  const handleSettings = () => {
    console.log("设置按钮被点击")
    setSettingsOpen(true)
  }

  const handleExportData = () => {
    console.log("导出数据")
    // TODO: 实现数据导出功能
  }

  const handleClearData = () => {
    console.log("清除数据")
    // TODO: 实现数据清除功能
  }

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              MOKOM AI
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            新对话
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettings}
                className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="设置"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-200">设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* 外观设置 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-medium text-slate-300">外观</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme-toggle" className="text-slate-400">
                      深色模式
                    </Label>
                    <Switch
                      id="theme-toggle"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* 通知设置 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-green-400" />
                    <h3 className="text-sm font-medium text-slate-300">通知</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="text-slate-400">
                      启用通知
                    </Label>
                    <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* 数据设置 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-medium text-slate-300">数据管理</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save" className="text-slate-400">
                      自动保存对话
                    </Label>
                    <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-collection" className="text-slate-400">
                      允许数据收集
                    </Label>
                    <Switch id="data-collection" checked={dataCollection} onCheckedChange={setDataCollection} />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportData}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      导出数据
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearData}
                      className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      清除数据
                    </Button>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* 隐私设置 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-sm font-medium text-slate-300">隐私与安全</h3>
                  </div>
                  <div className="text-xs text-slate-500 space-y-2">
                    <p>• 对话数据仅存储在本地浏览器中</p>
                    <p>• 不会向第三方分享您的个人信息</p>
                    <p>• 您可以随时删除或导出您的数据</p>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* 帮助 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-medium text-slate-300">帮助</h3>
                  </div>
                  <div className="text-xs text-slate-500">
                    <p>版本: 1.0.0</p>
                    <p>如需帮助，请访问我们的文档或联系支持团队。</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-slate-700 text-slate-300">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
    </>
  )
}
