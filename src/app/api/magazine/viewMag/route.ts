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


    const mag = await req.query(`select a.id,a.title,a.publishDate,a.thumbFile,a.MagFile
    ,b.set_id,a.url,b.Language from tblMagazine a left join Mst_Language b on 
    a.Lang_id=b.Lang_Id where a.status=6  and Year(a.publishDate)=@publishDate_Year 
    and Month(a.publishDate)=@publishDate_month and DAY(a.publishDate)=@publishDate_dd 
    order by a.publishDate desc`)


    return NextResponse.json({
        success: true,
        message: 'record fetched',
        mag

    },
        { status: 201 });
}