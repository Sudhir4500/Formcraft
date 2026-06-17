import React from 'react'

interface ModalProps {
  children?: React.ReactNode
  title?: string
  open: boolean
  onClose: () => void
}

export function Modal({ title, children, open, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface border border-surface-border rounded-2xl shadow-xl p-6 overflow-hidden transition-all">
        {/* Header section wrapper */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
          <h3 className="text-base font-bold text-foreground">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-secondary hover:text-foreground hover:bg-base-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Dynamic Inner Layout Body wrapper */}
        <div className="text-sm text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  )
}