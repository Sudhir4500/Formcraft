import { NextRequest, NextResponse } from 'next/server'
import { djangoGet, djangoPost } from '@/app/api/_lib/django'

export async function GET() {
    const data = await djangoGet('forms/')
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const data = await djangoPost('forms/', body)
    return NextResponse.json(data)
}