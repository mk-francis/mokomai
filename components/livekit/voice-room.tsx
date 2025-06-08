"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Monitor, Volume2, VolumeX } from "lucide-react"
import type { LiveKitConfig } from "@/types"
import { cn } from "@/lib/utils"

interface VoiceRoomProps {
  config: LiveKitConfig
  onConfigChange: (config: LiveKitConfig) => void
}

export function VoiceRoom({ config, onConfigChange }: VoiceRoomProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)

  const toggleConnection = () => {
    console.log("语音房间连接切换:", !isConnected)
    setIsConnected(!isConnected)
    onConfigChange({
      ...config,
      enabled: !isConnected,
    })
  }

  const toggleMute = () => {
    console.log("静音切换:", !isMuted)
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    console.log("视频切换:", !isVideoEnabled)
    setIsVideoEnabled(!isVideoEnabled)
  }

  const toggleScreenShare = () => {
    console.log("屏幕共享切换:", !isScreenSharing)
    setIsScreenSharing(!isScreenSharing)
  }

  const toggleSpeaker = () => {
    console.log("扬声器切换:", !isSpeakerMuted)
    setIsSpeakerMuted(!isSpeakerMuted)
  }

  return (
    <div className="border-t border-slate-800 bg-slate-900/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-medium text-slate-300">语音房间</h3>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className={cn(
              "text-xs",
              isConnected
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-slate-600/20 text-slate-400 border-slate-600/30",
            )}
          >
            {isConnected ? "已连接" : "未连接"}
          </Badge>
        </div>

        <Button
          variant={isConnected ? "destructive" : "default"}
          size="sm"
          onClick={toggleConnection}
          className={cn(isConnected ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}
        >
          {isConnected ? (
            <>
              <PhoneOff className="w-4 h-4 mr-2" />
              断开连接
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 mr-2" />
              连接
            </>
          )}
        </Button>
      </div>

      {isConnected && (
        <div className="space-y-4">
          {/* 音频可视化 */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-center space-x-1 h-12">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full transition-all duration-150",
                    "animate-pulse",
                  )}
                  style={{
                    height: `${Math.random() * 40 + 10}px`,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-xs text-slate-500 mt-2">音频可视化</p>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className={cn(
                "w-10 h-10 p-0 rounded-full",
                isMuted
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600",
              )}
              title={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVideo}
              className={cn(
                "w-10 h-10 p-0 rounded-full",
                isVideoEnabled
                  ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600",
              )}
              title={isVideoEnabled ? "关闭视频" : "开启视频"}
            >
              {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleScreenShare}
              className={cn(
                "w-10 h-10 p-0 rounded-full",
                isScreenSharing
                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600",
              )}
              title={isScreenSharing ? "停止共享" : "屏幕共享"}
            >
              <Monitor className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSpeaker}
              className={cn(
                "w-10 h-10 p-0 rounded-full",
                isSpeakerMuted
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600",
              )}
              title={isSpeakerMuted ? "开启扬声器" : "关闭扬声器"}
            >
              {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>

          {/* 参与者 */}
          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">参与者 (1)</p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">您</span>
              </div>
              <span className="text-sm text-slate-300">您</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">正在说话</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
