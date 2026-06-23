import { useState, useRef, useEffect } from 'react'
import { Moon, Sun, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../ui/Avatar'

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left spacer for mobile menu button */}
        <div className="w-10 lg:w-0" />

        {/* Page title area - can be used by pages */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200 relative cursor-pointer">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all duration-200 cursor-pointer"
            >
              <Avatar name={user?.fullName} size="xs" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[var(--text-primary)] leading-none">
                  {user?.fullName?.split(' ').slice(0, 2).join(' ')}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 leading-none capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-tertiary)] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-[var(--shadow-xl)] py-1.5 z-50"
                >
                  <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{user?.fullName}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/profile') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/settings') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="border-t border-[var(--border-color)] mt-1 pt-1">
                    <button
                      onClick={() => { setProfileOpen(false); logout() }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
