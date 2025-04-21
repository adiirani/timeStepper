"use client"

import { useLevelContext } from "@/context/LevelContext"
import { useThemeContext } from "@/context/ThemeContext"
import { Menu } from "lucide-react"

interface LevelIndicatorProps {
  onMenuClick: () => void
}

export default function LevelIndicator({ onMenuClick }: LevelIndicatorProps) {
  const { currentLevel, levelData, isLoading } = useLevelContext()
  const { themeColors } = useThemeContext()

  if (isLoading) {
    return (
      <div
        className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center z-50"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${themeColors.accent}`,
        }}
      >
        <div className="animate-pulse" style={{ color: themeColors.accent }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div
      className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${themeColors.accent}`,
      }}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded hover:bg-black/30 transition-colors"
          style={{ color: themeColors.accent }}
        >
          <Menu size={20} />
        </button>

        <div className="font-bold text-xl" style={{ color: themeColors.accent }}>
          TimeStepper
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div style={{ color: themeColors.accent }}>
          <span className="font-bold">Level {currentLevel}:</span> {levelData?.title || "Loading..."}
        </div>

        <div className="flex space-x-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  i + 1 === currentLevel
                    ? themeColors.accent
                    : i + 1 < currentLevel
                      ? `${themeColors.accent}70`
                      : "rgba(75, 75, 75, 0.5)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
