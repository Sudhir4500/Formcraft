// src/types/billing.ts
export interface CheckoutSessionResponse {
  url: string;
}

export interface BillingError {
  message: string;
  status: number;
}
