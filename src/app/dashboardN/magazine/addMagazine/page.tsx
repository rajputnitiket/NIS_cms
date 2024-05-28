'use client';

import axios from 'axios';
import { event } from 'jquery';
import { useEffect, useRef, useState } from 'react';

interface Language {
    Lang_Id: number;
    Language: string;
}


export default function page() {
    const [file, setFile] = useState<File>();
    const ref = useRef<HTMLInputElement>(null);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [flipBookLink, setFlipBookLink] = useState('');
    const [publishDate, setPublishDate] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Your submission logic here
    };



    useEffect(() => {
        const fetchLang = async () => {
            try {
                const response = await axios.post('../api/lang');
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

        if (!file) return;
        try {
            const data = new FormData();
            data.append('file', file);
            data.append('title', title);
            data.append('magLang', selectedLanguage);
            data.append('flipURL', flipBookLink);
            data.append('publishDate', publishDate);
            const res = await fetch("/api/magazine/addMag", {
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

            <form onSubmit={submit}>
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
                                style={{ width: '700px' }}
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
                                style={{ width: '500px' }}
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
                            <input type="submit" className="button" value="Upload"></input>
                        </span>
                        <div className="clear"></div>
                    </div>

                </div>
            </form>
        </>
    );
}