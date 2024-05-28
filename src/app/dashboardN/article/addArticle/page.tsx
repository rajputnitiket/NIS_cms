'use client';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'


interface Language {
    Lang_Id: number;
    Language: string;
}
interface Category {
    Cat_Id: number;
    Category_name: string;
}

export default function page() {

    const [file, setFile] = useState<File>();
    const ref = useRef<HTMLInputElement>(null);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCat, setSelectedCat] = useState('');

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

    useEffect(() => {
        const fetchCat = async () => {
            try {
                const response = await axios.post("/api/category", { lang_id: selectedLanguage });
                console.log(response.data.category.recordset);
                setCategories(response.data.category.recordset);


            } catch (error: any) {
                console.log(error + "error in fetching categories ");


            }
        };
        fetchCat();
    }, [selectedLanguage]);



    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitt');
        console.log('File:', file);
        console.log('Title:', selectedCat);
        console.log('Selected Language:', selectedLanguage);

        console.log('Publish Date:', publishDate);

        if (!file) return;
        try {
            const data = new FormData();
            data.append('file', file);
            data.append('cat_id', selectedCat);
            data.append('lang_id', selectedLanguage);
            data.append('publishDate', publishDate);
            const res = await fetch("/api/article/add", {
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
                        <label htmlFor="ddlLanguage">Select News Articles <strong className="text3">* </strong></label>
                    </span>
                    <span className="input1">
                        <select name="ddCategory" id="ddCategory" value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.Cat_Id} value={category.Cat_Id}>
                                    {category.Category_name}
                                </option>
                            ))}
                        </select>
                    </span>
                    <div className="clear"></div>
                </div>
                <div className="frm_row">
                    <span className="label1">
                        <label>Upload News Articles</label>
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
                    <input type="hidden" name="hdnDate" id="ContentPlaceHolder1_hdnDate" value="2024,4,13" />
                    <span className="label1">
                        <label>
                            Publish Date :</label></span>

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
    )
}
