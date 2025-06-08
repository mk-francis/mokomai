import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  assistant_id?: string
  assistant_name?: string
  attachments?: Attachment[]
}

export interface Assistant {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
  customizable: boolean
  status: "idle" | "working"
}

export interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export interface Conversation {
  id: string
  title: string
  updated_at: number
  message_count: number
}

// API functions
export const chatAPI = {
  sendMessage: async (data: {
    message: string
    assistant_id?: string
    session_id?: string
    context?: object
  }) => {
    const response = await api.post("/api/chat", data)
    return response.data
  },

  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get("/api/conversations")
    return response.data.conversations
  },

  getMessages: async (sessionId: string): Promise<Message[]> => {
    const response = await api.get(`/api/conversations/${sessionId}`)
    return response.data.messages
  },

  deleteConversation: async (sessionId: string) => {
    await api.delete(`/api/conversations/${sessionId}`)
  },
}

export const assistantAPI = {
  getAssistants: async (): Promise<Assistant[]> => {
    const response = await api.get("/api/assistants")
    return response.data.assistants
  },
}

export const fileAPI = {
  upload: async (file: File): Promise<Attachment> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },
}

export const liveKitAPI = {
  getToken: async (roomName: string, participantName: string) => {
    const response = await api.post("/api/livekit/token", {
      room_name: roomName,
      participant_name: participantName,
    })
    return response.data
  },
}
