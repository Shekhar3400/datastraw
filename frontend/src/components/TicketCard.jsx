/**
 * Individual ticket card for the list view.
 * Shows key info with status/priority badges and hover lift effect.
 */
import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock, User, Mail, ArrowRight } from 'lucide-react'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TicketCard({ ticket, index = 0 }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3, boxShadow: '0 8px 40px rgba(0,212,255,0.08)' }}
      onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
      className="glass border border-white/8 p-5 cursor-pointer transition-all duration-300 hover:border-cyan-500/20 group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Ticket ID + badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
              {ticket.ticket_id}
            </span>
            <span className={`badge-${ticket.status}`}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className={`badge-${ticket.priority}`}>
              {ticket.priority}
            </span>
          </div>

          {/* Subject */}
          <h3 className="font-semibold text-slate-100 text-sm mb-2 truncate group-hover:text-white transition-colors">
            {ticket.subject}
          </h3>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <User size={11} />
              {ticket.customer_name}
            </span>
            <span className="flex items-center gap-1">
              <Mail size={11} />
              {ticket.customer_email}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(ticket.created_at)}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight
          size={16}
          className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
        />
      </div>
    </motion.div>
  )
}
