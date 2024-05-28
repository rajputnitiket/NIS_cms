'use client';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

interface Language {
    Lang_Id: number;
    Language: string;
}

export default function FeedbackForm() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [title, setTitle] = useState('');
    const [publishDate, setPublishDate] = useState('');


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
        console.log('Selected Language:', selectedLanguage);
        console.log('Publish Date:', publishDate);
        console.log('category', title);



        const data = new FormData();
        data.append('lang_id', selectedLanguage);
        data.append('publishDate', publishDate);
        data.append('category', title);
        const res = await fetch("/api/article/addCat", {
            method: 'POST',
            body: data,
        });


    };

    return (
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
                        <label htmlFor="category_y">News Articles<strong className="text3">* </strong></label>
                    </span>
                    <span className="input1">
                        <input
                            type="text"
                            id="category_y"
                            className="input_class"
                            placeholder="Enter News Articles"
                            autoComplete="off"
                            style={{ width: '700px', height: 'auto' }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                        <input type="submit" name="Button2" value="Submit" id="ContentPlaceHolder1_Button2" className="button" />
                    </span>
                    <div className="clear"></div>
                </div>
            </div>
        </form>
    );
}
