// services/billingService.ts (client-safe)
import { CheckoutSessionResponse } from "@/types/billing";

export async function createCheckoutSession(): Promise<CheckoutSessionResponse> {
  const res = await fetch("/api/billing/create-checkout-session", {
    method: "POST",
  });
  return res.json();
}

export async function initiateEsewaPayment(): Promise<{ url: string; formData: Record<string, string> } | null> {
  try {
    const res = await fetch('/api/billing/esewa/initiate', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to get initialization params');
    return await res.json();
  } catch (error) {
    console.error('eSewa initiation error:', error);
    return null;
  }
}

export async function verifyEsewaPayment(dataToken: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/billing/esewa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: dataToken }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: 'Network error verifying transaction' };
  }
}