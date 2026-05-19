/**
 * Status filter tab bar with animated active indicator.
 */
import React from 'react'
import { motion } from 'framer-motion'

const tabs = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/8">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            active === tab.value ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {active === tab.value && (
            <motion.div
              layoutId="filterTab"
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/15 rounded-lg border border-cyan-500/20"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
