import { useEffect } from 'react'
import { motion } from 'framer-motion'

function ConfettiEffect({ show, onComplete, duration = 3000 }) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, duration)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete, duration])

  if (!show) return null

  const confettiColors = [
    '#10b981', '#059669', '#34d399', '#6ee7b7', 
    '#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6'
  ]

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    size: Math.random() * 10 + 5,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.5,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute top-0"
          style={{
            left: `${piece.x}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
          initial={{
            y: -20,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [1, 1, 0],
            rotate: piece.rotation * 3,
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
          }}
          transition={{
            duration: duration / 1000,
            delay: piece.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

export default ConfettiEffect
