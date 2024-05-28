'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function UserVerification() {
    const [username, setUsername] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.post('/api/users/getUser');
                console.log(response)
                setUsername(response.data.userData.username);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();

        const currentDate = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
        setDate(formattedDate);
    }, []);

    return (
        <div className="welcome-s">
            <p><strong className="col-t">Hi {username},</strong> NEW INDIA SAMACHAR</p>
            <span>{date}</span>
            <div className="clear"></div>
        </div>
    );
}
