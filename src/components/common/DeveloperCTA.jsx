import { motion } from 'framer-motion'
import { Link, MessageCircle, Globe, Wrench } from 'lucide-react'
import { CTA_LINKS, DEVELOPER_NAME } from '../../constants/ctaLinks'

/**
 * DeveloperCTA — reusable developer branding + lead-generation component.
 *
 * Variants:
 *   "footer"  — subtle footer strip on public pages (Register, Status Check, Status Result)
 *   "success" — fade-in CTA shown after successful application submission
 *   "admin"   — support card on admin/batch-admin dashboards
 */
export default function DeveloperCTA({ variant = 'footer' }) {
  if (variant === 'footer') return <FooterCTA />
  if (variant === 'success') return <SuccessCTA />
  if (variant === 'admin') return <AdminCTA />
  return null
}

/* ─────────────────────────────────────────────────────────────────
   Footer CTA — appears below public page forms
───────────────────────────────────────────────────────────────── */
function FooterCTA() {
  return (
    <div className="mt-10 pt-6 border-t border-[var(--border-color)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tagline */}
        <p className="text-xs text-[var(--text-tertiary)] text-center sm:text-left leading-relaxed max-w-xs">
          Need a custom membership or campaign platform for your organization?
        </p>

        {/* Contact buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-[var(--text-tertiary)] font-medium mr-1 hidden sm:block">
            Let's Connect
          </span>

          <a
            href={CTA_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect on LinkedIn"
            title="LinkedIn"
            className="group flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-tertiary)] hover:border-[#0A66C2]/40 hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 transition-all duration-200 shadow-[var(--shadow-sm)]"
          >
            <Link className="w-3.5 h-3.5" />
          </a>

          <a
            href={CTA_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message on WhatsApp"
            title="WhatsApp"
            className="group flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-tertiary)] hover:border-[#25D366]/40 hover:text-[#25D366] hover:bg-[#25D366]/5 transition-all duration-200 shadow-[var(--shadow-sm)]"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>

          <a
            href={CTA_LINKS.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Portfolio"
            title="Portfolio"
            className="group flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-tertiary)] hover:border-primary-500/40 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all duration-200 shadow-[var(--shadow-sm)]"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Success CTA — shown after successful application submission
───────────────────────────────────────────────────────────────── */
function SuccessCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
      className="max-w-sm mx-auto mt-2"
    >
      {/* Divider */}
      <div className="relative flex items-center mb-5">
        <div className="flex-grow border-t border-[var(--border-color)]" />
        <span className="flex-shrink mx-3 text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-widest">
          Built with care
        </span>
        <div className="flex-grow border-t border-[var(--border-color)]" />
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-tertiary)] p-5 text-center shadow-[var(--shadow-sm)]">
        {/* Avatar badge */}
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold font-display text-sm mb-3 shadow-md">
          {DEVELOPER_NAME.charAt(0)}
        </div>

        <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">
          Your application has been submitted successfully.
        </p>
        <p className="text-xs text-[var(--text-tertiary)] leading-relaxed mb-4">
          This platform was built to simplify membership campaigns for organizations. Looking to build something similar?
        </p>

        <a
          href={CTA_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-semibold shadow-md hover:from-primary-700 hover:to-primary-800 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Work With Me
        </a>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Admin CTA — support card shown on admin dashboards
───────────────────────────────────────────────────────────────── */
function AdminCTA() {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-card)] to-primary-50/40 dark:to-primary-950/10 p-4 shadow-[var(--shadow-sm)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left — text */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 mt-0.5">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Need custom features or technical support?
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              Platform developed by{' '}
              <span className="font-medium text-[var(--text-secondary)]">{DEVELOPER_NAME}</span>
              {' '}— available for new projects and enhancements.
            </p>
          </div>
        </div>

        {/* Right — CTA button */}
        <a
          href={CTA_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary-200 dark:border-primary-900 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-950/60 hover:border-primary-300 dark:hover:border-primary-800 transition-all duration-200 self-start sm:self-auto whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Contact Developer
        </a>
      </div>
    </div>
  )
}
