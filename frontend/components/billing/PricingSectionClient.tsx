'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UpgradeButton } from './UpgradeButton';
import { createCheckoutSession } from "@/services/billingService";

export function PricingSectionClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleUpgradeIntent = async () => {
      // Look for the specific flag passed from our modified LoginPage
      if (searchParams.get('intent') === 'upgrade') {
        try {
          // Immediately scrub the url parameters cleanly so it doesn't loop on refresh
          router.replace('/');

          // Execute backend billing handshakes immediately
          const res = await createCheckoutSession();
          if (res.url) {
            window.location.href = res.url;
          } else {
            console.error("Stripe URL generation returned empty data parameters");
          }
        } catch (err) {
          console.error("Stripe initialization failed:", err);
        }
      }
    };

    handleUpgradeIntent();
  }, [searchParams, router]);

  return (
    <section id="pricing" className="max-w-5xl mx-auto px-6 py-16 border-t border-surface-border mb-16">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Simple, Predictable Pricing</h2>
        <p className="text-sm text-secondary">No hidden tracking metrics. Scale your plan alongside your pipeline expansion.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free Plan Tier */}
        <div className="app-card flex flex-col justify-between space-y-6 bg-surface">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase text-secondary">Free Tier</h4>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold text-foreground">$0</span>
                <span className="text-xs text-secondary font-medium">/ forever</span>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed">Perfect for launching staging environments and running sandbox mock servers.</p>
            <ul className="space-y-2 pt-2 border-t border-surface-border text-xs text-foreground/80">
              <li className="flex items-center gap-2">✅ Up to 3 Active Workspace Forms</li>
              <li className="flex items-center gap-2">✅ Standard API Route Error Validation</li>
            </ul>
          </div>
          <Link href="/register" className="w-full text-center py-2.5 bg-background text-foreground text-sm font-medium rounded-lg border border-surface-border hover:bg-base-300/50 transition-colors">
            Get Started Free
          </Link>
        </div>

        {/* Pro Plan Tier */}
        <div className="app-card flex flex-col justify-between border-primary/50 ring-1 ring-primary/40 space-y-6 relative bg-gradient-to-b from-primary/5 to-transparent">
          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-content px-2 py-0.5 rounded-full">
            Popular
          </span>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase text-primary">Pro Plan Tier</h4>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold text-foreground">$15</span>
                <span className="text-xs text-secondary font-medium">/ month</span>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed">Unlock complete data pipeline capabilities. Build endless request forms with native processing workflows.</p>
            <ul className="space-y-2 pt-2 border-t border-surface-border text-xs text-foreground/80">
              <li className="flex items-center gap-2 text-primary font-medium">✅ Unlimited Data Record Forms</li>
              <li className="flex items-center gap-2">✅ Instant Webhook Routing Execution</li>
            </ul>
          </div>
          <div className="w-full grid [&>button]:w-full">
            <UpgradeButton />
          </div>
        </div>
      </div>
    </section>
  );
}