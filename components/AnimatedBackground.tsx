'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Gradient mesh animation
    let animationFrame: number
    let time = 0

    const colors = [
      { r: 0, g: 212, b: 255, a: 0.15 },    // Cyber blue
      { r: 99, g: 102, b: 241, a: 0.12 },   // Deep purple
      { r: 59, g: 130, b: 246, a: 0.13 },   // Neon blue
      { r: 16, g: 185, b: 129, a: 0.10 },   // Emerald accent
    ]

    const animate = () => {
      time += 0.002

      // Create gradient meshes
      const gradient1 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.sin(time) * 0.3),
        canvas.height * (0.5 + Math.cos(time) * 0.3),
        0,
        canvas.width * (0.5 + Math.sin(time) * 0.3),
        canvas.height * (0.5 + Math.cos(time) * 0.3),
        canvas.width * 0.5
      )

      gradient1.addColorStop(0, `rgba(${colors[0].r}, ${colors[0].g}, ${colors[0].b}, ${colors[0].a})`)
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)')

      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.3 + Math.cos(time * 1.3) * 0.3),
        canvas.height * (0.7 + Math.sin(time * 1.3) * 0.3),
        0,
        canvas.width * (0.3 + Math.cos(time * 1.3) * 0.3),
        canvas.height * (0.7 + Math.sin(time * 1.3) * 0.3),
        canvas.width * 0.4
      )

      gradient2.addColorStop(0, `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, ${colors[1].a})`)
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)')

      const gradient3 = ctx.createRadialGradient(
        canvas.width * (0.7 + Math.sin(time * 0.8) * 0.3),
        canvas.height * (0.3 + Math.cos(time * 0.8) * 0.3),
        0,
        canvas.width * (0.7 + Math.sin(time * 0.8) * 0.3),
        canvas.height * (0.3 + Math.cos(time * 0.8) * 0.3),
        canvas.width * 0.45
      )

      gradient3.addColorStop(0, `rgba(${colors[2].r}, ${colors[2].g}, ${colors[2].b}, ${colors[2].a})`)
      gradient3.addColorStop(1, 'rgba(0, 0, 0, 0)')

      // Clear and draw
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ filter: 'blur(100px)' }}
    />
  )
}
