"use client"

import { Header } from "@/components/layout/header"
import { ConversationList } from "@/components/sidebar/conversation-list"
import { ChatContainer } from "@/components/chat/chat-container"
import { AssistantPanel } from "@/components/chat/assistant-panel"
import { VoiceRoom } from "@/components/livekit/voice-room"
import { useChat } from "@/hooks/use-chat"
import { useState } from "react"
import type { LiveKitConfig } from "@/types"

export default function HomePage() {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    selectedAssistant,
    selectAssistantAndCreateChat,
    startCasualChat,
    loadConversation,
    sendMessage,
    deleteConversation,
    renameConversation,
    archiveConversation,
    toggleImportant,
  } = useChat()

  const [liveKitConfig, setLiveKitConfig] = useState<LiveKitConfig>({
    enabled: false,
  })

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <Header onNewChat={startCasualChat} />

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧对话列表 */}
        <ConversationList
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={loadConversation}
          onDeleteConversation={deleteConversation}
          onStartCasualChat={startCasualChat}
          onRenameConversation={renameConversation}
          onArchiveConversation={archiveConversation}
          onToggleImportant={toggleImportant}
        />

        {/* 中间聊天区域 */}
        <div className="flex-1 flex flex-col">
          <ChatContainer
            currentConversation={currentConversation}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
          <VoiceRoom config={liveKitConfig} onConfigChange={setLiveKitConfig} />
        </div>

        {/* 右侧助手面板 */}
        <AssistantPanel
          selectedAssistant={selectedAssistant}
          onSelectAssistant={selectAssistantAndCreateChat}
          onStartCasualChat={startCasualChat}
        />
      </div>
    </div>
  )
}
