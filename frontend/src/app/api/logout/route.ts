import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out' }, { status: 200});

    // destroying cookies
    response.cookies.set('session', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}