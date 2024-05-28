'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface Article {
    ID: number,
    Cat_Id: string,
    Category_name: string,
    Language: string,
    publishDate: string,

}

export default function page() {
    const [publishDate, setPublishDate] = useState('');
    const [article, setArticle] = useState<Article[]>([]);
    const router = useRouter();
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit");
        console.log("date", publishDate);

        try {
            const data = new FormData();
            data.append('srcDtt', publishDate);

            const res = await axios.post("/api/article/view", data)
            setArticle(res.data.article.recordset);
            console.log(res.data.article.recordset);

        } catch (error: any) {
            console.log(error);

        }

    };

    const handleEdit = (id: number) => () => {
        console.log(id);

        router.push(`/dashboardN/article/view/${id}/edit`);
    }

    return (
        <>
            <form onSubmit={submit}>
                <div className="feedback">
                    <div className="frm_row">
                        <input type="hidden" name="Date" id="hdnDate" />
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
                            <input type="submit" className="button" value="search"></input>
                        </span>
                        <div className="clear"></div>
                    </div>
                </div>
            </form>
            {article && article.length > 0 ? (
                <div className="content-area bg-white ">
                    <div id="mgzine_w">
                        <table className="gridview" cellSpacing="0" rules="all" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Language Name</th>
                                    <th>Publish date</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {article.map(item => (
                                    <tr key={item.ID}>
                                        <td>{item.ID}</td>
                                        <td>{item.Language}</td>
                                        <td>{item.publishDate.split('T')[0]}</td>
                                        <td><button className="button" onClick={handleEdit(item.ID)} >Edit</button></td>
                                        <td><button className="button" >Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>No magazine data available</div>
            )}
        </>
    )
}
