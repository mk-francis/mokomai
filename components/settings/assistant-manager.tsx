"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Save, X, Bot, Code, Palette, Calculator } from "lucide-react"
import type { Assistant } from "@/components/chat/assistant-panel"
import { useAssistants } from "@/hooks/use-assistants"
import { DEFAULT_ASSISTANTS } from "@/config/default-assistants"

const iconMap = {
  bot: Bot,
  code: Code,
  palette: Palette,
  calculator: Calculator,
}

export function AssistantManager() {
  const { assistants, addAssistant, updateAssistant, deleteAssistant, refreshAssistants } = useAssistants()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "bot",
    capabilities: "",
    customizable: true,
  })

  const handleCreate = async () => {
    try {
      await addAssistant({
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        enabled: true,
        customizable: formData.customizable,
        status: "idle",
        capabilities: formData.capabilities.split(",").map((c) => c.trim()),
      })
      setIsCreating(false)
      setFormData({ name: "", description: "", icon: "bot", capabilities: "", customizable: true })
    } catch (error) {
      alert("创建助手失败")
    }
  }

  const handleUpdate = async (assistantId: string) => {
    try {
      await updateAssistant(assistantId, {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        customizable: formData.customizable,
        capabilities: formData.capabilities.split(",").map((c) => c.trim()),
      })
      setEditingId(null)
    } catch (error) {
      alert("更新助手失败")
    }
  }

  const handleDelete = async (assistantId: string) => {
    if (confirm("确定要删除这个助手吗？")) {
      try {
        await deleteAssistant(assistantId)
      } catch (error) {
        alert("删除助手失败")
      }
    }
  }

  const startEdit = (assistant: Assistant) => {
    setEditingId(assistant.id)
    setFormData({
      name: assistant.name,
      description: assistant.description,
      icon: assistant.icon,
      capabilities: assistant.capabilities.join(", "),
      customizable: assistant.customizable,
    })
  }

  const handleInitializeDefaults = async () => {
    if (confirm("确定要初始化默认助手吗？这将添加系统预设的助手。")) {
      try {
        for (const assistant of DEFAULT_ASSISTANTS) {
          await addAssistant(assistant)
        }
        alert("默认助手初始化成功！")
      } catch (error) {
        alert("初始化失败，请检查网络连接")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">AI助手管理</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={refreshAssistants}>
            刷新列表
          </Button>
          <Button size="sm" variant="outline" onClick={handleInitializeDefaults}>
            初始化默认助手
          </Button>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            添加助手
          </Button>
        </div>
      </div>

      {/* 创建新助手表单 */}
      {isCreating && (
        <div className="bg-slate-800 p-4 rounded-lg space-y-4">
          <h4 className="font-medium text-white">创建新助手</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="助手名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value="bot">机器人</option>
              <option value="code">代码</option>
              <option value="palette">创意</option>
              <option value="calculator">分析</option>
            </select>
          </div>
          <Textarea
            placeholder="助手描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            placeholder="能力列表 (用逗号分隔)"
            value={formData.capabilities}
            onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.customizable}
                onCheckedChange={(checked) => setFormData({ ...formData, customizable: checked })}
              />
              <span className="text-sm text-slate-300">允许自定义</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>
                取消
              </Button>
              <Button size="sm" onClick={handleCreate}>
                创建
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 助手列表 */}
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {assistants.map((assistant) => {
            const IconComponent = iconMap[assistant.icon as keyof typeof iconMap] || Bot
            const isEditing = editingId === assistant.id

            return (
              <div key={assistant.id} className="bg-slate-800 p-4 rounded-lg">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      >
                        <option value="bot">机器人</option>
                        <option value="code">代码</option>
                        <option value="palette">创意</option>
                        <option value="calculator">分析</option>
                      </select>
                    </div>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <Input
                      value={formData.capabilities}
                      onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleUpdate(assistant.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{assistant.name}</h4>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(assistant)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(assistant.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{assistant.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {assistant.capabilities.map((capability) => (
                          <Badge key={capability} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
