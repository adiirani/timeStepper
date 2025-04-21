"use client"

import { useState, useEffect } from "react"
import DraggableWindow from "@/components/DraggableWindow"
import { useLevelContext } from "@/context/LevelContext"
import { useThemeContext } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw } from "lucide-react"

export default function InputOutputWindow() {
  const { currentLevel, levelData, testSolution, submitSolution, testResult, isSubmitting, generatePassphrase } =
    useLevelContext()
  const { themeColors } = useThemeContext()
  const [input, setInput] = useState("")

  useEffect(() => {
    // Clear input when level changes
    setInput("")
  }, [currentLevel])

  const handleTest = () => {
    if (!input.trim()) return
    testSolution(input)
  }

  const handleSubmit = () => {
    if (!input.trim()) return
    submitSolution(input)
  }

  return (
    <DraggableWindow
      id="input-output"
      title="Test Console"
      initialPosition={{ x: 670, y: 70 }}
      initialWidth={500}
      initialHeight={400}
    >
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold mb-2" style={{ color: themeColors.accent }}>
            Test Your Solution:
          </h3>
          <p className="text-sm" style={{ color: `${themeColors.accent}90` }}>
            Enter a passphrase to test if it produces the expected output.
          </p>
        </div>

        {levelData?.transformedPassphrase && (
          <div
            className="mb-4 p-3 rounded"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", border: `1px dashed ${themeColors.accent}50` }}
          >
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: `${themeColors.accent}90` }}>Target Output:</span>
              <Button
                onClick={generatePassphrase}
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                style={{ color: themeColors.accent }}
              >
                <RefreshCw size={14} className="mr-1" />
                New
              </Button>
            </div>
            <div
              className="font-mono text-sm p-2 rounded"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", color: themeColors.accent }}
            >
              {levelData.transformedPassphrase}
            </div>

            
          </div>
        )}

        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter passphrase..."
            className="flex-1 placeholder:opacity-50"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: `1px solid ${themeColors.accent}`,
              color: themeColors.accent,
            }}
          />
          <Button
            onClick={handleTest}
            disabled={isSubmitting}
            style={{
              backgroundColor: `${themeColors.accent}30`,
              color: themeColors.accent,
              border: `1px solid ${themeColors.accent}`,
            }}
            className="hover:opacity-80"
          >
            Test
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              backgroundColor: `${themeColors.accent}50`,
              color: themeColors.accent,
              border: `1px solid ${themeColors.accent}`,
            }}
            className="hover:opacity-80"
          >
            Submit
          </Button>
        </div>

        <div className="flex-1 overflow-auto rounded p-4 font-mono" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          <div style={{ color: themeColors.accent }}>
            <span style={{ color: `${themeColors.accent}80` }}>$</span> Testing input: {input || "<empty>"}
          </div>

          {testResult && (
            <div className="mt-2">
              <div style={{ color: themeColors.accent }}>
                <span style={{ color: `${themeColors.accent}80` }}>$</span> Result:
              </div>
              <pre className="mt-1 text-sm whitespace-pre-wrap break-all" style={{ color: `${themeColors.accent}90` }}>
                {typeof testResult === "string" ? testResult : testResult.output || JSON.stringify(testResult, null, 2)}
              </pre>

              {testResult.correct === true && (
                <div
                  className="mt-3 p-2 rounded animate-pulse"
                  style={{ backgroundColor: `${themeColors.accent}20`, color: themeColors.accent }}
                >
                  ✓ Correct! Challenge solved!
                </div>
              )}

              {testResult.correct === false && (
                <div
                  className="mt-3 p-2 rounded"
                  style={{ backgroundColor: "rgba(255, 100, 100, 0.2)", color: "#ff6464" }}
                >
                  ✗ Incorrect. Try again!
                </div>
              )}
            </div>
          )}

          {isSubmitting && (
            <div className="mt-2 animate-pulse" style={{ color: `${themeColors.accent}` }}>
              Processing...
            </div>
          )}
        </div>
      </div>
    </DraggableWindow>
  )
}
