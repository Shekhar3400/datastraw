/**
 * Main dashboard page — analytics cards, recent tickets, activity feed.
 */
import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Ticket, AlertCircle, Clock, CheckCircle2,
  TrendingUp, PlusCircle, ArrowRight, Flame, Zap,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import TicketCard from '../components/TicketCard'
import PageTransition from '../components/PageTransition'
import { useAnalytics } from '../hooks/useAnalytics'
import { useTickets } from '../hooks/useTickets'

export default function Dashboard() {
  const navigate = useNavigate()
  const { analytics, loading: aLoading } = useAnalytics()
  const { tickets: recent, loading: tLoading } = useTickets({ limit: 5 })

  const stats = [
    {
      title: 'Total Tickets',
      value: analytics?.total ?? 0,
      icon: Ticket,
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-600',
      delay: 0,
    },
    {
      title: 'Open',
      value: analytics?.open ?? 0,
      icon: AlertCircle,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      delay: 0.1,
    },
    {
      title: 'In Progress',
      value: analytics?.in_progress ?? 0,
      icon: Clock,
      color: 'purple',
      gradient: 'from-purple-500 to-violet-600',
      delay: 0.2,
    },
    {
      title: 'Closed',
      value: analytics?.closed ?? 0,
      icon: CheckCircle2,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      delay: 0.3,
    },
    {
      title: 'High Priority',
      value: analytics?.high_priority ?? 0,
      icon: Flame,
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      delay: 0.4,
    },
    {
      title: 'Urgent',
      value: analytics?.urgent_priority ?? 0,
      icon: Zap,
      color: 'pink',
      gradient: 'from-pink-500 to-rose-600',
      delay: 0.5,
    },
  ]

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-black text-white mb-1"
            >
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-slate-500"
            >
              Welcome back — here's what's happening today.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/tickets/new')}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={16} />
            New Ticket
          </motion.button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        {/* Recent tickets */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ticket list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-200">Recent Tickets</h2>
              <button
                onClick={() => navigate('/tickets')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            {tLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass border border-white/5 p-5 animate-pulse">
                    <div className="h-3 bg-white/5 rounded w-1/4 mb-3" />
                    <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="glass border border-white/5 p-10 text-center">
                <Ticket size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No tickets yet. Create your first one!</p>
                <button onClick={() => navigate('/tickets/new')} className="btn-primary mt-4 text-xs px-4 py-2">
                  Create Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recent.map((t, i) => (
                  <TicketCard key={t.ticket_id} ticket={t} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Quick actions + status breakdown */}
          <div className="space-y-4">
            {/* Quick actions */}
            <div className="glass border border-white/8 p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Create New Ticket', icon: PlusCircle, to: '/tickets/new', color: 'text-cyan-400' },
                  { label: 'View All Tickets', icon: Ticket, to: '/tickets', color: 'text-purple-400' },
                  { label: 'Analytics', icon: TrendingUp, to: '/analytics', color: 'text-emerald-400' },
                ].map(({ label, icon: Icon, to, color }) => (
                  <button
                    key={to}
                    onClick={() => navigate(to)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <Icon size={15} className={`${color} group-hover:scale-110 transition-transform`} />
                    {label}
                    <ArrowRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Status breakdown */}
            <div className="glass border border-white/8 p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Status Breakdown</h3>
              {aLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 bg-white/5 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: 'Open', value: analytics?.open ?? 0, total: analytics?.total ?? 1, color: 'bg-cyan-500' },
                    { label: 'In Progress', value: analytics?.in_progress ?? 0, total: analytics?.total ?? 1, color: 'bg-purple-500' },
                    { label: 'Closed', value: analytics?.closed ?? 0, total: analytics?.total ?? 1, color: 'bg-emerald-500' },
                  ].map(({ label, value, total, color }) => {
                    const pct = total > 0 ? Math.round((value / total) * 100) : 0
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{label}</span>
                          <span className="text-slate-500">{value} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                            className={`h-full ${color} rounded-full`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
