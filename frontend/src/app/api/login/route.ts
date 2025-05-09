import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2';
import { serialize } from 'cookie';
import { cookies } from 'next/headers';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '_@rHVaajU/XJpnOB',
    database: 'tbw_cycle',
});


export async function POST(req: NextRequest) {
    const { area_code, password } = await req.json();

    console.log('Login attempt:', area_code, password);

    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM users WHERE area_code = ? AND password = ?',
            [area_code, password],
            async (err, results: any[]) => {
                if (err) {
                    console.error(err);
                    return resolve(NextResponse.json({ message: 'Database error' }, { status: 500 }));
                }

                console.log('Query Result:', results)

                if (results.length === 0) {
                    return resolve(NextResponse.json({ message: 'Invalid credentials'}, { status: 401 }));
                }

                const user = results[0]; // Assuming the first result is the user

                // Set cookies for area_name and area_code
                const cookieStore = await cookies();
                cookieStore.set('area_name', user.area_name, { path: '/', httpOnly: false });
                cookieStore.set('area_code', user.area_code, { path: '/', httpOnly: false });

                // cookies
                const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
                response.headers.set(
                    'Set-Cookie',
                    serialize('session', area_code, {
                        path: '/',
                        httpOnly: true,
                        maxAge: 60 * 60,
                    })
                );

                return resolve(response);
            }
        )
    })
}