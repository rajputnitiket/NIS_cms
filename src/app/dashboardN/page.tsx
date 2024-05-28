import React from 'react'

export default function page() {
    return (
        <>
            <div className="welcome-s">
                <p><strong className="col-t">Hi govind,</strong> NEW INDIA SAMACHAR </p>
                <span>Thursday, May 9, 2024 </span>
                <div className="clear"> </div>
            </div>
            <div className="breadcrum">
                <ul>
                    <li className="last"><a href="#"><span id="PageName"></span></a></li>
                </ul>
                <div className="clear"> </div>
            </div>
            <div className="content-section">
                <div className="content-heading">
                    <h2>NIS:<span id="lblTitle"></span></h2>
                </div>
                <div className="content-area">
                    {/* Content Goes Here */}
                </div>
                <div className="clear"> </div>
            </div>
        </>
    );
}