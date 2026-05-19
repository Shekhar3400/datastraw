/**
 * Create Ticket page — form with validation and animated feedback.
 */
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Send, User, Mail, Tag, FileText, AlertTriangle, ChevronLeft } from 'lucide-react'
import { ticketApi } from '../services/api'
import PageTransition from '../components/PageTransition'

const PRIORITIES = ['low', 'medium', 'high', 'urgent']

const priorityColors = {
  low: 'border-slate-500/40 text-slate-400 bg-slate-500/10',
  medium: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
  high: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
  urgent: 'border-red-500/40 text-red-400 bg-red-500/10',
}

export default function CreateTicket() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 'medium',
  })

  const validate = () => {
    const e = {}
    if (!form.customer_name.trim()) e.customer_name = 'Name is required'
    if (!form.customer_email.trim()) e.customer_email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) e.customer_email = 'Invalid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.description.trim()) e.description = 'Description is required'
    else if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const { data } = await ticketApi.create(form)
      toast.success(`Ticket ${data.ticket_id} created successfully!`)
      navigate(`/tickets/${data.ticket_id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, icon: Icon, error, children }) => (
    <div>
      <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
        <Icon size={12} />
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-xs text-red-400 mt-1.5"
        >
          <AlertTriangle size={11} /> {error}
        </motion.p>
      )}
    </div>
  )

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">Create Ticket</h1>
            <p className="text-sm text-slate-500">Fill in the details to open a new support ticket.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="glass border border-white/8 p-6 lg:p-8 space-y-6">
            {/* Customer info row */}
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Customer Name" icon={User} error={errors.customer_name}>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={handleChange('customer_name')}
                  placeholder="Jane Smith"
                  className={`input-field ${errors.customer_name ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
                />
              </Field>

              <Field label="Customer Email" icon={Mail} error={errors.customer_email}>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={handleChange('customer_email')}
                  placeholder="jane@company.com"
                  className={`input-field ${errors.customer_email ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
                />
              </Field>
            </div>

            {/* Subject */}
            <Field label="Subject" icon={Tag} error={errors.subject}>
              <input
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                placeholder="Brief description of the issue"
                className={`input-field ${errors.subject ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
              />
            </Field>

            {/* Description */}
            <Field label="Description" icon={FileText} error={errors.description}>
              <textarea
                value={form.description}
                onChange={handleChange('description')}
                placeholder="Provide a detailed description of the issue, steps to reproduce, and any relevant context..."
                rows={6}
                className={`input-field resize-none ${errors.description ? 'border-red-500/50 focus:border-red-500/70' : ''}`}
              />
              <div className="text-right text-xs text-slate-600 mt-1">
                {form.description.length} / 5000
              </div>
            </Field>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
                <AlertTriangle size={12} />
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 capitalize
                      ${form.priority === p
                        ? priorityColors[p]
                        : 'border-white/10 text-slate-500 bg-transparent hover:border-white/20 hover:text-slate-300'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  )
}
