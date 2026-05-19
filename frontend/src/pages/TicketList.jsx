/**
 * All Tickets page — searchable, filterable, paginated list.
 */
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, SlidersHorizontal } from 'lucide-react'
import { useTickets } from '../hooks/useTickets'
import TicketCard from '../components/TicketCard'
import SearchBar from '../components/SearchBar'
import FilterTabs from '../components/FilterTabs'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import PageTransition from '../components/PageTransition'

const PRIORITY_OPTIONS = ['all', 'low', 'medium', 'high', 'urgent']

export default function TicketList() {
  const navigate = useNavigate()
  const { tickets, total, pages, loading, error, filters, updateFilters, setPage } = useTickets()

  const handleSearch = (search) => updateFilters({ search: search || undefined })
  const handleStatus = (status) => updateFilters({ status: status || undefined })
  const handlePriority = (priority) => updateFilters({ priority: priority === 'all' ? undefined : priority })

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">All Tickets</h1>
            <p className="text-sm text-slate-500">
              {loading ? 'Loading...' : `${total} ticket${total !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <button
            onClick={() => navigate('/tickets/new')}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={16} />
            New Ticket
          </button>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by ID, name, email, subject..."
            />
          </div>
          <FilterTabs
            active={filters.status || ''}
            onChange={handleStatus}
          />
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={14} className="text-slate-500" />
          <span className="text-xs text-slate-500 mr-1">Priority:</span>
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => handlePriority(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize
                ${(filters.priority === p || (!filters.priority && p === 'all'))
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="glass border border-red-500/20 p-4 rounded-xl text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass border border-white/5 p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="h-5 bg-white/5 rounded w-20" />
                  <div className="h-5 bg-white/5 rounded w-16" />
                </div>
                <div className="h-4 bg-white/5 rounded w-2/3 mb-2" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Ticket list */}
        {!loading && tickets.length === 0 && (
          <EmptyState
            type={filters.search ? 'search' : 'empty'}
            searchTerm={filters.search}
          />
        )}

        {!loading && tickets.length > 0 && (
          <>
            <div className="space-y-3">
              {tickets.map((t, i) => (
                <TicketCard key={t.ticket_id} ticket={t} index={i} />
              ))}
            </div>
            <Pagination
              page={filters.page}
              pages={pages}
              total={total}
              limit={filters.limit}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </PageTransition>
  )
}
