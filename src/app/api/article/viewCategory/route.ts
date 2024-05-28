
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


    const article = await req.query(`select Cat_Id,lang_id,Category_name,publishDate from DyanamicCategory
     where Year(publishDate)=@publishDate_Year and Month(publishDate)=@publishDate_month and 
     DAY(publishDate)=@publishDate_dd and status=6 order by publishDate desc`)


    return NextResponse.json({
        success: true,
        message: 'record fetched',
        article

    },
        { status: 201 });
}