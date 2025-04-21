"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ThemeColors {
  accent: string
  particle: string
  background: string
}

interface ThemeContextType {
  themeColors: ThemeColors
  setThemeColors: (colors: ThemeColors) => void
}

const defaultThemeColors: ThemeColors = {
  accent: "#00ff00",
  particle: "#00ff00",
  background: "#000000",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultThemeColors)

  return (
    <ThemeContext.Provider
      value={{
        themeColors,
        setThemeColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }

  return context
}
