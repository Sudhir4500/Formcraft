// app/api/billing/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { djangoPost } from "@/app/api/_lib/django";
import { CheckoutSessionResponse } from "@/types/billing";

export async function POST() {
  const res = await djangoPost<CheckoutSessionResponse>(
    "billing/create-checkout-session/",
    {}
  );
  return NextResponse.json(res);
}
