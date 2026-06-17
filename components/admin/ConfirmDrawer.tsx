'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmDrawerProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'default'
  isLoading?: boolean
}

export function ConfirmDrawer({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'default',
  isLoading = false,
}: ConfirmDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const variantStyles = {
    danger: {
      icon: 'bg-[var(--error)]/10 text-[var(--error)]',
      button: 'bg-[var(--error)] hover:bg-[var(--error)]/90',
    },
    warning: {
      icon: 'bg-[var(--warning)]/10 text-[var(--warning)]',
      button: 'bg-[var(--warning)] hover:bg-[var(--warning)]/90 text-black',
    },
    default: {
      icon: 'bg-[var(--accent)]/10 text-[var(--accent)]',
      button: 'bg-[var(--accent)] hover:bg-[var(--accent)]/90',
    },
  }

  const styles = variantStyles[variant]

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            style={{ zIndex: 99999 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[400px]"
            style={{ zIndex: 100000 }}
          >
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.icon}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
                {description}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 admin-btn admin-btn-secondary"
                >
                  {cancelText}
                </button>
                <motion.button
                  onClick={onConfirm}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 admin-btn text-white ${styles.button} disabled:opacity-50`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    confirmText
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
