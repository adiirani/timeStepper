"use client"

import type React from "react"

import { useState } from "react"
import DraggableWindow from "@/components/DraggableWindow"
import { useThemeContext } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLevelContext } from "@/context/LevelContext"

export default function ReverserWindow() {
  const { levelData } = useLevelContext()
  const { themeColors } = useThemeContext()
  const [code, setCode] = useState("")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const handleRunCode = () => {
    setIsRunning(true)
    setError(null)

    try {
      // Create a function from the code
      const userFunction = new Function("input", code)
      const result = userFunction(input)
      setOutput(String(result))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <DraggableWindow
      id="reverser"
      title="Reverser Lab"
      initialPosition={{ x: 50, y: 490 }}
      initialWidth={600}
      initialHeight={400}
    >
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold mb-2" style={{ color: themeColors.accent }}>
            Reverse Engineer:
          </h3>
          <p className="text-sm" style={{ color: `${themeColors.accent}90` }}>
            Write code to reverse the transformation and find the original passphrase.
          </p>
        </div>

        <Tabs defaultValue="code" className="flex-1 flex flex-col">
          <TabsList
            className="border-b"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderBottom: `1px solid ${themeColors.accent}50`,
            }}
          >
            <TabsTrigger
              value="code"
              style={
                {
                  color: themeColors.accent,
                  backgroundColor: "transparent",
                  "--tab-accent": themeColors.accent,
                } as React.CSSProperties
              }
              className="data-[state=active]:bg-black/30"
            >
              JavaScript
            </TabsTrigger>
            <TabsTrigger
              value="blocks"
              style={
                {
                  color: themeColors.accent,
                  backgroundColor: "transparent",
                  "--tab-accent": themeColors.accent,
                } as React.CSSProperties
              }
              className="data-[state=active]:bg-black/30"
            >
              Code Blocks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="flex-1 flex flex-col mt-0 data-[state=active]:flex">
            <div className="flex-1 rounded p-2 mb-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent font-mono text-sm resize-none focus:outline-none"
                style={{ color: themeColors.accent }}
                placeholder="// Write your code here
// Example:
// function reverseTransform(input) {
//   // Your code to reverse the transformation
//   return originalPassphrase;
// }
// return reverseTransform(input);"
              />
            </div>

            <div className="flex space-x-2 mb-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Test input..."
                className="flex-1 placeholder:opacity-50"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  border: `1px solid ${themeColors.accent}`,
                  color: themeColors.accent,
                }}
              />
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                style={{
                  backgroundColor: `${themeColors.accent}30`,
                  color: themeColors.accent,
                  border: `1px solid ${themeColors.accent}`,
                }}
                className="hover:opacity-80"
              >
                Run
              </Button>
            </div>

            {(output !== null || error) && (
              <div className="rounded p-2 max-h-24 overflow-auto" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                {error ? (
                  <div style={{ color: "#ff6b6b" }} className="text-sm">
                    {error}
                  </div>
                ) : (
                  <div style={{ color: themeColors.accent }} className="text-sm">
                    Output: <span className="font-bold">{output}</span>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blocks" className="flex-1 flex flex-col mt-0 data-[state=active]:flex">
            <div
              className="flex-1 rounded p-4 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            >
              <div className="text-center" style={{ color: themeColors.accent }}>
                <p>Code blocks interface coming soon!</p>
                <p className="text-sm mt-2">For now, please use the JavaScript tab.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DraggableWindow>
  )
}
