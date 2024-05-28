'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'

interface Magazine {
    id: number,
    title: string,
    Language: string,
    publishDate: string,

}

export default function page() {
    const { id } = useParams<{ id: string }>();
    const [publishDate, setPublishDate] = useState('');
    const [mag, setMag] = useState<Magazine[]>([]);
    const router = useRouter();

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit");
        console.log("date", publishDate);

        try {
            const data = new FormData();
            data.append('srcDtt', publishDate);

            const res = await axios.post("/api/magazine/viewMag", data)
            setMag(res.data.mag.recordset)
            console.log(res.data.mag.recordset);

        } catch (error: any) {
            console.log(error);

        }

    };

    const handleDelete = (id: number) => async () => {
        try {
            const response = await axios.post(`/api/magazine/viewMag/${id}/delete`, id);
            console.log("Record deleted:", response.data);
            alert("Record deleted");
        } catch (error) {
            console.error("Error deleting record:", error);
            alert("Failed to delete record");
        }
    }

    const handleEdit = (id: number) => () => {
        router.push(`/dashboardN/magazine/viewMag/${id}`)
    }

    useEffect(() => {
        return () => {
            submit
        };
    }, [handleDelete]);

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
            {mag && mag.length > 0 ? (
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
                                {mag.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.Language}</td>
                                        <td>{item.publishDate.split('T')[0]}</td>
                                        <td><button className="button" onClick={handleEdit(item.id)} >Edit</button></td>
                                        <td><button className="button" onClick={handleDelete(item.id)} >Delete</button></td>
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
