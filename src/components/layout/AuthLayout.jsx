import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-primary-300/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8">
              <span className="text-white font-bold text-2xl font-display">A</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white font-display leading-tight">
              AALIA
            </h1>
            <p className="text-xl text-primary-200 mt-2 font-display">
              Alumni Association
            </p>
            <p className="text-primary-300 mt-6 text-base leading-relaxed max-w-md">
              Join the alumni network. Connect with fellow graduates, manage your membership, and stay connected with your alma mater.
            </p>

            {/* Decorative dots */}
            <div className="flex gap-2 mt-10">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[var(--bg-secondary)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg font-display">A</span>
            </div>
            <div>
              <h1 className="font-bold text-[var(--text-primary)] font-display text-xl">AALIA</h1>
              <p className="text-xs text-[var(--text-tertiary)]">Membership Portal</p>
            </div>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
