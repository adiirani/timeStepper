"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { X, Minus } from "lucide-react"
import { useWindowContext } from "@/context/WindowContext"
import { useThemeContext } from "@/context/ThemeContext"

interface DraggableWindowProps {
  id: string
  title: string
  children: ReactNode
  initialPosition?: { x: number; y: number }
  initialWidth?: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
}

export default function DraggableWindow({
  id,
  title,
  children,
  initialPosition = { x: 50, y: 50 },
  initialWidth = 500,
  initialHeight = 400,
  minWidth = 300,
  minHeight = 200,
}: DraggableWindowProps) {
  const { visibleWindows, toggleWindowVisibility, bringToFront, windowOrder } = useWindowContext()
  const { themeColors } = useThemeContext()
  const [position, setPosition] = useState(initialPosition)
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight })
  const [resizing, setResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const resizeStartPos = useRef({ x: 0, y: 0 })
  const resizeStartDim = useRef({ width: 0, height: 0 })
  const dragStartPos = useRef({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    bringToFront(id)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }

    // Bring window to front
    bringToFront(id)
  }

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return

    setPosition({
      x: Math.max(0, e.clientX - dragStartPos.current.x),
      y: Math.max(0, e.clientY - dragStartPos.current.y),
    })
  }

  const stopDrag = () => {
    setIsDragging(false)
  }

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setResizing(true)
    resizeStartPos.current = { x: e.clientX, y: e.clientY }
    resizeStartDim.current = { ...dimensions }
  }

  const handleResize = (e: MouseEvent) => {
    if (!resizing) return

    const deltaX = e.clientX - resizeStartPos.current.x
    const deltaY = e.clientY - resizeStartPos.current.y

    const newWidth = Math.max(resizeStartDim.current.width + deltaX, minWidth)
    const newHeight = Math.max(resizeStartDim.current.height + deltaY, minHeight)

    setDimensions({ width: newWidth, height: newHeight })
  }

  const stopResize = () => {
    setResizing(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDrag)
      document.addEventListener("mouseup", stopDrag)
    } else {
      document.removeEventListener("mousemove", handleDrag)
      document.removeEventListener("mouseup", stopDrag)
    }

    return () => {
      document.removeEventListener("mousemove", handleDrag)
      document.removeEventListener("mouseup", stopDrag)
    }
  }, [isDragging])

  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleResize)
      document.addEventListener("mouseup", stopResize)
    } else {
      document.removeEventListener("mousemove", handleResize)
      document.removeEventListener("mouseup", stopResize)
    }

    return () => {
      document.removeEventListener("mousemove", handleResize)
      document.removeEventListener("mouseup", stopResize)
    }
  }, [resizing])

  if (!visibleWindows.includes(id)) {
    return null
  }

  const zIndex = 100 + windowOrder.indexOf(id)

  // Generate dynamic styles based on theme colors
  const headerBgColor = themeColors.accent.replace("#", "rgba(") + ", 0.3)"

  return (
    <div
      ref={windowRef}
      className="absolute rounded-lg shadow-lg overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
        zIndex,
        opacity: isDragging ? 0.7 : 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${themeColors.accent}`,
        boxShadow: `0 0 15px rgba(0, 0, 0, 0.3), 0 0 5px ${themeColors.accent}40`,
        cursor: isDragging ? "grabbing" : "auto",
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="flex items-center justify-between px-4 py-2 cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: headerBgColor,
          borderBottom: `1px solid ${themeColors.accent}`,
        }}
        onMouseDown={handleDragStart}
      >
        <h3 style={{ color: themeColors.accent }} className="font-bold">
          {title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => toggleWindowVisibility(id)}
            style={{ color: themeColors.accent }}
            className="hover:opacity-70"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => toggleWindowVisibility(id)}
            style={{ color: themeColors.accent }}
            className="hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 h-[calc(100%-40px)] overflow-auto">{children}</div>

      <div className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize" onMouseDown={startResize}>
        <div
          className="absolute bottom-1 right-1 w-3 h-3"
          style={{
            borderRight: `2px solid ${themeColors.accent}`,
            borderBottom: `2px solid ${themeColors.accent}`,
          }}
        />
      </div>
    </div>
  )
}
