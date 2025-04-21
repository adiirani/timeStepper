"use client"

import { useEffect, useRef } from "react"
import { useLevelContext } from "@/context/LevelContext"
import { useThemeContext } from "@/context/ThemeContext"

export default function OscilloscopeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { currentLevel } = useLevelContext()
  const { setThemeColors } = useThemeContext()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Theme configuration based on time period
    const themes = {
      1: {
        // Ancient Egypt - 3000 BCE
        particleColor: "rgba(255, 215, 0, 0.3)", // Gold
        accentColor: "#ffd700",
        gridColor: "rgba(255, 215, 0, 0.1)",
        bgColor: "rgba(0, 0, 0, 0.2)",
        particleCount: 150,
        particleShape: "circle",
      },
      2: {
        // Roman Empire - 100 CE
        particleColor: "rgba(220, 20, 60, 0.3)", // Crimson
        accentColor: "#dc143c",
        gridColor: "rgba(220, 20, 60, 0.1)",
        bgColor: "rgba(0, 0, 0, 0.2)",
        particleCount: 120,
        particleShape: "square",
      },
      3: {
        // Middle Ages - 1000 CE
        particleColor: "rgba(70, 130, 180, 0.3)", // Steel Blue
        accentColor: "#4682b4",
        gridColor: "rgba(70, 130, 180, 0.1)",
        bgColor: "rgba(0, 0, 0, 0.2)",
        particleCount: 100,
        particleShape: "cross",
      },
      4: {
        // Renaissance - 1500 CE
        particleColor: "rgba(139, 69, 19, 0.3)", // Saddle Brown
        accentColor: "#8b4513",
        gridColor: "rgba(139, 69, 19, 0.1)",
        bgColor: "rgba(0, 0, 0, 0.2)",
        particleCount: 180,
        particleShape: "star",
      },
      5: {
        // Industrial Revolution - 1800 CE
        particleColor: "rgba(169, 169, 169, 0.3)", // Dark Gray
        accentColor: "#a9a9a9",
        gridColor: "rgba(169, 169, 169, 0.1)",
        bgColor: "rgba(0, 0, 0, 0.2)",
        particleCount: 200,
        particleShape: "gear",
      },
      6: {
        // Information Age - 1970 CE
        particleColor: "rgba(0, 255, 0, 0.3)", // Green (original)
        accentColor: "#00ff00",
        gridColor: "rgba(0, 255, 0, 0.1)",
        bgColor: "rgba(0, 0, 0, 0.1)",
        particleCount: 150,
        particleShape: "circle",
      },
      7: {
        // Future - 2100 CE
        particleColor: "rgba(138, 43, 226, 0.3)", // Blue Violet
        accentColor: "#8a2be2",
        gridColor: "rgba(138, 43, 226, 0.1)",
        bgColor: "rgba(0, 0, 0, 0.2)",
        particleCount: 250,
        particleShape: "quantum",
      },
    }

    // Get current theme
    const theme = themes[currentLevel as keyof typeof themes] || themes[1]

    // Update theme context
    setThemeColors({
      accent: theme.accentColor,
      particle: theme.particleColor.replace("0.3", "1"),
      background: "#000000",
    })

    // Particle system
    const particles: Particle[] = []
    const particleCount = theme.particleCount

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      brightness: number
      shape: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.brightness = Math.random() * 0.5 + 0.5
        this.shape = theme.particleShape
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.fillStyle = theme.particleColor.replace("0.3", (this.brightness * 0.3).toString())

        switch (this.shape) {
          case "square":
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
            break
          case "cross":
            ctx.beginPath()
            ctx.moveTo(this.x - this.size, this.y)
            ctx.lineTo(this.x + this.size, this.y)
            ctx.moveTo(this.x, this.y - this.size)
            ctx.lineTo(this.x, this.y + this.size)
            ctx.strokeStyle = theme.particleColor.replace("0.3", (this.brightness * 0.3).toString())
            ctx.stroke()
            break
          case "star":
            const spikes = 5
            const outerRadius = this.size
            const innerRadius = this.size / 2

            ctx.beginPath()
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius
              const angle = (Math.PI * i) / spikes
              ctx.lineTo(this.x + radius * Math.cos(angle), this.y + radius * Math.sin(angle))
            }
            ctx.closePath()
            ctx.fill()
            break
          case "gear":
            const teeth = 8
            const radius = this.size

            ctx.beginPath()
            for (let i = 0; i < teeth; i++) {
              const angle = (Math.PI * 2 * i) / teeth
              ctx.lineTo(this.x + radius * 1.5 * Math.cos(angle), this.y + radius * 1.5 * Math.sin(angle))
              const angle2 = (Math.PI * 2 * (i + 0.5)) / teeth
              ctx.lineTo(this.x + radius * Math.cos(angle2), this.y + radius * Math.sin(angle2))
            }
            ctx.closePath()
            ctx.fill()
            break
          case "quantum":
            // Draw a particle with a "quantum" effect (circles with rings)
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()

            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
            ctx.strokeStyle = theme.particleColor.replace("0.3", (this.brightness * 0.15).toString())
            ctx.stroke()
            break
          case "circle":
          default:
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
            break
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Grid lines
    const drawGrid = () => {
      ctx.strokeStyle = theme.gridColor
      ctx.lineWidth = 1

      // Horizontal lines
      const gridSize = 30
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Add time period specific grid elements
      if (currentLevel === 1) {
        // Ancient Egypt
        // Add hieroglyphic-like symbols at grid intersections
        for (let x = gridSize; x < canvas.width; x += gridSize * 3) {
          for (let y = gridSize; y < canvas.height; y += gridSize * 3) {
            const symbolType = Math.floor(Math.random() * 4)
            ctx.strokeStyle = theme.gridColor.replace("0.1", "0.2")

            switch (symbolType) {
              case 0: // Eye of Horus-like
                ctx.beginPath()
                ctx.ellipse(x, y, gridSize / 2, gridSize / 4, 0, 0, Math.PI * 2)
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(x, y, gridSize / 8, 0, Math.PI * 2)
                ctx.fill()
                break
              case 1: // Ankh-like
                ctx.beginPath()
                ctx.moveTo(x, y - gridSize / 2)
                ctx.lineTo(x, y + gridSize / 3)
                ctx.moveTo(x - gridSize / 3, y - gridSize / 4)
                ctx.lineTo(x + gridSize / 3, y - gridSize / 4)
                ctx.stroke()
                break
              case 2: // Pyramid-like
                ctx.beginPath()
                ctx.moveTo(x, y - gridSize / 2)
                ctx.lineTo(x - gridSize / 2, y + gridSize / 2)
                ctx.lineTo(x + gridSize / 2, y + gridSize / 2)
                ctx.closePath()
                ctx.stroke()
                break
              case 3: // Wave-like
                ctx.beginPath()
                ctx.moveTo(x - gridSize / 2, y)
                for (let i = 0; i < 3; i++) {
                  ctx.quadraticCurveTo(
                    x - gridSize / 4 + (i * gridSize) / 2,
                    y - gridSize / 4,
                    x + (i * gridSize) / 2,
                    y,
                  )
                }
                ctx.stroke()
                break
            }
          }
        }
      } else if (currentLevel === 2) {
        // Roman Empire
        // Add Roman numerals at grid intersections
        const romanNumerals = ["I", "V", "X", "L", "C", "D", "M"]
        ctx.font = `${gridSize / 2}px serif`
        ctx.fillStyle = theme.gridColor.replace("0.1", "0.2")

        for (let x = gridSize * 2; x < canvas.width; x += gridSize * 4) {
          for (let y = gridSize * 2; y < canvas.height; y += gridSize * 4) {
            const numeral = romanNumerals[Math.floor(Math.random() * romanNumerals.length)]
            ctx.fillText(numeral, x - gridSize / 4, y + gridSize / 4)
          }
        }

        // Add column-like structures
        for (let x = gridSize * 8; x < canvas.width; x += gridSize * 8) {
          ctx.strokeStyle = theme.gridColor.replace("0.1", "0.15")
          ctx.lineWidth = 2

          for (let y = 0; y < canvas.height; y += canvas.height - gridSize) {
            ctx.beginPath()
            ctx.moveTo(x - gridSize, y)
            ctx.lineTo(x + gridSize, y)
            ctx.stroke()

            // Column body
            ctx.beginPath()
            ctx.moveTo(x - gridSize / 2, 0)
            ctx.lineTo(x - gridSize / 2, canvas.height)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(x + gridSize / 2, 0)
            ctx.lineTo(x + gridSize / 2, canvas.height)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    let animationId: number
    let lastTime = 0

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      ctx.fillStyle = theme.bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGrid()

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [currentLevel, setThemeColors]) // Re-run effect when currentLevel changes

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ filter: "blur(1px)" }} />
}
