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
    const magLang = data.get('magLang');
    const title = data.get('title');
    const flipURL = data.get('flipURL');
    const publishDate = data.get('publishDate');


    const pool = await sql.connect(sqlConfig);
    const req = pool.request();




    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
    if (file.size > 5242880) {
        return NextResponse.json(
            { message: "file size size should be less then 5mb" },
            { status: 305 })
    }

    const fileExt = file.name.split('.').pop();
    const fileName = "M" + d + magLang + "." + fileExt;
    const magFile = "M" + d + magLang + ".pdf"

    req.input('title', title);
    req.input('submitDate', d);
    req.input('pubDate', publishDate);
    req.input('thumFile', fileName);
    req.input('magFile', magFile);
    req.input('lang_Id', magLang);
    req.input('status', 6);
    req.input('url', flipURL);

    const mag = await req.query(`insert into tblMagazine (title ,SubmittedDate ,publishDate  ,thumbFile  ,MagFile  
        ,Lang_id  ,status,url) values(@title,@submitDate,@pubDate,@thumFile,@magFile,
            @lang_Id,@status,@url)`)


    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `./files/${fileName}`;
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
    return NextResponse.json({
        success: true,
        message: 'record inserted',
        mag

    },
        { status: 201 });
}