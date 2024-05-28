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
    const id = data.get('id');
    const publishDate = data.get('publishDate');
    const flag = data.get('flag');
    let storyFile;
    let article;


    try {
        await sql.connect(sqlConfig);
        const pool = await sql.connect(sqlConfig);
        const req = pool.request();

        const result = await req.query(`select top 1 ID from newsStory where status=6 order by ID desc`)
        const magid = result.recordset[0]?.ID;
        const num = parseInt(magid, 10);
        console.log(magid);

        req.input('id', id);
        req.input('submitDate', d);
        req.input('pubDate', publishDate);
        req.input('cat_id', cat_id);
        req.input('Lang_id', lang_id);

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

            const fileExt = file.name.split('.').pop();
            const fileName = "S" + d + (num + 1) + "." + fileExt;
            storyFile = "S" + d + (num + 1) + ".pdf"
            req.input('storyFile', storyFile);

            article = await req.query(`
         update newsStory set SubmittedDate=@submitDate ,publishDate = @pubDate ,category_id=@cat_id ,
         StoryFile=@storyFile ,Lang_id=@lang_id where id = @id`);

        }
        if (flag === "1") {
            article = await req.query(`
         update newsStory set SubmittedDate=@submitDate ,publishDate = @pubDate ,category_id=@cat_id ,
         Lang_id=@lang_id where id = @id`);
        }
        console.log(article);


        return NextResponse.json({
            success: true,
            message: 'Record updated',
            article
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({
            success: false,
            message: 'Error updating article'
        }, { status: 500 });
    }
}
