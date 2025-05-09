import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '_@rHVaajU/XJpnOB',
    database: 'tbw_cycle',
});

export async function GET(request: NextRequest, context: { params: { id: string } }) {
    
    const { id } = await context.params

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM customers WHERE id = ?', [id], (err, results: any[]) => {
            if (err) {
                console.error('MySQL GET error:', err);
                return reject(NextResponse.json({ error: 'Database error' }, { status: 500 }));
            }

            if (results.length === 0) {
                return resolve(NextResponse.json({ error: 'Customer not found' }, { status: 404 }));
            }

            return resolve(NextResponse.json(results[0]));
        })
    })
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const body = await request.json();
    const { cycle_state, cycle_details, details, address } = body;

    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE customers SET cycle_state = ?, cycle_details = ?, update_date = NOW(), details = ?, address = ? WHERE id = ?`,
            [cycle_state, cycle_details, details, address, id],
            (err) => {
                if (err) {
                    console.error('MySQL PUT error:', err);
                    return reject(NextResponse.json({ error: 'Failed to update customer' }, { status: 500 }));
                }

                resolve(NextResponse.json({ message: 'Customer updated successfully' }, { status: 200 }));
            }
        )
    })
}