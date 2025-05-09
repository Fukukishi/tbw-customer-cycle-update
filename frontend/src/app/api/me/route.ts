import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const areaName = cookieStore.get('area_name')?.value;
    const areaCode = cookieStore.get('area_code')?.value;

    if (!areaName || !areaCode) {
        return NextResponse.json({ error: 'Not logged in' }, { status:401 })
    }

    return NextResponse.json({
        area_name:areaName,
        area_code:areaCode,
    });
}