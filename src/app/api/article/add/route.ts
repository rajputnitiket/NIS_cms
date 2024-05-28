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
    const cat_id = data.get('cat_id');
    const flipURL = data.get('flipURL');
    const publishDate = data.get('publishDate');

    await sql.connect(sqlConfig);
    const pool = await sql.connect(sqlConfig);
    const req = pool.request();

    const result = await req.query(`select top 1 ID from newsStory where status=6 order by ID desc`)
    const magid = result.recordset[0]?.ID;
    const num = parseInt(magid, 10);
    console.log(magid);


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
    const fileName = "S" + d + (num + 1) + "." + fileExt;
    const storyFile = "S" + d + (num + 1) + ".pdf"

    req.input('cat_id', cat_id);
    req.input('submitDate', d);
    req.input('pubDate', publishDate);
    //req.input('thumFile', fileName);
    req.input('storyFile', storyFile);
    req.input('lang_Id', lang_id);
    req.input('status', 6);
    req.input('url', flipURL);

    const mag = await req.query(`insert into newsStory (SubmittedDate ,publishDate ,category_id ,StoryFile 
         ,Lang_id  ,status) values(@submitDate,@pubDate,@cat_id,@storyFile,@lang_id,@status)`)


    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `./files/story/${fileName}`;
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
    return NextResponse.json({
        success: true,
        message: 'record inserted',
        mag

    },
        { status: 201 });
}