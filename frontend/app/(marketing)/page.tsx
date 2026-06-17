import type { Metadata } from 'next'
import Link from 'next/link'
import { PricingSectionClient } from '@/components/billing/PricingSectionClient'
import { Suspense } from 'react'
import { Logo } from '@/public/icons/icons';

// Complete Core SEO Engine Optimization Metadata block
export const metadata: Metadata = {
  title: 'FormCraft — Create Powerfully Dynamic Forms & Collect Data Instantly',
  description: 'Design intuitive digital forms, capture customer submissions seamlessly, and scale your business workflow automation with high performance database records.',
  keywords: ['form builder', 'saas data collection', 'customizable forms', 'online form creator', 'nextjs forms'],
  authors: [{ name: 'FormCraft Team' }],
  openGraph: {
    title: 'FormCraft — Create Powerfully Dynamic Forms & Collect Data Instantly',
    description: 'Design intuitive digital forms, capture customer submissions seamlessly, and scale your business workflow automation.',
    url: 'https://formcraft.com', // Replace with your production domain
    siteName: 'FormCraft',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormCraft — Create Powerfully Dynamic Forms & Collect Data Instantly',
    description: 'Design intuitive digital forms, capture customer submissions seamlessly, and scale your business workflow automation.',
  },
  alternates: {
    canonical: 'https://formcraft.com',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      
      {/* 1. Header Navigation Shell Area */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground">
            <span className="size-6 rounded-md bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white text-xs"><Logo /></span>
            FormCraft
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-secondary hover:text-foreground transition-colors">Pricing</a>
            <Link href="/login" className="text-sm font-medium text-primary hover:opacity-80 transition-opacity">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Contextual Visual Section */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-20 pb-16 space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          🚀 Next-Generation Forms Built for Scale
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
          Collect responses without wrestling with messy pipelines.
        </h1>
        <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto font-normal">
          Build clean forms instantly, deploy dynamic parameters, and ingest user submissions natively right into your database metrics shell.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/register" className="px-5 py-2.5 bg-primary text-primary-content font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity text-sm">
            Get Started Free
          </Link>
          <a href="#pricing" className="px-5 py-2.5 bg-surface text-foreground font-medium rounded-lg border border-surface-border hover:bg-base-300/50 transition-colors text-sm">
            View Pricing
          </a>
        </div>
      </section>

      {/* 3. Core Structural SaaS Feature Matrix */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t border-surface-border">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Productive Engineering Tooling</h2>
          <p className="text-sm text-secondary max-w-md mx-auto">Everything you need to handle public request form endpoints natively with absolute peace of mind.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="app-card space-y-3">
            <div className="text-xl">⚡</div>
            <h3 className="font-bold text-base text-foreground">RSC Performance Acceleration</h3>
            <p className="text-xs text-secondary leading-relaxed">Leverages structural Server Side Component processing to secure server endpoints without leaky token structures.</p>
          </div>
          <div className="app-card space-y-3">
            <div className="text-xl">🛠️</div>
            <h3 className="font-bold text-base text-foreground">Zero Config Inputs</h3>
            <p className="text-xs text-secondary leading-relaxed">Write classic inputs and textareas that adopt pristine styling metrics straight out of your standard theme configurations.</p>
          </div>
          <div className="app-card space-y-3">
            <div className="text-xl">📊</div>
            <h3 className="font-bold text-base text-foreground">Instant Live Refreshing</h3>
            <p className="text-xs text-secondary leading-relaxed">Refreshes views seamlessly after mutations without throwing heavy state calculations or resetting active toast layout UI instances.</p>
          </div>
        </div>
      </section>

      {/* 4. Billing Pricing Area Section */}
       <section className="max-w-4xl mx-auto text-center px-6 pt-20 pb-16 space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Collect responses effortlessly.</h1>
      </section>
        {/* Dynamic Client Pricing Matrix bounded safely within Suspense */}
      <Suspense fallback={
        <div className="text-center py-24 text-sm text-secondary animate-pulse">Loading secure billing portal options...</div>
      }>
        <PricingSectionClient />
      </Suspense>


      {/* 5. Clean Semantic Footer */}
      <footer className="border-t border-surface-border py-8 text-center text-xs text-secondary bg-surface/50">
        <p>© 2026 FormCraft Enterprise. All rights reserved according to global compliance rules.</p>
      </footer>
    </div>
  )
}