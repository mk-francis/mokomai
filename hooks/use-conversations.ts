"use client"

import { useState, useCallback } from "react"
import type { Conversation } from "@/components/layout/sidebar"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const createConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => [conversation, ...prev])
  }, [])

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
  }, [])

  const renameConversation = useCallback((conversationId: string, newTitle: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, title: newTitle } : conv)))
  }, [])

  const archiveConversation = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, archived: !conv.archived } : conv)),
    )
  }, [])

  const updateConversation = useCallback((conversationId: string, updates: Partial<Conversation>) => {
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, ...updates } : conv)))
  }, [])

  return {
    conversations,
    createConversation,
    deleteConversation,
    renameConversation,
    archiveConversation,
    updateConversation,
  }
}
