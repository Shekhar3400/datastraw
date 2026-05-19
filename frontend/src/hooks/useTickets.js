/**
 * Custom hook for fetching and managing the ticket list.
 * Handles loading, error, pagination, and filter state.
 */
import { useState, useEffect, useCallback } from 'react'
import { ticketApi } from '../services/api'

export function useTickets(initialFilters = {}) {
  const [tickets, setTickets] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ page: 1, limit: 20, ...initialFilters })

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await ticketApi.list(filters)
      setTickets(data.data)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const setPage = (page) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  return { tickets, total, pages, loading, error, filters, updateFilters, setPage, refetch: fetchTickets }
}
