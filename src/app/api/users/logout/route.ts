

import { NextRequest, NextResponse } from 'next/server';

;
const sql = require('mssql');


export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            Message: "Logout successfully",
            success: true
        })
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}