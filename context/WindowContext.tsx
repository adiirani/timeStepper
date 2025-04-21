"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface WindowContextType {
  visibleWindows: string[]
  windowOrder: string[]
  toggleWindowVisibility: (id: string) => void
  bringToFront: (id: string) => void
}

const WindowContext = createContext<WindowContextType | undefined>(undefined)

export function WindowProvider({ children }: { children: ReactNode }) {
  const [visibleWindows, setVisibleWindows] = useState<string[]>(["code", "input-output", "reverser", "hints"])

  const [windowOrder, setWindowOrder] = useState<string[]>(["code", "input-output", "reverser", "hints"])

  const toggleWindowVisibility = (id: string) => {
    setVisibleWindows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((windowId) => windowId !== id)
      } else {
        bringToFront(id)
        return [...prev, id]
      }
    })
  }

  const bringToFront = (id: string) => {
    setWindowOrder((prev) => {
      const newOrder = prev.filter((windowId) => windowId !== id)
      return [...newOrder, id]
    })
  }

  return (
    <WindowContext.Provider
      value={{
        visibleWindows,
        windowOrder,
        toggleWindowVisibility,
        bringToFront,
      }}
    >
      {children}
    </WindowContext.Provider>
  )
}

export function useWindowContext() {
  const context = useContext(WindowContext)

  if (context === undefined) {
    throw new Error("useWindowContext must be used within a WindowProvider")
  }

  return context
}
