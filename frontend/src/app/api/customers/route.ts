import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import mysql from 'mysql2';
import { cookies } from 'next/headers';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '_@rHVaajU/XJpnOB',
    database: 'tbw_cycle',
});

// GET: Fetch all customers
export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const areaCode = cookieStore.get('area_code')?.value;
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword') || '';  // 🔄 correct param name

    if (!areaCode) {
        return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const likeKeyword = `%${keyword}%`;

    return new Promise((resolve) => {
        const query = keyword
            ? `SELECT * FROM customers 
               WHERE area_code = ? 
               AND (customer_name LIKE ? OR branch_code LIKE ?)`
            : `SELECT * FROM customers WHERE area_code = ?`;

        const values = keyword ? [areaCode, likeKeyword, likeKeyword] : [areaCode];

        pool.query(query, values, (err, results: []) => {
            if (err) {
                console.error(err);
                return resolve(NextResponse.json({ message: 'Database error' }, { status: 500 }));
            }

            return resolve(NextResponse.json(results, { status: 200 }));
        });
    });
}

//POST: add a new customer
export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const areaCode = cookieStore.get('area_code')?.value;

        if (!areaCode) {
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
        }

        const body = await req.json();
        const {
            branch_code,
            branch_name,
            customer_name,
            cif,
            account_number,
            company_id,
            potential,
            current_balance,
            pipeline_type,
            entity_type,
            cycle_state,
            details,
            cycle_details,
            subregion_code,
            address,
            strategy,
        } = body;

        const query = `
            INSERT INTO customers (
                area_code, branch_code, branch_name, customer_name, cif, account_number, company_id,
                potential, current_balance, pipeline_type, entity_type, cycle_state,
                details, cycle_details, subregion_code, address, strategy
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Sanitize input: replace undefined with null
        const values = [
            areaCode,
            branch_code ?? null,
            branch_name ?? null,
            customer_name ?? null,
            cif ?? null,
            account_number ?? null,
            company_id ?? null,
            potential ?? null,
            current_balance ?? null,
            pipeline_type ?? null,
            entity_type ?? null,
            cycle_state ?? null,
            details ?? null,
            cycle_details?? null,
            subregion_code ?? null,
            address ?? null,
            strategy ?? null
        ];
  

        await db.execute(query, values);

        return NextResponse.json({ message: 'Customer added successfully' }, { status: 201 });
    }   catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to add customer' }, { status: 500 });
    }
}