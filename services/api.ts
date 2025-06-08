"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

interface ChatRequest {
  message: string
  assistant_id?: string
  session_id?: string
  attachments?: any[]
}

interface ChatResponse {
  response: string
  assistant_id: string
  assistant_name: string
  session_id: string
  timestamp: number
}

interface AssistantsResponse {
  assistants: any[]
}

interface UploadResponse {
  file_id: string
  file_url: string
  file_type: string
}

interface LiveKitTokenRequest {
  room_name: string
  participant_name: string
}

interface LiveKitTokenResponse {
  token: string
  room_url: string
}

interface AssistantCreateRequest {
  name: string
  description: string
  icon: string
  capabilities: string[]
  customizable?: boolean
}

interface AssistantUpdateRequest {
  name?: string
  description?: string
  icon?: string
  capabilities?: string[]
  enabled?: boolean
  customizable?: boolean
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // 聊天相关API
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // 助手管理API
  async getAssistants(): Promise<AssistantsResponse> {
    return this.request<AssistantsResponse>("/api/assistants")
  }

  async createAssistant(data: AssistantCreateRequest): Promise<any> {
    return this.request("/api/assistants", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateAssistant(assistantId: string, data: AssistantUpdateRequest): Promise<any> {
    return this.request(`/api/assistants/${assistantId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteAssistant(assistantId: string): Promise<void> {
    return this.request(`/api/assistants/${assistantId}`, {
      method: "DELETE",
    })
  }

  // 文件上传API
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`文件上传失败: ${response.status}`)
    }

    return response.json()
  }

  // 对话历史API
  async getConversation(sessionId: string) {
    return this.request(`/api/conversations/${sessionId}`)
  }

  async getConversations() {
    return this.request("/api/conversations")
  }

  async updateConversation(sessionId: string, data: any) {
    return this.request(`/api/conversations/${sessionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteConversation(sessionId: string) {
    return this.request(`/api/conversations/${sessionId}`, {
      method: "DELETE",
    })
  }

  // LiveKit API
  async getLiveKitToken(data: LiveKitTokenRequest): Promise<LiveKitTokenResponse> {
    return this.request<LiveKitTokenResponse>("/api/livekit/token", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()
