
import { connectSQL, query, sqlConfig } from "@/dbConfig/db";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
;
const sql = require('mssql');
dotenv.config();

export async function POST(request: NextRequest) {
    try {


        await sql.connect(sqlConfig);


        const Languages = await sql.query`select * from Mst_Language `;

        const response = NextResponse.json({
            success: true,
            Languages

        }, { status: 200 })


        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}