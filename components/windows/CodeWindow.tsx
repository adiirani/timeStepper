"use client"
import DraggableWindow from "@/components/DraggableWindow"
import { useLevelContext } from "@/context/LevelContext"
import { useThemeContext } from "@/context/ThemeContext"
import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs"

export default function CodeWindow() {
  const { levelData } = useLevelContext()
  const { themeColors } = useThemeContext()

  return (
    <DraggableWindow
      id="code"
      title="Code Display"
      initialPosition={{ x: 50, y: 70 }}
      initialWidth={600}
      initialHeight={400}
    >
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold mb-2" style={{ color: themeColors.accent }}>
            Challenge Code:
          </h3>
          <p className="text-sm mb-4" style={{ color: `${themeColors.accent}90` }}>
            Analyze this code to understand how it transforms the passphrase.
          </p>
        </div>

        <div className="flex-1 overflow-auto rounded p-2" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          {levelData?.js_code ? (
            <SyntaxHighlighter
              language="javascript"
              style={atomOneDark}
              customStyle={{
                backgroundColor: "transparent",
                fontSize: "14px",
              }}
            >
              {levelData.js_code}
            </SyntaxHighlighter>
          ) : (
            <div className="animate-pulse" style={{ color: themeColors.accent }}>
              Loading code...
            </div>
          )}
        </div>
      </div>
    </DraggableWindow>
  )
}
