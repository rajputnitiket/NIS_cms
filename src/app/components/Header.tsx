'use client';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';


export default function Header() {
    const router = useRouter()
    const onLogout = async () => {
        try {
            const response = await axios.post("/api/users/logout")
            console.log(response);
            console.log("logout success", response.data);
            router.push('/login')
        } catch (error: any) {

            console.log(error + "login Failed");
            toast.error(error.message)

        }
    }
    return (
        <header>
            <h2 >NEW INDIA SAMACHAR</h2>
            <div className="right-link">
                <ul style={{ float: 'right', paddingRight: '75px' }}>
                    <li className="dashbord"><a href='/dashboard'>Dashboard</a></li>
                    <li className="logout" onClick={onLogout}><a href='#'>Logout</a></li>
                </ul>
            </div>
            <div className="clear"></div>
        </header>
    );
};


