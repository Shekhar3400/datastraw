/**
 * Analytics page — charts, stats, and ticket distribution visualisations.
 */
import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { TrendingUp, Ticket, AlertCircle, Clock, CheckCircle2, Flame, Zap } from 'lucide-react'
import StatCard from '../components/StatCard'
import PageTransition from '../components/PageTransition'
import { useAnalytics } from '../hooks/useAnalytics'
import { useTickets } from '../hooks/useTickets'

const COLORS = {
  open: '#00d4ff',
  in_progress: '#f59e0b',
  closed: '#10b981',
  low: '#64748b',
  medium: '#3b82f6',
  high: '#f97316',
  urgent: '#ef4444',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass border border-white/10 px-3 py-2 text-xs">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { analytics, loading } = useAnalytics()
  const { tickets } = useTickets({ limit: 100 })

  // Build status distribution for pie chart
  const statusData = analytics ? [
    { name: 'Open', value: analytics.open, color: COLORS.open },
    { name: 'In Progress', value: analytics.in_progress, color: COLORS.in_progress },
    { name: 'Closed', value: analytics.closed, color: COLORS.closed },
  ] : []

  // Build priority distribution
  const priorityData = tickets.reduce((acc, t) => {
    const existing = acc.find((a) => a.name === t.priority)
    if (existing) existing.value++
    else acc.push({ name: t.priority, value: 1, color: COLORS[t.priority] })
    return acc
  }, [])

  // Build tickets per day (last 7 days)
  const dailyData = (() => {
    const days = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      days[key] = { date: key, open: 0, closed: 0, in_progress: 0 }
    }
    tickets.forEach((t) => {
      const key = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (days[key]) days[key][t.status] = (days[key][t.status] || 0) + 1
    })
    return Object.values(days)
  })()

  const stats = [
    { title: 'Total Tickets', value: analytics?.total ?? 0, icon: Ticket, color: 'cyan', gradient: 'from-cyan-500 to-blue-600', delay: 0 },
    { title: 'Open', value: analytics?.open ?? 0, icon: AlertCircle, color: 'amber', gradient: 'from-amber-500 to-orange-600', delay: 0.1 },
    { title: 'In Progress', value: analytics?.in_progress ?? 0, icon: Clock, color: 'purple', gradient: 'from-purple-500 to-violet-600', delay: 0.2 },
    { title: 'Closed', value: analytics?.closed ?? 0, icon: CheckCircle2, color: 'emerald', gradient: 'from-emerald-500 to-teal-600', delay: 0.3 },
    { title: 'High Priority', value: analytics?.high_priority ?? 0, icon: Flame, color: 'orange', gradient: 'from-orange-500 to-red-600', delay: 0.4 },
    { title: 'Urgent', value: analytics?.urgent_priority ?? 0, icon: Zap, color: 'pink', gradient: 'from-pink-500 to-rose-600', delay: 0.5 },
  ]

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-3">
            <TrendingUp size={24} className="text-cyan-400" />
            Analytics
          </h1>
          <p className="text-sm text-slate-500">Real-time ticket metrics and trends.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Bar chart — daily tickets */}
          <div className="lg:col-span-2 glass border border-white/8 p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-6">Tickets — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
                <Bar dataKey="open" name="Open" fill={COLORS.open} radius={[4, 4, 0, 0]} />
                <Bar dataKey="in_progress" name="In Progress" fill={COLORS.in_progress} radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" name="Closed" fill={COLORS.closed} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — status */}
          <div className="glass border border-white/8 p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-6">Status Distribution</h3>
            {analytics?.total === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-600 text-sm">No data yet</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {statusData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-slate-400">{d.name}</span>
                      </div>
                      <span className="text-slate-500">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Priority distribution */}
        <div className="glass border border-white/8 p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-6">Priority Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['low', 'medium', 'high', 'urgent'].map((p) => {
              const count = tickets.filter((t) => t.priority === p).length
              const pct = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0
              return (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-4 rounded-xl bg-white/3 border border-white/8"
                >
                  <div className="text-2xl font-black mb-1" style={{ color: COLORS[p] }}>{count}</div>
                  <div className="text-xs text-slate-500 capitalize mb-2">{p}</div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: COLORS[p] }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{pct}%</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
