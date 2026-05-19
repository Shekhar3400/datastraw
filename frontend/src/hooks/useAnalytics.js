/**
 * Custom hook for fetching analytics data.
 */
import { useState, useEffect } from 'react'
import { ticketApi } from '../services/api'

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await ticketApi.analytics()
      setAnalytics(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return { analytics, loading, error, refetch: fetchAnalytics }
}
