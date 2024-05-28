import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, CanvasRenderingContext2D } from 'canvas';
import { randomBytes } from 'crypto';
import fs from 'fs';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const captchaCode = getRandomText();
        console.log(captchaCode);

        const canvas = createCanvas(200, 60);
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');


        ctx.fillStyle = '#FFA500';
        ctx.fillRect(0, 0, 200, 60);


        ctx.font = 'italic 44px Tahoma';
        ctx.fillStyle = '#FFFFFF';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(captchaCode, 100, 30);


        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(randomInt(0, 200), randomInt(0, 60));
            ctx.lineTo(randomInt(0, 200), randomInt(0, 60));
            ctx.strokeStyle = '#FFFF00';
            ctx.stroke();
        }


        const buffer = canvas.toBuffer('image/png');
        console.log(buffer);

        fs.writeFile('captcha.png', buffer, (err) => {
            if (err) throw err;
        });
        console.log('Image saved as captcha.png');
        const imageData = fs.readFileSync('captcha.png');
        return NextResponse.json({
            headers: {
                'Content-Type': 'image/png'
            },
            buffer,
            captchaCode,

        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}

function getRandomText(): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomText = '';
    for (let i = 0; i < 6; i++) {
        randomText += characters.charAt(randomInt(0, characters.length));
    }
    return randomText;
}


function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
