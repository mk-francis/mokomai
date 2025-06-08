"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function InteractionTest() {
  const [clickCount, setClickCount] = useState(0)
  const [hoverCount, setHoverCount] = useState(0)

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800 p-4 rounded-lg text-white text-sm z-50">
      <h3 className="font-bold mb-2">交互测试</h3>
      <div className="space-y-2">
        <Button onClick={() => setClickCount(clickCount + 1)} className="w-full text-xs" size="sm">
          点击测试 ({clickCount})
        </Button>

        <div
          className="group p-2 bg-slate-700 rounded cursor-pointer"
          onMouseEnter={() => setHoverCount(hoverCount + 1)}
        >
          <span>Hover测试 ({hoverCount})</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-green-400">✓ Hover工作</span>
          </div>
        </div>
      </div>
    </div>
  )
}
