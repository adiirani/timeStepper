"use client"

import type React from "react"

import { useState } from "react"
import { useLevelContext } from "@/context/LevelContext"
import { useThemeContext } from "@/context/ThemeContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Clock, Lock, CheckCircle } from "lucide-react"
import OracleChat from "./OracleChat"

interface LevelSelectScreenProps {
  isOpen: boolean
  onClose: () => void
  allLevelsUnlocked?: boolean
}

export default function LevelSelectScreen({ isOpen, onClose, allLevelsUnlocked = false }: LevelSelectScreenProps) {
  const { currentLevel, setLevel } = useLevelContext()
  const { themeColors } = useThemeContext()
  const [isOracleOpen, setIsOracleOpen] = useState(false)

  const handleLevelSelect = (level: number) => {
    setLevel(level)
    onClose()
  }

  if (!isOpen) return null

  const levelData = [
    { id: 1, title: "Ancient Egypt - 3000 BCE", description: "Simple character shifting" },
    { id: 2, title: "Roman Empire - 100 CE", description: "Caesar cipher" },
    { id: 3, title: "Middle Ages - 1000 CE", description: "Substitution cipher" },
    { id: 4, title: "Renaissance - 1500 CE", description: "Vigenère cipher" },
    { id: 5, title: "Industrial Revolution - 1800 CE", description: "Transposition cipher" },
    { id: 6, title: "Information Age - 1970 CE", description: "Binary encoding" },
    { id: 7, title: "Future - 2100 CE", description: "Quantum-inspired encryption" },
  ]

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          className="w-[800px] max-h-[600px] rounded-lg overflow-hidden"
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
            <h2 className="text-xl font-bold" style={{ color: themeColors.accent }}>
              TimeStepper Navigation
            </h2>
            <button
              onClick={onClose}
              className="hover:opacity-70 transition-opacity"
              style={{ color: themeColors.accent }}
            >
              <X size={20} />
            </button>
          </div>

          <Tabs defaultValue="levels" className="p-6">
            <TabsList
              className="mb-6 w-full"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderBottom: `1px solid ${themeColors.accent}50`,
              }}
            >
              <TabsTrigger
                value="levels"
                style={
                  {
                    color: themeColors.accent,
                    backgroundColor: "transparent",
                    "--tab-accent": themeColors.accent,
                  } as React.CSSProperties
                }
                className="flex-1 data-[state=active]:bg-black/30"
              >
                Time Periods
              </TabsTrigger>
              <TabsTrigger
                value="oracle"
                style={
                  {
                    color: themeColors.accent,
                    backgroundColor: "transparent",
                    "--tab-accent": themeColors.accent,
                  } as React.CSSProperties
                }
                className="flex-1 data-[state=active]:bg-black/30"
                onClick={() => setIsOracleOpen(true)}
              >
                Oracle AI Assistant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="levels" className="space-y-6">
              <p className="text-center" style={{ color: `${themeColors.accent}90` }}>
                Select a time period to travel to and solve its cryptographic challenge
              </p>

              <div className="grid grid-cols-2 gap-4">
                {levelData.map((level) => {
                  // Determine level status
                  const isCompleted = currentLevel > level.id
                  const isCurrent = currentLevel === level.id
                  const isLocked = !allLevelsUnlocked && currentLevel < level.id

                  return (
                    <button
                      key={level.id}
                      onClick={() => handleLevelSelect(level.id)}
                      className="flex items-center p-4 rounded-lg transition-all hover:scale-[1.02]"
                      style={{
                        backgroundColor: isCurrent
                          ? `${themeColors.accent}30`
                          : isCompleted
                            ? `${themeColors.accent}15`
                            : "rgba(0, 0, 0, 0.4)",
                        border: `1px solid ${
                          isCurrent
                            ? themeColors.accent
                            : isCompleted
                              ? `${themeColors.accent}50`
                              : "rgba(255,255,255,0.1)"
                        }`,
                        opacity: isLocked ? 0.7 : 1,
                      }}
                      disabled={isLocked}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                        style={{
                          backgroundColor: `${themeColors.accent}20`,
                          border: `1px solid ${themeColors.accent}50`,
                        }}
                      >
                        {isLocked ? (
                          <Lock size={20} style={{ color: `${themeColors.accent}80` }} />
                        ) : isCompleted ? (
                          <CheckCircle size={20} style={{ color: themeColors.accent }} />
                        ) : (
                          <Clock size={20} style={{ color: themeColors.accent }} />
                        )}
                      </div>
                      <div className="text-left">
                        <h3
                          className="font-bold text-lg"
                          style={{ color: isLocked ? `${themeColors.accent}70` : themeColors.accent }}
                        >
                          {level.title}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: isLocked ? `${themeColors.accent}50` : `${themeColors.accent}90` }}
                        >
                          {level.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="oracle" className="h-[400px] flex flex-col items-center justify-center">
              <div className="text-center" style={{ color: themeColors.accent }}>
                <p className="text-xl mb-4">Oracle AI Assistant</p>
                <p className="mb-6">Ask questions about cryptography, cybersecurity, and more!</p>
                <button
                  onClick={() => setIsOracleOpen(true)}
                  className="px-6 py-3 rounded-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${themeColors.accent}30`,
                    border: `1px solid ${themeColors.accent}`,
                  }}
                >
                  Open Oracle Chat
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <OracleChat isOpen={isOracleOpen} onClose={() => setIsOracleOpen(false)} />
    </>
  )
}
