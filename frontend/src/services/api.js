/**
 * Centralised API service using axios.
 * BASE_URL is read from VITE_API_BASE_URL env variable.
 * Trailing slash is stripped to avoid double-slash URLs.
 */
import axios from 'axios'

// Strip trailing slash so URLs like "https://api.railway.app/" don't break
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

// ─── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response) — backend unreachable
    if (!error.response) {
      return Promise.reject(new Error('Cannot reach the server. Check your backend URL.'))
    }
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// ─── Ticket endpoints ─────────────────────────────────────────────────────────

export const ticketApi = {
  /** Create a new ticket */
  create: (data) => api.post('/api/tickets', data),

  /** List tickets with optional filters */
  list: (params = {}) => api.get('/api/tickets', { params }),

  /** Get single ticket with notes */
  getById: (ticketId) => api.get(`/api/tickets/${ticketId}`),

  /** Update ticket status / priority / add note */
  update: (ticketId, data) => api.put(`/api/tickets/${ticketId}`, data),

  /** Delete a ticket */
  delete: (ticketId) => api.delete(`/api/tickets/${ticketId}`),

  /** Analytics summary */
  analytics: () => api.get('/api/tickets/analytics'),
}

export default api
