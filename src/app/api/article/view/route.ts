
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { sqlConfig } from '@/dbConfig/db';

export async function POST(request: NextRequest) {
    const data = await request.formData();

    var d = (new Date().getFullYear().toString() +
        ("0" + (new Date().getMonth() + 1)).slice(-2) +
        ("0" + new Date().getDate()).slice(-2));
    console.log(d);
    const srcDate = data.get('srcDtt');
    console.log(srcDate);

    const magyr: string[] | undefined = srcDate?.toString().split('-');
    console.log(magyr);
    const yrr = magyr?.[0];
    const mnth = magyr?.[1];
    const dtt = magyr?.[2];
    console.log(yrr + "," + mnth + "," + dtt);



    const pool = await sql.connect(sqlConfig);
    const req = pool.request();

    req.input('publishDate_Year', 2021);
    req.input('publishDate_month', 8);
    req.input('publishDate_dd', 1);


    const article = await req.query(`select b.ID, a.Cat_Id,a.Category_name,a.lang_id,b.StoryFile,b.publishDate,
    b.status,a.active,c.Language from (select Cat_Id,Category_name,lang_id,active from 
        DyanamicCategory  union select Cat_Id,Category_name,lang_id,active from 
        NIScategory ) a left join newsStory b on b.category_id=a.Cat_Id left join
         Mst_Language c on a.Lang_id=c.Lang_Id where Year(b.publishDate)=@publishDate_Year 
         and Month(b.publishDate)=@publishDate_month and DAY(b.publishDate)=@publishDate_dd 
         and b.status=6 and a.active=1 order by publishDate desc`)


    return NextResponse.json({
        success: true,
        message: 'record fetched',
        article

    },
        { status: 201 });
}