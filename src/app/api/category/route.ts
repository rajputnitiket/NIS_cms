
import { connectSQL, query, sqlConfig } from "@/dbConfig/db";
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';
;
const sql = require('mssql');
dotenv.config();

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { lang_id } = reqBody;

        const yr = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const dd = new Date().getDay();


        console.log(reqBody, yr, month, dd);
        let category = "";

        const pool = await sql.connect(sqlConfig);
        const req = pool.request();


        req.input('yr', yr);
        req.input('month', month);
        req.input('lang', lang_id);




        if (dd > 15) {
            category = await req.query(`select Cat_Id,Category_name,lang_id from DyanamicCategory 
            where YEAR(publishDate)=@yr and MONTH(publishDate)=@month and DAY(publishDate)>15 and active=1 
            and lang_id=@lang union select Cat_Id,Category_name,lang_id from NIScategory where active=1 
            and lang_id=@lang order by Cat_Id asc`)
        }
        else {
            category = await req.query(`select Cat_Id,Category_name,lang_id from DyanamicCategory where 
            YEAR(publishDate)=@yr and MONTH(publishDate)=@month and DAY(publishDate)<=15 and active=1 and 
            lang_id=@lang union select Cat_Id,Category_name,lang_id from NIScategory where active=1 and 
            lang_id=@lang order by Cat_Id asc`)
        }



        const response = NextResponse.json({
            success: true,
            category

        }, { status: 200 })


        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}