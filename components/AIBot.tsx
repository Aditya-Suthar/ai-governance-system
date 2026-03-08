"use client"

import { useState } from "react"

export default function AIBot() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {open && (
        <div className="w-80 h-96 bg-white border shadow-xl rounded-xl p-4 mb-3">
          <h2 className="font-bold text-lg">AI Assistant</h2>
          <p className="text-sm text-gray-500">
            Ask anything about complaints.
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg"
      >
        AI
      </button>

    </div>
  )
}