'use client'
import { useAuthStore } from '@/store/authStore'
import { Modal } from './Modal'
import React from 'react'
import { LogoutButton } from '../auth/LogoutButton'
import Link from 'next/link'
import {UpgradeButton} from '../billing/UpgradeButton'

interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { user } = useAuthStore()

  const openModal = () => {
    setIsModalOpen(true)
  }
  const isPro = user?.plan === 'pro'

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4">FormCraft</div>
        </nav>
        {/* Page content here */}
        <div className="p-4">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <Link href="/dashboard" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="is-drawer-close:hidden">Homepage</span>
              </button>
              </Link>
            </li>
          </ul>

          {/* Sidebar footer */}
        <div className="w-full border-t border-base-300 p-3 bg-base-200/50">
            <button
              className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-base-300 text-left transition-colors is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip={user?.name || 'User Account'}
              onClick={openModal}
            >
              {/* Avatar Frame */}
              <div className="avatar placeholder shrink-0">
                <div className="bg-neutral text-neutral-content rounded-full size-9 flex items-center justify-center font-bold text-sm ring-1 ring-base-300">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              
              {/* User Meta Data */}
              <div className="flex flex-col min-w-0 flex-grow is-drawer-close:hidden">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="font-semibold text-sm text-base-content truncate">{user?.name || 'User'}</span>
                  {isPro && <span className="badge badge-primary badge-xs font-bold scale-90 px-1 py-1.5">PRO</span>}
                </div>
                <span className="text-xs text-base-content/60 truncate">{user?.email || 'No email info'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modal content */}
    {isModalOpen && (
        <Modal 
          title="Account Settings" 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-6 pt-2">
            
            {/* Plan Info Sub-banner */}
            <div className={`p-4 rounded-xl flex justify-between items-center ${isPro ? 'bg-primary/10 border border-primary/20 text-primary-content' : 'bg-base-200 text-current'}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Current Subscription Plan</p>
                <p className="text-lg font-bold capitalize mt-0.5">{user?.plan || 'Free Plan'}</p>
              </div>
              <span className={`badge p-3 font-bold ${isPro ? 'badge-primary' : 'badge-ghost'}`}>
                {isPro ? 'Premium Active' : 'Free tier'}
                {isPro || <UpgradeButton />}
              </span>
            </div>

            {/* User Info Section */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <div className="bg-base-200 border border-base-300 rounded-lg px-3 py-2.5 font-medium text-sm text-base-content">
                  {user?.name || "N/A"}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <div className="bg-base-200 border border-base-300 rounded-lg px-3 py-2.5 font-medium text-sm text-base-content overflow-x-auto">
                  {user?.email || "N/A"}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-base-300 flex justify-end">
              <LogoutButton />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}