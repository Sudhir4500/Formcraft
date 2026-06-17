// app/billing/success/page.tsx
'use client';

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-4">You’re now on the Pro plan. Unlimited forms unlocked!</p>
      <div className="mt-6">
        <p>Return to Dashboard</p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">Go to Dashboard</Link>
      </div>
    </div>
  );
}
