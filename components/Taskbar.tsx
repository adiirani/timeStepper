"use client"

import { useState } from "react"
import { Code, Terminal, Lightbulb, Keyboard, Map, Home } from "lucide-react"
import { useWindowContext } from "@/context/WindowContext"
import { useLevelContext } from "@/context/LevelContext"
import { useThemeContext } from "@/context/ThemeContext"
import LevelSelectScreen from "./LevelSelectScreen"

interface TaskbarProps {
  onMenuClick: () => void
}

export default function Taskbar({ onMenuClick }: TaskbarProps) {
  const { visibleWindows, toggleWindowVisibility } = useWindowContext()
  const { currentLevel, levelData } = useLevelContext()
  const { themeColors } = useThemeContext()
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false)

  const buttons = [
    { id: "code", icon: Code, label: "Code" },
    { id: "input-output", icon: Terminal, label: "Test" },
    { id: "reverser", icon: Keyboard, label: "Reverser" },
    { id: "hints", icon: Lightbulb, label: "Hints" },
  ]

  return (
    <>
      <div
        className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-50"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          borderTop: `1px solid ${themeColors.accent}`,
        }}
      >
        <div className="flex space-x-4">
          {buttons.map((button) => (
            <button
              key={button.id}
              className={`flex flex-col items-center justify-center p-2 rounded hover:opacity-80 transition-colors ${
                visibleWindows.includes(button.id) ? "opacity-100" : "opacity-70"
              }`}
              onClick={() => toggleWindowVisibility(button.id)}
              style={{
                backgroundColor: visibleWindows.includes(button.id) ? `${themeColors.accent}30` : "transparent",
                color: themeColors.accent,
              }}
            >
              <button.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{button.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div style={{ color: themeColors.accent }} className="text-sm">
            <span className="mr-2">Level: {currentLevel}</span>
            {levelData?.title && <span>| {levelData.title}</span>}
          </div>

          <button
            className="flex flex-col items-center justify-center p-2 rounded hover:opacity-80 transition-colors"
            onClick={() => setIsLevelSelectOpen(true)}
            style={{
              backgroundColor: `${themeColors.accent}20`,
              color: themeColors.accent,
              border: `1px solid ${themeColors.accent}50`,
            }}
          >
            <Map className="h-5 w-5" />
            <span className="text-xs mt-1">Levels</span>
          </button>

          <button
            className="flex flex-col items-center justify-center p-2 rounded hover:opacity-80 transition-colors"
            onClick={onMenuClick}
            style={{
              backgroundColor: `${themeColors.accent}20`,
              color: themeColors.accent,
              border: `1px solid ${themeColors.accent}50`,
            }}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>

      <LevelSelectScreen
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        allLevelsUnlocked={true}
      />
    </>
  )
}
