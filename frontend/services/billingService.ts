// services/billingService.ts (client-safe)
import { CheckoutSessionResponse } from "@/types/billing";

export async function createCheckoutSession(): Promise<CheckoutSessionResponse> {
  const res = await fetch("/api/billing/create-checkout-session", {
    method: "POST",
  });
  return res.json();
}
