

import { NextApiRequest, NextApiResponse } from 'next';
import { connectSQL, query, sqlConfig } from "@/dbConfig/db";
import bodyParser from 'body-parser';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from "bcryptjs";
;
const sql = require('mssql');

// Create body parser middleware
const jsonParser = bodyParser.json();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody
        console.log(reqBody);

        // await connectSQL();
        console.log(sqlConfig);

        await sql.connect(sqlConfig);

        const user = await sql.query`SELECT COUNT(*) AS count FROM users WHERE email = ${email}`
        const count = user.recordset[0].count;
        if (count > 0) {
            return NextResponse.json({ error: "user already exists" }, { status: 400 })
        }

        const salt = await bcryptjs.genSalt(10);
        const hasedPassword = await bcryptjs.hash(password, salt)

        const pool = await sql.connect(sqlConfig);
        const req = pool.request();

        req.input('Username', sql.VarChar, username);
        req.input('Email', sql.VarChar, email);
        req.input('Password', sql.VarChar, hasedPassword);

        const savedUser = await req.query(`
        INSERT INTO users (username, email, password) 
        VALUES (@Username, @Email, @Password)
        `);


        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }

}

