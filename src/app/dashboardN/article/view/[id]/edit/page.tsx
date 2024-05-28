'use client';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'

interface Article {
    ID: number,
    Cat_Id: string,
    Category_name: string,
    Language: string,
    publishDate: string,
    Lang_id: number,
}
interface Language {
    Lang_Id: number;
    Language: string;
}
interface Category {
    Cat_Id: number;
    Category_name: string;
}

export default function page() {

    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [file, setFile] = useState<File>();
    const [fileName, setFileName] = useState('');
    const ref = useRef<HTMLInputElement>(null);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCat, setSelectedCat] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await axios.post(`/api/article/view/${id}`, id);
                setArticle(res.data.article.recordset[0]);
                console.log(res.data.article.recordset[0]);
                setSelectedLanguage(res.data.article.recordset[0].Lang_id);
                setSelectedCat(res.data.article.recordset[0].category_id);
                setPublishDate(res.data.article.recordset[0].publishDate.split('T')[0]);
                //setFile(res.data.article.recordset[0].StoryFile)
                console.log(res.data.article.recordset[0].StoryFile);



            } catch (error) {
                console.log(error);
            }
        };

        fetchArticle();
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

    const handleDelete = async () => {
        const rslt = await axios.post(`/api/article/delete/${id}`, id)
        console.log(rslt);

    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitt');
        console.log('File:', file);
        console.log('Title:', selectedCat);
        console.log('Selected Language:', selectedLanguage);

        console.log('Publish Date:', publishDate);
        const data = new FormData();
        if (file === undefined) {
            data.append('flag', "1");
        } else {
            data.append('file', file);
            data.append('flag', "2");
        };
        try {

            data.append('cat_id', selectedCat);
            data.append('lang_id', selectedLanguage);
            data.append('publishDate', publishDate);
            data.append('id', id);
            const res = await fetch(`/api/article/update/${id}`, {
                method: 'POST',
                body: data,
            });

            if (!res.ok) throw new Error(await res.text());

            ref.current && (ref.current.value = '');
            alert("record updated");

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            {article ? (
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
                                    value={fileName}
                                />
                            </span>
                            <div className="clear"></div>
                        </div>
                        <div className="frm_row">
                            <input type="hidden" name="hdnDate" id="ContentPlaceHolder1_hdnDate" value="2024,4,13" />
                            <span className="label1">
                                <label>
                                    Publish Date :</label></span>

                            <span className="input1 ">
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
                                <input type="submit" name="Button2" value="update" id="Button2" className="button" />
                            </span>
                            <span className="button_row">
                                <input type="submit" name="Button2" value="Delete" id="Button2" className="button" onClick={() => handleDelete()} />
                            </span>
                            <div className="clear"></div>
                        </div>
                    </div>
                </form>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
