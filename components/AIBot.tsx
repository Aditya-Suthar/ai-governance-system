"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

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
"Show unresolved complaints"
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

return ( <Card className="h-[500px] w-[420px] flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">

  <CardHeader className="border-b">
    <CardTitle className="flex items-center gap-2 text-indigo-700">
      <Bot size={18}/>
      ZeroPoint AI Assistant
    </CardTitle>
  </CardHeader>

 <CardContent className="flex flex-col flex-1 p-3 justify-between">

    <div className="flex-1 overflow-y-auto space-y-3 mb-3 max-h-[320px]">

      {messages.map((m, i) => (

        <div
          key={i}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >

          <div
            className={`px-3 py-2 rounded-lg max-w-[70%] text-sm
            ${m.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-white border"}`}
          >

            {m.content}

          </div>

        </div>

      ))}

      {loading && (
        <div className="text-sm text-gray-500">
          AI is thinking...
        </div>
      )}

    </div>

    {showPrompts && (
     <div className={`flex flex-wrap gap-2 mt-3 transition-all duration-300 ${hidePrompts ? "opacity-0 translate-y-2" : "opacity-100"}`}>

      {quickPrompts.map((p, i) => (

        <Button
          key={i}
          size="sm"
          variant="outline"
          onClick={() => sendMessage(p)}
        >
          {p}
        </Button>

      ))}

    </div>
)}
    <div className="flex gap-2">

      <Input
        placeholder="Ask AI something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button onClick={() => sendMessage(input)}>
        Ask
      </Button>

    </div>

  </CardContent>

</Card>

)
}
