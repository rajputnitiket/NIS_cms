'use client';

import axios from 'axios';
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react';

interface Language {
    Lang_Id: number;
    Language: string;
}
interface Magazine {
    id: number,
    title: string,
    thumbFile: string,
    MagFile: string,
    url: string,
    Lang_Id: number
}


export default function page() {
    const { id } = useParams<{ id: string }>();
    const [magazine, setMagazine] = useState<Magazine>();
    const [file, setFile] = useState<File>();
    const ref = useRef<HTMLInputElement>(null);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [flipBookLink, setFlipBookLink] = useState('');
    const [publishDate, setPublishDate] = useState('');



    useEffect(() => {
        const fetchMagzine = async () => {
            try {
                const res = await axios.post(`/api/magazine/viewMag/${id}`, id);
                setMagazine(res.data.magazine.recordset[0]);
                console.log(res.data.magazine.recordset[0]);
                setSelectedLanguage(res.data.magazine.recordset[0].Lang_Id);
                setPublishDate(res.data.magazine.recordset[0].publishDate.split('T')[0]);
                setTitle(res.data.magazine.recordset[0].title);
                setFlipBookLink(res.data.magazine.recordset[0].url);


            } catch (error) {
                console.log(error);
            }
        };

        fetchMagzine();
    }, [id]);


    useEffect(() => {
        const fetchLang = async () => {
            try {
                const response = await axios.post("/api/lang");
                console.log(response);
                setLanguages(response.data.Languages.recordset);
                setSelectedLanguage(response.data.Languages.recordset[0])


            } catch (error: any) {
                console.log(error + "error in fetching languages");


            }
        };
        fetchLang();
    }, []);



    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitt');
        console.log('File:', file);
        console.log('Title:', title);
        console.log('Selected Language:', selectedLanguage);
        console.log('Cover Image:', coverImage);
        console.log('Flip Book Link:', flipBookLink);
        console.log('Publish Date:', publishDate);
        const data = new FormData();
        if (file === undefined) {
            data.append('flag', "1");
        } else {
            data.append('file', file);
            data.append('flag', "2");
        };
        try {
            data.append('id', id);
            data.append('title', title);
            data.append('magLang', selectedLanguage);
            data.append('flipURL', flipBookLink);
            data.append('publishDate', publishDate);
            const res = await fetch(`/api/magazine/viewMag/${id}/update`, {
                method: 'POST',
                body: data,
            });

            if (!res.ok) throw new Error(await res.text());

            ref.current && (ref.current.value = '');

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            {magazine ?
                (<form onSubmit={submit}>
                    <div className="feedback">

                        <div className="frm_row">
                            <span className="label1">
                                <label htmlFor="ddlLanguage">Select Language<strong className="text3">* </strong></label>
                            </span>
                            <span className="input1">
                                <select id="ddlLanguage" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                                    <option value="">Select language</option>
                                    {languages.map((language) => (
                                        <option key={language.Lang_Id} value={language.Lang_Id}>
                                            {language.Language}
                                        </option>
                                    ))}

                                </select>
                            </span>
                            <div className="clear"></div>
                        </div>
                        <div className="frm_row">
                            <span className="label1">
                                <label htmlFor="txtPageTitle">Title<strong className="text3">* </strong></label>
                            </span>
                            <span className="input1 ">
                                <input
                                    type="text"
                                    id="txtPageTitle"
                                    className="input_class"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter Title"
                                    autoComplete="off"

                                />
                            </span>
                            <div className="clear"></div>
                        </div>
                        <div className="frm_row">
                            <span className="label1">
                                <label>Upload Cover Image</label>
                            </span>
                            <span className="input1">
                                <input
                                    type="file"
                                    id="file"
                                    className="multil"
                                    onChange={(e) => setFile(e.target.files?.[0])}
                                    ref={ref}
                                />
                            </span>
                            <div className="clear"></div>
                        </div>
                        <div className="frm_row">
                            <span className="label1">
                                <label htmlFor="txtFlipBookLink">Flip Book Link<strong className="text3">* </strong></label>
                            </span>
                            <span className="input1">
                                <input
                                    type="text"
                                    id="txtFlipBookLink"
                                    className="input_class"
                                    value={flipBookLink}
                                    onChange={(e) => setFlipBookLink(e.target.value)}
                                    placeholder="Enter Link"
                                    autoComplete="off"

                                />
                            </span>
                            <div className="clear"></div>
                        </div>
                        <div className="frm_row">
                            <span className="label1">
                                <label>Publish Date :</label>
                            </span>
                            <span className="input1">
                                <input
                                    type="date"
                                    id="datepick"
                                    className="input_class"
                                    value={publishDate}
                                    onChange={(e) => setPublishDate(e.target.value)}
                                    placeholder="Select Date"
                                />
                            </span>
                            <div className="clear"></div>
                        </div>
                        <div className="frm_row">
                            <span className="button_row">
                                <input type="submit" className="button" value="Update"></input>
                            </span>
                            <div className="clear"></div>
                        </div>

                    </div>
                </form>) :
                (
                    <div>Loading...</div>
                )}
        </>
    );
}