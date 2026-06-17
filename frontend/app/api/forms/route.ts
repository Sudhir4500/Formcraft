import { NextRequest, NextResponse } from 'next/server'
import { djangoGet, djangoPost } from '@/app/api/_lib/django'

export async function GET() {
  try {
    const data = await djangoGet('forms/')
    return NextResponse.json(data)
  } catch (error: any) {
    // Forward backend error exactly
    return NextResponse.json(error, { status: error?.status || 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await djangoPost('forms/', body)

    // Forward backend payload and status
    return NextResponse.json(data, { status: data.status })
  } catch (error: any) {
    return NextResponse.json(error, { status: error?.status || 500 })
  }
}

