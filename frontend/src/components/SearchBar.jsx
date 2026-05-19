/**
 * Live search bar with debounced input and animated clear button.
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'

export default function SearchBar({ onSearch, placeholder = 'Search tickets...' }) {
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 350)

  // Trigger search when debounced value changes
  React.useEffect(() => {
    onSearch(debounced)
  }, [debounced])

  const clear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
