/**
 * Animated statistics card with counter animation and neon glow.
 */
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const frameRef = useRef()

  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const start = performance.now()
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return count
}

export default function StatCard({ title, value, icon: Icon, color, gradient, delay = 0 }) {
  const count = useCountUp(value ?? 0)

  const colorMap = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/20 text-pink-400',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400',
  }

  const glowMap = {
    cyan: '0 0 30px rgba(0,212,255,0.15)',
    amber: '0 0 30px rgba(245,158,11,0.15)',
    emerald: '0 0 30px rgba(16,185,129,0.15)',
    purple: '0 0 30px rgba(124,58,237,0.15)',
    pink: '0 0 30px rgba(244,114,182,0.15)',
    orange: '0 0 30px rgba(249,115,22,0.15)',
  }

  const classes = colorMap[color] || colorMap.cyan

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, boxShadow: glowMap[color] }}
      className={`glass border bg-gradient-to-br ${classes} p-5 cursor-default transition-all duration-300`}
      style={{ boxShadow: 'none' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient || 'from-cyan-500 to-blue-600'} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-white tabular-nums">{count}</div>
        </div>
      </div>
      <p className="text-sm text-slate-400 font-medium">{title}</p>
    </motion.div>
  )
}
