import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { sqlConfig } from '@/dbConfig/db';

export async function POST(request: NextRequest) {
    const data = await request.formData();

    var d = (new Date().getFullYear().toString() +
        ("0" + (new Date().getMonth() + 1)).slice(-2) +
        ("0" + new Date().getDate()).slice(-2));
    console.log(d);
    const lang_id = data.get('lang_id');
    const cat = data.get('category');
    //const flipURL = data.get('flipURL');
    const publishDate = data.get('publishDate');

    await sql.connect(sqlConfig);
    const pool = await sql.connect(sqlConfig);
    const req = pool.request();


    req.input('cat', cat);
    req.input('submitDate', d);
    req.input('pubDate', publishDate);
    req.input('lang_Id', lang_id);
    req.input('status', 6);
    req.input('active', 1);


    const mag = await req.query(`insert into DyanamicCategory (Category_name 
        ,SubmittedDate ,publishDate ,lang_id,status,active) values
        (@cat,@submitDate,@pubDate,@lang_Id,@status,@active)`)

    return NextResponse.json({
        success: true,
        message: 'record inserted',
        mag

    },
        { status: 201 });
}