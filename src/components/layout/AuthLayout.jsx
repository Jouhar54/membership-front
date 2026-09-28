import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import DeveloperCTA from '../common/DeveloperCTA'

export default function AuthLayout() {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-[var(--bg-secondary)]">
      {/* Left - Decorative Panel (hidden on mobile, fixed & centered on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden flex-col justify-center items-center select-none flex-shrink-0">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-primary-300/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white backdrop-blur-sm flex items-center justify-center mb-8 p-1.5 shadow-lg shadow-black/10">
              <img src="/aalia-logo.png" alt="AALIA Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white font-display leading-tight tracking-tight">
              AALIA
            </h1>
            <p className="text-xl text-primary-200 mt-2 font-display">
              Alumni Association
            </p>
            <p className="text-primary-300/90 mt-6 text-base leading-relaxed max-w-md">
              Join the alumni network. Connect with fellow graduates, manage your membership, and stay connected with your alma mater.
            </p>

            {/* Decorative dots */}
            <div className="flex gap-2.5 mt-10">
              <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Viewport Area with Fixed Header, Scrollable Body, Fixed Footer */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden bg-[var(--bg-secondary)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden px-4 sm:px-8 lg:px-12 pt-5 pb-2 flex justify-center">
          <div className="w-full max-w-xl xl:max-w-2xl h-full flex flex-col overflow-hidden">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-4 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-white backdrop-blur-sm flex items-center justify-center p-1 border border-[var(--border-color)] shadow-sm overflow-hidden">
                <img src="/aalia-logo.png" alt="AALIA Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-[var(--text-primary)] font-display text-lg leading-tight">AALIA</h1>
                <p className="text-xs text-[var(--text-tertiary)]">Membership Portal</p>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <Outlet />
            </div>
          </div>
        </div>

        {/* Fixed Footer at screen bottom */}
        <div className="flex-shrink-0 bg-[var(--bg-secondary)] px-4 sm:px-8 lg:px-12 py-3 z-20">
          <div className="w-full max-w-xl xl:max-w-2xl mx-auto">
            <DeveloperCTA variant="footer" />
          </div>
        </div>
      </div>
    </div>
  )
}
