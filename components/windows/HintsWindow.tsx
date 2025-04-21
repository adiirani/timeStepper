"use client"
import DraggableWindow from "@/components/DraggableWindow"
import { useThemeContext } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { useLevelContext } from "@/context/LevelContext"
import { Lightbulb } from "lucide-react"

export default function HintsWindow() {
  const { getHint, hints } = useLevelContext()
  const { themeColors } = useThemeContext()

  return (
    <DraggableWindow
      id="hints"
      title="Hints"
      initialPosition={{ x: 670, y: 490 }}
      initialWidth={500}
      initialHeight={400}
    >
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold mb-2" style={{ color: themeColors.accent }}>
            Need Help?
          </h3>
          <p className="text-sm" style={{ color: `${themeColors.accent}90` }}>
            Click the button below to reveal a hint. Each hint provides more information.
          </p>
        </div>

        <Button
          onClick={getHint}
          className="mb-4 w-full hover:opacity-80"
          style={{
            backgroundColor: `${themeColors.accent}30`,
            color: themeColors.accent,
            border: `1px solid ${themeColors.accent}`,
          }}
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          Reveal Hint
        </Button>

        <div className="flex-1 overflow-auto rounded p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          {hints.length === 0 ? (
            <div style={{ color: `${themeColors.accent}70` }} className="italic">
              No hints revealed yet.
            </div>
          ) : (
            <ul className="space-y-4">
              {hints.map((hint, index) => (
                <li key={index} style={{ color: themeColors.accent }}>
                  <div className="flex items-start">
                    <span
                      className="rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0"
                      style={{
                        backgroundColor: `${themeColors.accent}30`,
                        color: themeColors.accent,
                      }}
                    >
                      {index + 1}
                    </span>
                    <p>{hint}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DraggableWindow>
  )
}
