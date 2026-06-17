import { NextResponse } from 'next/server';
import { djangoPost } from '@/app/api/_lib/django';

export async function POST() {
  // Call your dedicated Django billing app endpoint
  const response = await djangoPost<{ url: string; formData: Record<string, string> }>(
    'billing/esewa/initiate/',
    {}
  );

  // FIX: Handled the possibly undefined status check safely using fallback operators
  const statusCode = response?.status ?? 500;

  if (!response || statusCode >= 400) {
    return NextResponse.json(
      { message: response?.message || 'Failed to initiate eSewa payment' },
      { status: statusCode }
    );
  }

  // Pass the whole response directly down!
  // This sends {"url": "...", "formData": {...}} straight to your frontend service layer
  return NextResponse.json(response);
}