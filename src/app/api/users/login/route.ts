
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
        const reqBody = await request.json()
        const { username, password } = reqBody
        console.log(reqBody);

        // await connectSQL();

        await sql.connect(sqlConfig);

        const salt = await bcryptjs.genSalt(10);
        const hasedPassword = await bcryptjs.hash(password, salt)


        const chkusr = await sql.query`select * from users WHERE  username = ${username} `;
        const user = chkusr.recordset[0];
        console.log(user);

        if (!user) {
            return NextResponse.json({ error: "user not exists" }, { status: 400 })
        }

        console.log("user exist");

        const validpassword = await bcryptjs.compare(password, user.password)

        if (!validpassword) {
            return NextResponse.json({ error: "Check your credential" }, { status: 400 })
        }

        const tokenData = {
            id: user.id,
            username: user.username,
            email: user.email
        }

        console.log(process.env.TOKEN_SECRET);


        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' })

        const response = NextResponse.json({
            message: "LOgged in  successfully",
            success: true,

        })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}