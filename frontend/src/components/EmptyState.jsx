/**
 * Beautiful empty state component for when no tickets are found.
 */
import React from 'react'
import { motion } from 'framer-motion'
import { Inbox, Search, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function EmptyState({ type = 'empty', searchTerm = '' }) {
  const navigate = useNavigate()

  const config = {
    empty: {
      icon: Inbox,
      title: 'No tickets yet',
      description: 'Your support queue is clear. Create the first ticket to get started.',
      action: { label: 'Create Ticket', onClick: () => navigate('/tickets/new') },
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: `No tickets match "${searchTerm}". Try a different search term or clear the filter.`,
      action: null,
    },
  }

  const { icon: Icon, title, description, action } = config[type] || config.empty

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Animated icon container */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center mb-6"
      >
        <Icon size={32} className="text-slate-500" />
      </motion.div>

      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>

      {action && (
        <button onClick={action.onClick} className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} />
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
