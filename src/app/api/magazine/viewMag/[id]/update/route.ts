import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import sql from 'mssql';
import { sqlConfig } from '@/dbConfig/db';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    var d = (new Date().getFullYear().toString() +
        ("0" + (new Date().getMonth() + 1)).slice(-2) +
        ("0" + new Date().getDate()).slice(-2));
    console.log(d);
    const magLang = data.get('lang_id');
    const title = data.get('title');
    const id = data.get('id');
    const flipURL = data.get('flipURL');
    const publishDate = data.get('publishDate');
    const flag = data.get('flag');
    let storyFile;
    let magazine;


    try {
        await sql.connect(sqlConfig);
        const pool = await sql.connect(sqlConfig);
        const req = pool.request();


        req.input('id', id);
        req.input('submitDate', d);
        req.input('pubDate', publishDate);
        req.input('title', title);
        req.input('Lang_id', magLang);
        req.input('url', flipURL);
        console.log(title, publishDate);


        if (flag === "2") {
            const file: File | null = data.get('file') as unknown as File;

            if (!file) {
                return NextResponse.json({ success: false }, { status: 400 });
            }
            if (file.size > 5242880) {
                return NextResponse.json(
                    { message: "file size size should be less then 5mb" },
                    { status: 305 })
            }
            console.log("case1");

            const fileExt = file.name.split('.').pop();
            const fileName = "M" + d + magLang + "." + fileExt;
            const magFile = "M" + d + magLang + ".pdf";
            req.input('thumFile', fileName);
            req.input('magFile', magFile);

            magazine = await req.query(`
            update tblMagazine set thumbFile =@thumFile,title=@title,publishDate=@pubDate,MagFile=@magFile 
            where id = @id`);

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const path = `./files/${fileName}`;
            await writeFile(path, buffer);
            console.log(`open ${path} to see the uploaded file`);
        }
        if (flag === "1") {
            console.log("case3", id);

            magazine = await req.query(`
            update tblMagazine set title=@title,publishDate=@pubDate
            where id = @id`);
        }
        console.log(magazine);


        return NextResponse.json({
            success: true,
            message: 'Record updated',
            magazine
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({
            success: false,
            message: 'Error updating article'
        }, { status: 500 });
    }
}
