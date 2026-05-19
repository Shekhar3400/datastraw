/**
 * Landing / Hero page with Three.js 3D scene, feature highlights, and CTA.
 */
import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Shield, BarChart3, MessageSquare, Star, ChevronDown } from 'lucide-react'
import HeroScene from '../components/HeroScene'

const features = [
  { icon: Zap, title: 'Instant Ticketing', desc: 'Auto-generate unique ticket IDs and route issues in milliseconds.' },
  { icon: Shield, title: 'Priority Control', desc: 'Tag tickets as low, medium, high, or urgent for smart triage.' },
  { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time dashboards with animated counters and trend charts.' },
  { icon: MessageSquare, title: 'Team Notes', desc: 'Collaborate with internal notes and activity timelines per ticket.' },
]

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'API Response' },
  { value: '∞', label: 'Tickets Supported' },
  { value: '2026', label: 'Built for the Future' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Next-Gen Support Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black leading-tight mb-6"
            >
              Support that{' '}
              <span className="gradient-text">moves at</span>
              <br />
              <span className="gradient-text-pink">light speed</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg"
            >
              NexusDesk is a futuristic CRM built for teams that refuse to compromise.
              Manage tickets, track priorities, and delight customers — all from one holographic dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary flex items-center gap-2 text-base px-8 py-4"
              >
                Launch Dashboard
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/tickets/new')}
                className="btn-secondary flex items-center gap-2 text-base px-8 py-4"
              >
                Create Ticket
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-8"
            >
              <div className="flex -space-x-2">
                {['#06b6d4', '#7c3aed', '#f472b6', '#10b981'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-dark-900 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: c }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <span className="text-xs text-slate-500">Trusted by 500+ support teams</span>
            </motion.div>
          </div>

          {/* Right — 3D scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[500px] lg:h-[600px] relative"
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
              </div>
            }>
              <HeroScene />
            </Suspense>

            {/* Floating UI cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 left-0 glass border border-white/10 px-4 py-3 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">TKT-0042 Resolved</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-16 right-0 glass border border-white/10 px-4 py-3 rounded-xl"
            >
              <div className="text-xs text-slate-400 mb-1">Response Time</div>
              <div className="text-lg font-bold text-cyan-400">2.4 min avg</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/2 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black mb-4">
            Everything your team <span className="gradient-text">needs</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Built with the tools and workflows modern support teams actually use.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass border border-white/8 p-6 hover:border-cyan-500/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-cyan-400" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass border border-white/10 p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">
              Ready to <span className="gradient-text">launch?</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Start managing support tickets with a dashboard built for the future.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto"
            >
              Open Dashboard <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
