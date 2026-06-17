'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// 1. Move all your original payment verification UI and logic into an inner component
function StripeSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const syncUserSession = useAuthStore((state) => state.syncUserSession);

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Verifying your Stripe session privileges...');

  useEffect(() => {
    const verifyStripePayment = async () => {
      const sessionId = searchParams.get('session_id');
      try {
        const syncSuccessful = await syncUserSession();
        if (syncSuccessful) {
          setStatus('success');
          setMessage('Account upgraded successfully! Syncing your workspace permissions...');
          router.refresh();
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Payment went through, but we failed to sync your local session.');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage('An unexpected error occurred.');
      }
    };

    verifyStripePayment();
  }, [searchParams, router, syncUserSession]);

  return (
    <div className="app-card max-w-md w-full text-center space-y-4 shadow-xl border border-surface-border p-8 bg-surface rounded-2xl">
      {status === 'processing' && (
        <div className="space-y-3">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-md font-semibold text-foreground">Activating Premium Features</h2>
          <p className="text-xs text-secondary">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-3">
          <div className="size-12 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto text-xl">✓</div>
          <h2 className="text-md font-bold text-foreground">Upgrade Complete!</h2>
          <p className="text-xs text-secondary">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-3">
          <div className="size-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto text-xl">✕</div>
          <h2 className="text-md font-bold text-foreground">Sync Delayed</h2>
          <p className="text-xs text-secondary">{message}</p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="mt-4 text-xs px-4 py-2 bg-background border border-surface-border rounded-lg text-foreground font-medium hover:bg-base-300/50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

// 2. The main page component acts as a clean wrapper providing the Suspense boundary
export default function StripeSuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Suspense 
        fallback={
          <div className="text-center space-y-3">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-secondary">Loading secure verification environment...</p>
          </div>
        }
      >
        <StripeSuccessContent />
      </Suspense>
    </div>
  );
}