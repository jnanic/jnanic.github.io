'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * ANIMATION OPTIONS FOR "YASH SHARMA"
 * 
 * 1. MATRIX_DECODE - Characters cascade down and lock into place (Matrix-style)
 * 2. WAVE_REVEAL - Letters wave in from bottom with staggered bounce
 * 3. HOLOGRAM_FLICKER - Futuristic hologram effect with scan lines
 * 4. PIXEL_ASSEMBLE - Pixelated blocks coalesce into letters
 * 5. NEON_GLOW - Letters fade in with electric neon glow pulse
 * 6. TYPEWRITER_MODERN - Smooth typewriter with cursor, modern timing
 * 7. MAGNETIC_PULL - Letters fly in from random positions and snap together
 * 8. GLITCH_CYBER - Fast glitch iterations before revealing (cyber aesthetic)
 */

type AnimationStyle = 
  | 'MATRIX_DECODE' 
  | 'WAVE_REVEAL' 
  | 'HOLOGRAM_FLICKER' 
  | 'PIXEL_ASSEMBLE' 
  | 'NEON_GLOW'
  | 'TYPEWRITER_MODERN'
  | 'MAGNETIC_PULL'
  | 'GLITCH_CYBER'

interface AnimatedNameProps {
  text: string
  style?: AnimationStyle
  onComplete?: () => void
}

// OPTION 1: MATRIX_DECODE
const MatrixDecode = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState<string[]>(Array(text.length).fill(''))
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'
  
  useEffect(() => {
    const delays = text.split('').map((_, i) => i * 80)
    
    text.split('').forEach((char, index) => {
      if (char === ' ') {
        setTimeout(() => {
          setDisplayText(prev => {
            const newText = [...prev]
            newText[index] = ' '
            return newText
          })
        }, delays[index])
        return
      }

      // Cascade effect
      let iterations = 0
      const maxIterations = 8
      const interval = setInterval(() => {
        setDisplayText(prev => {
          const newText = [...prev]
          newText[index] = chars[Math.floor(Math.random() * chars.length)]
          return newText
        })
        
        iterations++
        if (iterations >= maxIterations) {
          clearInterval(interval)
          setDisplayText(prev => {
            const newText = [...prev]
            newText[index] = char
            if (index === text.length - 1) onComplete?.()
            return newText
          })
        }
      }, 50)
    })
  }, [text, onComplete])

  return (
    <span className="font-mono">
      {displayText.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-block text-gradient"
        >
          {char || '\u00A0'}
        </motion.span>
      ))}
    </span>
  )
}

// OPTION 2: WAVE_REVEAL
const WaveReveal = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  return (
    <span>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 50, opacity: 0, rotateX: 90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            delay: i * 0.05,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          onAnimationComplete={() => {
            if (i === text.length - 1) onComplete?.()
          }}
          className="inline-block text-gradient"
          style={{ transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// OPTION 3: HOLOGRAM_FLICKER
const HologramFlicker = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [phase, setPhase] = useState(0)
  
  useEffect(() => {
    const phases = [0, 1, 0, 1, 0, 2]
    let currentPhase = 0
    
    const interval = setInterval(() => {
      currentPhase++
      if (currentPhase >= phases.length) {
        clearInterval(interval)
        setPhase(2)
        onComplete?.()
      } else {
        setPhase(phases[currentPhase])
      }
    }, 150)
    
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.span
      className="relative inline-block text-gradient"
      animate={{
        opacity: phase === 2 ? 1 : [0.3, 1, 0.3],
        textShadow: phase === 2 
          ? '0 0 20px rgba(0, 212, 255, 0.5)' 
          : [
              '0 0 30px rgba(0, 212, 255, 0.8)',
              '0 0 10px rgba(0, 212, 255, 0.3)',
              '0 0 30px rgba(0, 212, 255, 0.8)',
            ]
      }}
      transition={{ duration: 0.1 }}
    >
      {text}
      {phase < 2 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ mixBlendMode: 'overlay' }}
        />
      )}
    </motion.span>
  )
}

// OPTION 4: PIXEL_ASSEMBLE
const PixelAssemble = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [pixelPhase, setPixelPhase] = useState(0)
  
  useEffect(() => {
    const timer1 = setTimeout(() => setPixelPhase(1), 400)
    const timer2 = setTimeout(() => setPixelPhase(2), 800)
    const timer3 = setTimeout(() => {
      setPixelPhase(3)
      onComplete?.()
    }, 1200)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <motion.span
      className="inline-block text-gradient relative"
      style={{
        filter: pixelPhase < 3 ? `blur(${4 - pixelPhase}px)` : 'none',
        textShadow: pixelPhase < 3 
          ? `${Math.random() * 3}px ${Math.random() * 3}px 0 rgba(0, 212, 255, 0.5)` 
          : 'none'
      }}
      animate={{
        opacity: pixelPhase === 0 ? 0 : 1,
        scale: [0.95, 1.02, 1],
      }}
      transition={{ duration: 0.3 }}
    >
      {text}
    </motion.span>
  )
}

// OPTION 5: NEON_GLOW
const NeonGlow = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  return (
    <span>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ 
            opacity: 1,
            filter: 'blur(0px)',
            textShadow: [
              '0 0 0px rgba(0, 212, 255, 0)',
              '0 0 30px rgba(0, 212, 255, 0.8)',
              '0 0 10px rgba(0, 212, 255, 0.4)',
            ]
          }}
          transition={{
            delay: i * 0.08,
            duration: 0.6,
            textShadow: {
              duration: 0.4,
              times: [0, 0.5, 1],
            }
          }}
          onAnimationComplete={() => {
            if (i === text.length - 1) onComplete?.()
          }}
          className="inline-block text-gradient"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// OPTION 6: TYPEWRITER_MODERN
const TypewriterModern = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setShowCursor(false)
          onComplete?.()
        }, 500)
      }
    }, 100)
    
    return () => clearInterval(typingInterval)
  }, [text, onComplete])

  return (
    <span className="text-gradient">
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-1 h-[1em] bg-cyber-blue-400 ml-1 align-text-bottom"
        />
      )}
    </span>
  )
}

// OPTION 7: MAGNETIC_PULL
const MagneticPull = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  return (
    <span>
      {text.split('').map((char, i) => {
        const randomX = (Math.random() - 0.5) * 200
        const randomY = (Math.random() - 0.5) * 200
        const randomRotate = (Math.random() - 0.5) * 180
        
        return (
          <motion.span
            key={i}
            initial={{ 
              x: randomX, 
              y: randomY, 
              opacity: 0,
              rotate: randomRotate,
              scale: 0.3,
            }}
            animate={{ 
              x: 0, 
              y: 0, 
              opacity: 1,
              rotate: 0,
              scale: 1,
            }}
            transition={{
              delay: i * 0.05,
              type: 'spring',
              stiffness: 150,
              damping: 12,
            }}
            onAnimationComplete={() => {
              if (i === text.length - 1) onComplete?.()
            }}
            className="inline-block text-gradient"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        )
      })}
    </span>
  )
}

// OPTION 8: GLITCH_CYBER (Improved Safari-compatible version)
const GlitchCyber = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(true)
  const glitchChars = '▓▒░█▀▄│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼'
  
  useEffect(() => {
    if (!isGlitching) return
    
    let glitchCount = 0
    const maxGlitches = 15
    
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map(char => 
          char === ' ' ? ' ' : (Math.random() > 0.5 ? char : glitchChars[Math.floor(Math.random() * glitchChars.length)])
        ).join('')
      )
      
      glitchCount++
      if (glitchCount >= maxGlitches) {
        clearInterval(interval)
        setDisplayText(text)
        setIsGlitching(false)
        setTimeout(() => onComplete?.(), 200)
      }
    }, 60)
    
    return () => clearInterval(interval)
  }, [text, isGlitching, onComplete])

  return (
    <motion.span
      className="inline-block text-gradient font-mono"
      animate={isGlitching ? {
        x: [0, -2, 2, -1, 1, 0],
        textShadow: [
          '0 0 0px rgba(0, 212, 255, 0)',
          '2px 0 0px rgba(0, 212, 255, 0.5), -2px 0 0px rgba(255, 0, 128, 0.5)',
          '0 0 0px rgba(0, 212, 255, 0)',
        ]
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  )
}

// Main component
export default function AnimatedName({ text, style = 'WAVE_REVEAL', onComplete }: AnimatedNameProps) {
  switch (style) {
    case 'MATRIX_DECODE':
      return <MatrixDecode text={text} onComplete={onComplete} />
    case 'WAVE_REVEAL':
      return <WaveReveal text={text} onComplete={onComplete} />
    case 'HOLOGRAM_FLICKER':
      return <HologramFlicker text={text} onComplete={onComplete} />
    case 'PIXEL_ASSEMBLE':
      return <PixelAssemble text={text} onComplete={onComplete} />
    case 'NEON_GLOW':
      return <NeonGlow text={text} onComplete={onComplete} />
    case 'TYPEWRITER_MODERN':
      return <TypewriterModern text={text} onComplete={onComplete} />
    case 'MAGNETIC_PULL':
      return <MagneticPull text={text} onComplete={onComplete} />
    case 'GLITCH_CYBER':
      return <GlitchCyber text={text} onComplete={onComplete} />
    default:
      return <span className="text-gradient">{text}</span>
  }
}
