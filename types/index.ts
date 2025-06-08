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
  category: "general" | "professional"
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
  assistant_id: string | null
  assistant_name: string | null
  updated_at: number
  created_at: number
  message_count: number
  category: "chat" | "assistant"
  archived?: boolean // 新增归档字段
  important?: boolean // 新增重要标记字段
}

export interface LiveKitConfig {
  roomName?: string
  token?: string
  enabled: boolean
}

export interface ConversationGroup {
  date: string
  conversations: Conversation[]
}
