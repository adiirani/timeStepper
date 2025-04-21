"use client"

import { useState } from "react"
import { useThemeContext } from "@/context/ThemeContext"
import { useLevelContext } from "@/context/LevelContext"
import { Play, List, MessageCircle } from "lucide-react"
import LevelSelectScreen from "./LevelSelectScreen"
import OracleChat from "./OracleChat"
import OscilloscopeBackground from "./OscilloscopeBackground"

interface MainMenuProps {
  onPlay: () => void
}

export default function MainMenu({ onPlay }: MainMenuProps) {
  const { themeColors } = useThemeContext()
  const { currentLevel } = useLevelContext()
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false)
  const [isOracleOpen, setIsOracleOpen] = useState(false)

  return (
    <>
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center">
        <OscilloscopeBackground />

        <div className="z-10 flex flex-col items-center justify-center space-y-12">
          <div className="text-center">
            <h1
              className="text-7xl font-bold tracking-wider mb-4"
              style={{ color: themeColors.accent, textShadow: `0 0 10px ${themeColors.accent}80` }}
            >
              TimeStepper
            </h1>
            <p className="text-xl" style={{ color: `${themeColors.accent}90` }}>
              Crack the code, travel through time
            </p>
          </div>

          <div className="flex flex-col space-y-4 w-64">
            <button
              onClick={onPlay}
              className="flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: `${themeColors.accent}30`,
                border: `2px solid ${themeColors.accent}`,
                boxShadow: `0 0 15px ${themeColors.accent}40`,
              }}
            >
              <Play size={24} style={{ color: themeColors.accent }} />
              <span className="text-xl font-bold" style={{ color: themeColors.accent }}>
                Play
              </span>
            </button>

            <button
              onClick={() => setIsLevelSelectOpen(true)}
              className="flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: `${themeColors.accent}20`,
                border: `2px solid ${themeColors.accent}90`,
                boxShadow: `0 0 10px ${themeColors.accent}30`,
              }}
            >
              <List size={24} style={{ color: themeColors.accent }} />
              <span className="text-xl font-bold" style={{ color: themeColors.accent }}>
                Level Select
              </span>
            </button>

            <button
              onClick={() => setIsOracleOpen(true)}
              className="flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: `${themeColors.accent}20`,
                border: `2px solid ${themeColors.accent}90`,
                boxShadow: `0 0 10px ${themeColors.accent}30`,
              }}
            >
              <MessageCircle size={24} style={{ color: themeColors.accent }} />
              <span className="text-xl font-bold" style={{ color: themeColors.accent }}>
                Oracle
              </span>
            </button>
          </div>

          <div className="absolute bottom-8 text-center text-sm" style={{ color: `${themeColors.accent}70` }}>
            <p>A cryptography learning game for young hackers</p>
            <p className="mt-1">Current Level: {currentLevel}</p>
          </div>
        </div>
      </div>

      <LevelSelectScreen
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        allLevelsUnlocked={true}
      />

      <OracleChat isOpen={isOracleOpen} onClose={() => setIsOracleOpen(false)} />
    </>
  )
}
