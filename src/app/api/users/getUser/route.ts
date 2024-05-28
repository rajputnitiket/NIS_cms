import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';






const secret = process.env.TOKEN_SECRET!;
console.log(secret);


export async function POST(request: NextRequest) {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
        return NextResponse.json({ error: 'No cookies found' }, { status: 400 });
    }
    const cookies = parse(cookieHeader);
    const token = cookies.token;

    try {

        const decoded = jwt.verify(token, secret) as { [key: string]: any };
        const userData = decoded;
        console.log(userData.username);
        return NextResponse.json({ success: true, userData }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }


}