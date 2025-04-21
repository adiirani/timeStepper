"use client"

import { useState } from "react"
import { useThemeContext } from "@/context/ThemeContext"
import { X, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { askOracle } from "@/app/actions/oracle"

interface OracleChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function OracleChat({ isOpen, onClose }: OracleChatProps) {
  const { themeColors } = useThemeContext()
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hello, I'm Oracle! I'm here to help you learn about cybersecurity and cryptography. What would you like to know?",
    },
  ])

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return

    // Add user message
    const userMessage = chatInput.trim()
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setChatInput("")
    setIsLoading(true)

    try {
      // Call the server action to get a response
      const response = await askOracle(userMessage)

      if (response.success) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: response.message }])
      } else {
        // If there's an error or we need to use fallback responses
        let fallbackResponse = ""

        if (response.fallback) {
          // Generate a fallback response based on keywords
          const lowercaseInput = userMessage.toLowerCase()

          if (lowercaseInput.includes("encryption") || lowercaseInput.includes("cipher")) {
            fallbackResponse =
              "Encryption is the process of encoding information so that only authorized parties can access it. Common encryption methods include symmetric encryption (using the same key to encrypt and decrypt) and asymmetric encryption (using different keys for encryption and decryption). In this game, you'll encounter various historical encryption methods!"
          } else if (lowercaseInput.includes("hash") || lowercaseInput.includes("hashing")) {
            fallbackResponse =
              "Hashing is a one-way function that converts input data into a fixed-size string of bytes. Unlike encryption, hashing is not reversible. It's commonly used for password storage, data integrity verification, and digital signatures."
          } else if (lowercaseInput.includes("caesar") || lowercaseInput.includes("shift cipher")) {
            fallbackResponse =
              "The Caesar cipher is one of the simplest encryption techniques. It works by shifting each letter in the plaintext by a fixed number of positions down the alphabet. For example, with a shift of 3, 'A' would become 'D', 'B' would become 'E', and so on. It's named after Julius Caesar, who used it to communicate with his generals!"
          } else if (lowercaseInput.includes("binary")) {
            fallbackResponse =
              "Binary code represents text or computer processor instructions using the binary number system with just two digits: 0 and 1. Each binary digit is called a 'bit'. In computing, 8 bits make a byte, which can represent 256 different values (2^8). ASCII, for example, uses 7 bits to represent characters."
          } else if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
            fallbackResponse = "Hello there! How can I help you with your cybersecurity learning journey today?"
          } else if (lowercaseInput.includes("game") || lowercaseInput.includes("timestepper")) {
            fallbackResponse =
              "TimeStepper is a game designed to teach cryptography and reverse engineering through time travel! You'll visit different time periods, each with unique encryption methods. Your mission is to analyze the code, understand how it works, and decrypt the messages to progress through time. It's a fun way to learn about the evolution of cryptography throughout history!"
          } else {
            fallbackResponse =
              "That's an interesting question about cybersecurity! As you progress through the levels, you'll learn more about different encryption techniques and how to reverse-engineer them. Is there something specific about cryptography or cybersecurity you'd like to know more about?"
          }

          setChatMessages((prev) => [...prev, { role: "assistant", content: fallbackResponse }])
        } else {
          // Use the error message from the response
          setChatMessages((prev) => [...prev, { role: "assistant", content: response.message }])
        }
      }
    } catch (error) {
      console.error("Error in chat:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to my knowledge base right now. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="w-[600px] h-[500px] rounded-lg overflow-hidden flex flex-col"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${themeColors.accent}`,
          boxShadow: `0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px ${themeColors.accent}40`,
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{
            borderBottom: `1px solid ${themeColors.accent}`,
            backgroundColor: `${themeColors.accent}20`,
          }}
        >
          <div className="flex items-center">
            <Bot size={20} style={{ color: themeColors.accent }} className="mr-2" />
            <h2 className="text-xl font-bold" style={{ color: themeColors.accent }}>
              Oracle AI Assistant
            </h2>
          </div>
          <button
            onClick={onClose}
            className="hover:opacity-70 transition-opacity"
            style={{ color: themeColors.accent }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          {chatMessages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "rounded-tr-none" : "rounded-tl-none"
                }`}
                style={{
                  backgroundColor: message.role === "user" ? `${themeColors.accent}30` : "rgba(255, 255, 255, 0.1)",
                  border: `1px solid ${message.role === "user" ? themeColors.accent : "rgba(255, 255, 255, 0.2)"}`,
                }}
              >
                <p style={{ color: message.role === "user" ? themeColors.accent : "#ffffff" }}>{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-left">
              <div
                className="inline-block rounded-lg px-4 py-2 rounded-tl-none"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <div className="flex items-center" style={{ color: "#ffffff" }}>
                  <span className="mr-2">Oracle is thinking</span>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t" style={{ borderColor: `${themeColors.accent}30` }}>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage()
              }}
              placeholder="Ask Oracle about cybersecurity..."
              className="flex-1 placeholder:opacity-50"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: `1px solid ${themeColors.accent}`,
                color: themeColors.accent,
              }}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              style={{
                backgroundColor: `${themeColors.accent}30`,
                color: themeColors.accent,
                border: `1px solid ${themeColors.accent}`,
              }}
              className="hover:opacity-80"
              disabled={isLoading}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
