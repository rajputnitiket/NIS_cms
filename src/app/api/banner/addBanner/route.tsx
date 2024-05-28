import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import sharp from 'sharp';


export async function POST(request: NextRequest) {
    const data = await request.formData();
    const magyrr = 2022;
    var d = (new Date().getFullYear().toString() +
        ("0" + (new Date().getMonth() + 1)).slice(-2) +
        ("0" + new Date().getDate()).slice(-2));
    console.log(d);
    const lang_id = data.get('lang_id');
    let MagLanuage = "";

    if (lang_id === "1") {
        MagLanuage = "English";
    }
    else if (lang_id === "2") {
        MagLanuage = "Hindi";
    }
    else if (lang_id == "3") {
        MagLanuage = "Urdu";
    }
    else if (lang_id === "4") {
        MagLanuage = "Bengali";
    }
    else if (lang_id === "6") {
        MagLanuage = "Punjabi";
    }
    else if (lang_id === "8") {
        MagLanuage = "Kannada";
    }
    else if (lang_id === "9") {
        MagLanuage = "Marathi";
    }
    else if (lang_id === "10") {
        MagLanuage = "Assamese";
    }
    else if (lang_id === "11") {
        MagLanuage = "Tamil";
    }
    else if (lang_id === "13") {
        MagLanuage = "Gujarati";
    }
    else if (lang_id === "15") {
        MagLanuage = "Malayalam";
    }
    else if (lang_id === "16") {
        MagLanuage = "Telugu";
    }
    else if (lang_id === "18") {
        MagLanuage = "Odia";
    }


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
    const fileName = MagLanuage + "." + fileExt;


    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `./files/2022/${fileName}`;
    fs.access(path, fs.constants.F_OK, (err: any) => {
        if (err) {
            if (err.code === 'ENOENT') {
                async () => await writeFile(path, buffer);

            } else {
                console.error('Error accessing file:', err);
            }
        }
        else {
            fs.unlink(path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    async () => await writeFile(path, buffer);
                }
            });
        }
    })
    fs.unlink(path, (err: any) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        console.log('File deleted successfully');
    });

    await writeFile(path, buffer);
    async function generateThumbnail(inputPath: string, outputPath: string, resizeRatio: number): Promise<void> {
        await sharp(inputPath)
            .resize({ width: Math.round(resizeRatio * 100) })
            .toFile(outputPath);
    }

    const file1 = lang_id + "." + fileExt;
    const inputImagePath = path;
    const outputThumbnailPath = `./files/2022/${file1}`;
    const resizeRatio = 0.85;

    generateThumbnail(inputImagePath, outputThumbnailPath, resizeRatio)
        .then(() => {
            console.log('Thumbnail generated successfully');
        })
        .catch((error) => {
            console.error('Error generating thumbnail:', error);
        });

    //await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
    return NextResponse.json({
        success: true,
        message: 'record inserted',


    },
        { status: 201 });
}