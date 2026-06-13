import { djangoGet } from "../../_lib/django";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await djangoGet("auth/me/");
        return NextResponse.json(response);
    } catch (error: unknown) {
        // Create the response
        const res = NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });

        // CRITICAL: Clear the invalid cookie so Middleware stops letting them in
        res.cookies.delete('access_token');

        return res;
    }
}