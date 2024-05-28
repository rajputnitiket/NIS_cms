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

        const magazine = await req.query(`
        select a.id,a.title,a.publishDate,a.thumbFile,a.MagFile,b.set_id,a.url,b.Lang_Id from tblMagazine a left join Mst_Language b on a.Lang_id=b.Lang_Id where a.status=6 and a.id=@id order by a.publishDate desc
        `);
        console.log(magazine);

        return NextResponse.json({
            success: true,
            message: 'Record fetched',
            magazine
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching article'
        }, { status: 500 });
    }
}
