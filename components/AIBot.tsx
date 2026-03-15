"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, Send } from "lucide-react"

export default function AIBot() {

const [messages, setMessages] = useState([
{
role: "ai",
content:
"Hello 👋 I'm ZeroPoint AI. I can help you understand complaint status, priority and categories."
}
])

const [input, setInput] = useState("")
const [loading, setLoading] = useState(false)
const [showPrompts, setShowPrompts] = useState(true)
const [hidePrompts, setHidePrompts] = useState(false)

const quickPrompts = [
"Why is my complaint pending?",
"How are priorities decided?",
"Show unresolved complaints",
"Show city hotspots"
]

async function sendMessage(text: string){
  if (loading) return
  setHidePrompts(true)

setTimeout(() => {
  setShowPrompts(false)
}, 300)


if (!text.trim()) return

const userMsg = { role: "user", content: text }

setMessages(prev => [...prev, userMsg])
setInput("")
setLoading(true)

try {

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  })

  const data = await res.json()

  const aiMsg = {
    role: "ai",
    content: data.reply
  }

  setMessages(prev => [...prev, aiMsg])

} catch (err) {

  setMessages(prev => [
    ...prev,
    { role: "ai", content: "AI error." }
  ])

}

setLoading(false)

}

return (
<Card className="h-[560px] w-full max-w-2xl flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
  <CardHeader className="border-b border-gray-100 bg-white px-6 py-4">
  <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-900">
    <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
      <Bot size={20} className="text-white"/>
    </div>
    ZeroPoint AI Assistant
  </CardTitle>
</CardHeader>

 <CardContent className="flex flex-col flex-1 p-0 justify-between bg-gradient-to-b from-gray-50 to-white">

    <div className="flex-1 overflow-y-auto space-y-4 p-6 max-h-[380px]">

      {messages.map((m, i) => (

        <div
          key={i}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-3`}
        >
          {m.role === "ai" && (
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-white"/>
            </div>
          )}

          <div
            className={`px-4 py-3 rounded-lg max-w-xs text-sm leading-relaxed
            ${m.role === "user"
                ? "bg-indigo-600 text-white rounded-bl-none shadow-md"
                : "bg-white text-gray-900 rounded-tl-none border border-gray-200 shadow-sm"}`}
          >

            {m.content}

          </div>

          {m.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">U</span>
            </div>
          )}

        </div>

      ))}

      {loading && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <Bot size={18} className="text-white"/>
          </div>
          <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
            </div>
          </div>
        </div>
      )}

    </div>

    {showPrompts && (
     <div className={`flex flex-wrap gap-2 px-6 py-4 border-t border-gray-100 transition-all duration-300 ${hidePrompts ? "opacity-0 translate-y-2" : "opacity-100"}`}>

      {quickPrompts.map((p, i) => (

        <Button
          key={i}
          size="sm"
          variant="outline"
          onClick={() => sendMessage(p)}
          className="border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 rounded-full px-4 text-xs font-medium transition-colors"
        >
          {p}
        </Button>

      ))}

    </div>
)}
    <div className="flex gap-2 px-6 py-4 border-t border-gray-100 bg-white">

      <Input
        placeholder="Ask AI something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
        className="rounded-lg border-gray-200 text-sm placeholder-gray-500 focus:border-indigo-400 focus:ring-indigo-400"
      />

      <Button 
        onClick={() => sendMessage(input)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3"
        size="sm"
      >
        <Send size={18} />
      </Button>

    </div>

  </CardContent>

</Card>

)
}
