/**
 * Ticket Detail page — full ticket info, status update, notes/comments.
 */
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ChevronLeft, Clock, User, Mail, Tag, MessageSquare,
  Send, Edit3, Trash2, CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react'
import { ticketApi } from '../services/api'
import PageTransition from '../components/PageTransition'
import Modal from '../components/Modal'

const STATUS_OPTIONS = ['open', 'in_progress', 'closed']
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent']

function formatDate(d) {
  return new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function TicketDetail() {
  const { ticketId } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [noteAuthor, setNoteAuthor] = useState('Support Agent')
  const [addingNote, setAddingNote] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editStatus, setEditStatus] = useState(null)
  const [editPriority, setEditPriority] = useState(null)

  const fetchTicket = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await ticketApi.getById(ticketId)
      setTicket(data)
      setEditStatus(data.status)
      setEditPriority(data.priority)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTicket() }, [ticketId])

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const { data } = await ticketApi.update(ticketId, {
        status: editStatus,
        priority: editPriority,
      })
      setTicket(data)
      toast.success('Ticket updated successfully')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!noteText.trim()) return
    setAddingNote(true)
    try {
      const { data } = await ticketApi.update(ticketId, {
        note: { note_text: noteText.trim(), author: noteAuthor.trim() || 'Support Agent' },
      })
      setTicket(data)
      setNoteText('')
      toast.success('Note added')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setAddingNote(false)
    }
  }

  const handleDelete = async () => {
    try {
      await ticketApi.delete(ticketId)
      toast.success('Ticket deleted')
      navigate('/tickets')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-cyan-500 animate-spin" />
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="p-8 text-center">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
        <p className="text-slate-400 mb-4">{error || 'Ticket not found'}</p>
        <button onClick={() => navigate('/tickets')} className="btn-secondary">
          Back to Tickets
        </button>
      </div>
    )
  }

  const hasChanges = editStatus !== ticket.status || editPriority !== ticket.priority

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/tickets')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {ticket.ticket_id}
                </span>
                <span className={`badge-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
                <span className={`badge-${ticket.priority}`}>{ticket.priority}</span>
              </div>
              <h1 className="text-xl font-bold text-white">{ticket.subject}</h1>
            </div>
          </div>
          <button
            onClick={() => setDeleteModal(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Description */}
            <div className="glass border border-white/8 p-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Tag size={14} className="text-cyan-400" /> Description
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Notes / Activity */}
            <div className="glass border border-white/8 p-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <MessageSquare size={14} className="text-purple-400" />
                Notes & Activity
                <span className="ml-auto text-xs text-slate-600 font-normal">{ticket.notes.length} note{ticket.notes.length !== 1 ? 's' : ''}</span>
              </h2>

              {/* Notes list */}
              <div className="space-y-4 mb-6">
                <AnimatePresence>
                  {ticket.notes.length === 0 ? (
                    <p className="text-slate-600 text-sm text-center py-4">No notes yet. Add the first one below.</p>
                  ) : (
                    ticket.notes.map((note, i) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {note.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 bg-white/3 border border-white/8 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-300">{note.author}</span>
                            <span className="text-xs text-slate-600">{formatDate(note.created_at)}</span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">{note.note_text}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Add note form */}
              <form onSubmit={handleAddNote} className="space-y-3">
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  placeholder="Your name"
                  className="input-field text-sm"
                />
                <div className="relative">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note or comment..."
                    rows={3}
                    className="input-field resize-none text-sm pr-12"
                  />
                  <button
                    type="submit"
                    disabled={!noteText.trim() || addingNote}
                    className="absolute right-3 bottom-3 w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {addingNote ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar — ticket meta + update */}
          <div className="space-y-4">
            {/* Customer info */}
            <div className="glass border border-white/8 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Customer</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                    {ticket.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{ticket.customer_name}</div>
                    <div className="text-xs text-slate-500">{ticket.customer_email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket meta */}
            <div className="glass border border-white/8 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Created', value: formatDate(ticket.created_at), icon: Clock },
                  { label: 'Updated', value: formatDate(ticket.updated_at), icon: Edit3 },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon size={13} className="text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-slate-600">{label}</div>
                      <div className="text-slate-400 text-xs">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Update status/priority */}
            <div className="glass border border-white/8 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Update Ticket</h3>

              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="text-xs text-slate-500 mb-2 block">Status</label>
                  <div className="space-y-1.5">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setEditStatus(s)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize
                          ${editStatus === s
                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                          }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          s === 'open' ? 'bg-cyan-400' :
                          s === 'in_progress' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs text-slate-500 mb-2 block">Priority</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setEditPriority(p)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                          ${editPriority === p
                            ? `badge-${p}`
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={!hasChanges || updating}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-2.5 disabled:opacity-40"
                >
                  {updating ? (
                    <><Loader2 size={13} className="animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle2 size={13} /> Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Ticket" size="sm">
        <p className="text-slate-400 text-sm mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">{ticket.ticket_id}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteModal(false)} className="btn-secondary text-sm py-2">Cancel</button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
          >
            Delete
          </button>
        </div>
      </Modal>
    </PageTransition>
  )
}
