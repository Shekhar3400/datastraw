/**
 * Root application component.
 * Handles loading screen, routing, and layout.
 */
import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import LoadingScreen from './components/LoadingScreen'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CreateTicket from './pages/CreateTicket'
import TicketList from './pages/TicketList'
import TicketDetail from './pages/TicketDetail'
import Analytics from './pages/Analytics'

// Layout wrapper for authenticated/app pages (with sidebar)
function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const location = useLocation()

  if (!loaded) {
    return (
      <AnimatePresence>
        <LoadingScreen onComplete={() => setLoaded(true)} />
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public landing page — no sidebar */}
        <Route path="/" element={<Landing />} />

        {/* App pages — with sidebar */}
        <Route
          path="/dashboard"
          element={<AppLayout><Dashboard /></AppLayout>}
        />
        <Route
          path="/tickets"
          element={<AppLayout><TicketList /></AppLayout>}
        />
        <Route
          path="/tickets/new"
          element={<AppLayout><CreateTicket /></AppLayout>}
        />
        <Route
          path="/tickets/:ticketId"
          element={<AppLayout><TicketDetail /></AppLayout>}
        />
        <Route
          path="/analytics"
          element={<AppLayout><Analytics /></AppLayout>}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
