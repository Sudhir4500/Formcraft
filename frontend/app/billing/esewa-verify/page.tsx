'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEsewaPayment } from '@/services/billingService';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

// 1. Inner component containing all the verification hook logic
function EsewaVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your payment parameter signatures with eSewa securely...');
  const { syncUserSession } = useAuthStore();

  useEffect(() => {
    const runVerification = async () => {
      const dataToken = searchParams.get('data');
      
      if (!dataToken) {
        setStatus('error');
        setMessage('Invalid callback configuration context string.');
        return;
      }

      const result = await verifyEsewaPayment(dataToken);
      
      if (result.success) {
        setStatus('success');
        setMessage('Your payment has been fully verified! Upgrading your account now...');
        
        // Sync user state to reflect new subscription status globally
        await syncUserSession();
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2500);
      } else {
        setStatus('error');
        setMessage(result.message || 'Payment signature rejected.');
      }
    };

    runVerification();
  }, [searchParams, router, syncUserSession]);

  return (
    <div className="app-card max-w-md w-full text-center space-y-4 shadow-xl border-surface-border p-8 bg-surface rounded-2xl">
      {status === 'verifying' && (
        <div className="space-y-3">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-md font-semibold text-foreground">Confirming Transaction</h2>
          <p className="text-xs text-secondary">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-3">
          <div className="size-12 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto text-xl">✓</div>
          <h2 className="text-md font-bold text-foreground">Payment Successful!</h2>
          <p className="text-xs text-secondary">{message}</p>
          <Link href="/dashboard"
            className="mt-2 inline-block text-xs px-4 py-2 bg-surface border border-surface-border rounded-lg text-foreground font-medium hover:bg-base-300/50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-3">
          <div className="size-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto text-xl">✕</div>
          <h2 className="text-md font-bold text-foreground">Verification Failed</h2>
          <p className="text-xs text-secondary">{message}</p>
          <Link href="/dashboard"
            className="mt-2 inline-block text-xs px-4 py-2 bg-surface border border-surface-border rounded-lg text-foreground font-medium hover:bg-base-300/50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

// 2. Exported page wrapper that provides the critical Suspense barrier for production builds
export default function EsewaVerifyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Suspense 
        fallback={
          <div className="text-center space-y-3">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-secondary">Loading secure verification ecosystem...</p>
          </div>
        }
      >
        <EsewaVerifyContent />
      </Suspense>
    </div>
  );
}