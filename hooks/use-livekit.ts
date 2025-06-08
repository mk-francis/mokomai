"use client"

import { useState, useCallback } from "react"
import { apiService } from "@/services/api"

export function useLiveKit() {
  const [isConnected, setIsConnected] = useState(false)
  const [roomToken, setRoomToken] = useState<string>("")
  const [roomUrl, setRoomUrl] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")

  const connect = useCallback(async () => {
    if (isConnected) return

    setConnectionStatus("connecting")
    setError(null)

    try {
      const response = await apiService.getLiveKitToken({
        room_name: `room_${Date.now()}`,
        participant_name: `user_${Date.now()}`,
      })

      setRoomToken(response.token)
      setRoomUrl(response.room_url)
      setIsConnected(true)
      setConnectionStatus("connected")

      // 这里将来会使用真正的LiveKit SDK连接
      // 现在只是模拟状态

      return { token: response.token, roomUrl: response.room_url }
    } catch (err) {
      console.error("LiveKit连接失败:", err)
      setError("连接失败，请稍后重试")
      setConnectionStatus("disconnected")
      return null
    }
  }, [isConnected])

  const disconnect = useCallback(() => {
    // 这里将来会使用真正的LiveKit SDK断开连接
    // 现在只是模拟状态

    setIsConnected(false)
    setRoomToken("")
    setRoomUrl("")
    setConnectionStatus("disconnected")
  }, [])

  const toggleConnection = useCallback(async () => {
    if (isConnected) {
      disconnect()
    } else {
      await connect()
    }
  }, [isConnected, connect, disconnect])

  return {
    isConnected,
    roomToken,
    roomUrl,
    error,
    connectionStatus,
    connect,
    disconnect,
    toggleConnection,
  }
}
