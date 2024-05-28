import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { sqlConfig } from '@/dbConfig/db';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const id = reqBody;
    console.log(id);


    try {

        const pool = await sql.connect(sqlConfig);
        const req = pool.request();

        req.input('id', id);

        const article = await req.query(`
        select id,publishDate,category_id,StoryFile ,Lang_id ,status from newsStory where status=6 and id=@id
        `);
        console.log(article);

        return NextResponse.json({
            success: true,
            message: 'Record fetched',
            article
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching article'
        }, { status: 500 });
    }
}
