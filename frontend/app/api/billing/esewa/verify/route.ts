import { NextResponse } from 'next/server';
import { djangoPost } from '@/app/api/_lib/django';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the encoded data directly to Django's verification view
    const response = await djangoPost('billing/esewa/verify/', {
      data: body.data
    });

    if (!response.success) {
      return NextResponse.json(
        { message: response.message || 'Payment verification failed' },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json({ success: true, message: response.message });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}