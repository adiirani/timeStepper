"use client"
import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import Taskbar from "@/components/Taskbar"
import CodeWindow from "@/components/windows/CodeWindow"
import InputOutputWindow from "@/components/windows/InputOutputWindow"
import ReverserWindow from "@/components/windows/ReverserWindow"
import HintsWindow from "@/components/windows/HintsWindow"
import OscilloscopeBackground from "@/components/OscilloscopeBackground"
import LevelIndicator from "@/components/LevelIndicator"
import MainMenu from "@/components/MainMenu"
import { WindowProvider } from "@/context/WindowContext"
import { LevelProvider } from "@/context/LevelContext"
import { ThemeProvider } from "@/context/ThemeContext"

export default function Home() {
  const [showMainMenu, setShowMainMenu] = useState(true)

  return (
    <DndProvider backend={HTML5Backend}>
      <LevelProvider>
        <ThemeProvider>
          <WindowProvider>
            <div className="relative h-screen w-screen overflow-hidden bg-black text-green-400 font-mono">
              <OscilloscopeBackground />

              <main className="relative z-10 h-full w-full">
                {showMainMenu ? (
                  <MainMenu onPlay={() => setShowMainMenu(false)} />
                ) : (
                  <>
                    <LevelIndicator onMenuClick={() => setShowMainMenu(true)} />

                    <div className="absolute inset-0 pt-12 pb-14">
                      <CodeWindow />
                      <InputOutputWindow />
                      <ReverserWindow />
                      <HintsWindow />
                    </div>

                    <Taskbar onMenuClick={() => setShowMainMenu(true)} />
                  </>
                )}
              </main>
            </div>
          </WindowProvider>
        </ThemeProvider>
      </LevelProvider>
    </DndProvider>
  )
}
