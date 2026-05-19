/**
 * Centralised API service using axios.
 * All requests go through this module so the base URL is configured once.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// ─── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
