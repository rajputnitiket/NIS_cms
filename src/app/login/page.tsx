'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../custom.css'
import usr from "@/app/images/user.png"
import rhf from "@/app/images/rfh.png"
import clsx from 'clsx';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '../lib/action';
import { error } from 'console';



export default function Loginpage() {


    const router = useRouter()

    const [user, setUser] = useState({
        username: "",
        password: "",

    })
    const [usrCaptcha, setUsrcaptcha] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [focusedInput, setFocusedInput] = useState(null);
    const [captchaCode, setCaptchaCode] = useState("")
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const [loginError, setLoginError] = useState("");


    const validateInputs = () => {
        let isValid = true;

        if (user.username.trim() === "") {
            setUsernameError("Username is required");
            isValid = false;
        } else {
            setUsernameError("");
        }

        if (user.password.trim() === "") {
            setPasswordError("Password is required");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (usrCaptcha.trim() === "") {
            setCaptchaError("Verification code is required");
            isValid = false;
        } else {
            setCaptchaError("");
        }

        return isValid;
    };





    const onLogin = async () => {
        try {
            if (!validateInputs()) {
                return;
            }
            if (!(usrCaptcha === captchaCode)) {
                setCaptchaError("captcha mismatch");
                return;

            }
            setLoading(true)
            const response = await axios.post("/api/users/login", user)
            console.log(response);
            console.log("login success", response.data);
            router.push('/dashboardN')
        } catch (error: any) {
            setLoginError("Check your credential");
            console.log(error + "login Failed");
            toast.error(error.message)

        }
    }
    const [captchaUrl, setCaptchaUrl] = useState('');

    useEffect(() => {
        const fetchCaptcha = async () => {
            try {
                const response = await fetch('/api/users/verification');
                if (!response.ok) {
                    throw new Error('Failed to fetch CAPTCHA image');
                }
                const responseData = await response.json();
                console.log(responseData);

                const imageData = Buffer.from(responseData.buffer.data).toString("base64");
                const capData = responseData.captchaCode;
                setCaptchaCode(capData);
                const imageUrl = `data:image/png;base64,${imageData}`;
                setCaptchaUrl(imageUrl);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCaptcha();
    }, []);

    useEffect(() => {
        if (user.username.length > 0 && user.password.length > 0 && usrCaptcha.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user.username, user.password, usrCaptcha])
    const handleInputFocus = (inputName: any) => {
        setFocusedInput(inputName);
    };
    useEffect(() => {
        setLoginError("");
    }, [setUser])




    return (
        <>

            <div>
                <center>
                    <div className="col-md-4 col-xs-12 n_pp">
                        <div className={clsx('form-container', { 'has-error': loginError !== '' })}>
                            <div className="form-header">
                                <h2>
                                    <img src={usr.src} style={{ width: '76%' }} />
                                </h2>
                            </div>

                            <div className="col-md-12 hdr_ns">
                                New India Samachar
                            </div>
                            <div className={clsx('form-group', {
                                'form-group focused': focusedInput === 'username' || user.username.trim() !== '',
                                'text-danger': usernameError !== '' || loginError !== '',
                            })}>
                                <label className={clsx('control-label', {
                                    focused: focusedInput === 'username',
                                })} >Enter User Name</label>
                                <input
                                    className=" form-control"
                                    id="username"
                                    value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    onFocus={() => handleInputFocus('username')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder=""
                                    type="text"
                                />
                                {usernameError && (
                                    <div className="text-danger">{usernameError}</div>
                                )}
                            </div>
                            <div className={clsx('form-group', {
                                'form-group focused': focusedInput === 'password' || user.password.trim() !== '',
                                'text-danger': passwordError !== '' || loginError !== '',
                            })}>
                                <label className={clsx('control-label', {
                                    focused: focusedInput === 'password',
                                })} >Enter Password</label>
                                <input
                                    className="form-control"
                                    id="password"
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    onFocus={() => handleInputFocus('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder=""
                                    type="password"
                                />
                                {passwordError && (
                                    <div className="text-danger">{passwordError}</div>
                                )}
                            </div>
                            <div className="form-group my-2 ">
                                <img id="imgCaptcha" src={captchaUrl} alt="Captcha Image" />
                                <div className="rl_od col-md-3" onClick={() => window.location.reload()} >
                                    <img src={rhf.src} className="img_od" />
                                </div>
                                <span id="lblCaptchaMessage"></span>
                            </div>
                            <div className={clsx('form-group', {
                                'form-group focused': focusedInput === 'txtVerificationCode' || usrCaptcha.trim() !== '',
                                'text-danger': captchaError !== '',
                            })}>
                                <label className={clsx('control-label', {
                                    focused: focusedInput === 'txtVerificationCode',
                                })} >Enter Verification Code</label>
                                <input
                                    type="text" maxLength={300}
                                    id="txtVerificationCode"
                                    tabIndex={2}
                                    autoComplete="off"
                                    onCopy={(e) => e.preventDefault()}
                                    onPaste={(e) => e.preventDefault()}
                                    className="form-control"
                                    onFocus={() => handleInputFocus('txtVerificationCode')}
                                    onBlur={() => setFocusedInput(null)}
                                    onChange={(e) => setUsrcaptcha(e.target.value)}
                                />
                                {captchaError && (
                                    <div className="error-message ">{captchaError}</div>
                                )}
                            </div>
                            <div className="form-group my-2" style={{ padding: '0px 43px' }}>
                                <div className="col-md-12">
                                    <input type="submit" onClick={onLogin} name="Button1" value="Login" id="Button1" className="bbtn" />
                                </div>
                            </div>
                            {loginError && (
                                <label className='text-danger'>Check your credential</label>
                            )}
                        </div>
                    </div>

                </center>
            </div>

            <style jsx>{`
                .error-message {
                    color: red;
                    font-size: 0.875rem; /* Adjust font size as needed */
                    font-weight: bold;
                    display: inline-block;
                }

                .hdr_ns {
                    font-size: 1.6rem;
                    text-align: center;
                    font-weight: 700;
                    color: #001f60;
                    text-transform: uppercase;
                }

                .img_od {
                    width: 60px;
                    cursor: pointer;
                }

                .n_pp {
                    padding-left: 0px;
                    padding-right: 0px;
                }

                .fg_p {
                    text-align: right !important;
                    width: 100%;
                }

                a {
                    text-decoration: none !important;
                }

                .form-header {
                    text-align: center;
                }

                .form-header h2 {
                    font-weight: 600;
                    margin-bottom: 30px;
                    width: 120px;
                    height: 120px;
                    border-radius: 100%;
                    background-color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: -80px auto 0;
                    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.19);
                    color: #ffffff;
                }

                .container {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }

                .form-container {
                    width: 100%;
                    height: 473px;
                    position: relative;
                    background: #ffffff;
                    padding: 22px 56px;
                    margin: 100px 17px;
                    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.19);
                }

                .bbtn {
                    background: #1a73e8 !important;
                    color: #fff;
                    border-radius: 4px;
                    text-transform: none;
                    line-height: 15px;
                    min-width: 60px;
                    overflow: hidden;
                    position: relative;
                    text-align: center;
                    border: none;
                    cursor: pointer;
                    height: 36px;
                    padding: 0 22px 0 24px;
                }

                .form-group {
                    display: flex;
                    height: 55px;
                }

                .control-label {
                    font-size: 16px;
                    font-weight: 400;
                    opacity: 1;
                    pointer-events: none;
                    position: absolute;
                    transform: translate3d(0, 22px, 0) scale(1);
                    transform-origin: left top;
                    transition: 240ms;
                    line-height: 29px;
                }

                .form-group.focused .control-label {
                    opacity: 1;
                    transform: scale(0.75);
                    color: #2196f3;
                }

                .form-control {
                    align-self: flex-end;
                }

                .form-control::-webkit-input-placeholder {
                    color: transparent;
                    transition: 240ms;
                }

                .form-control:focus::-webkit-input-placeholder {
                    transition: none;
                }

                .form-group.focused .form-control::-webkit-input-placeholder {
                    color: #bbb;
                }

                /* CSS from Bootstrap Start */
                .form-control {
                    display: block;
                    width: 100%;
                    height: 37px;
                    padding: 6px 16px;
                    font-size: 13px;
                    line-height: 1.846;
                    color: #666666;
                    background-color: transparent;
                    background-image: none;
                    border: 1px solid transparent;
                    border-radius: 3px;
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
                    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
                }

                .form-control:focus {
                    border-color: #66afe9;
                    outline: 0;
                    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
                }

                .form-control::-moz-placeholder {
                    color: #bbbbbb;
                    opacity: 1;
                }

                .form-control:-ms-input-placeholder {
                    color: #bbbbbb;
                }

                .form-control::-webkit-input-placeholder {
                    color: #bbbbbb;
                }

                .form-control::-ms-expand {
                    border: 0;
                    background-color: transparent;
                }

                .form-control[disabled],
                .form-control[readonly],
                fieldset[disabled] .form-control {
                    background-color: transparent;
                    opacity: 1;
                }

                .form-control[disabled],
                fieldset[disabled] .form-control {
                    cursor: not-allowed;
                }

                textarea.form-control {
                    height: auto;
                }

                input[type="search"] {
                    -webkit-appearance: none;
                }

                textarea,
                textarea.form-control,
                input.form-control,
                input[type=text],
                input[type=password],
                input[type=email],
                input[type=number],
                [type=text].form-control,
                [type=password].form-control,
                [type=email].form-control,
                [type=tel].form-control,
                [contenteditable].form-control {
                    padding: 0;
                    border: none;
                    border-radius: 0;
                    -webkit-appearance: none;
                    box-shadow: inset 0 -1px 0 #dddddd;
                    font-size: 16px;
                }

                textarea:focus,
                textarea.form-control:focus,
                input.form-control:focus,
                input[type=text]:focus,
                input[type=password]:focus,
                input[type=email]:focus,
                input[type=number]:focus,
                [type=text].form-control:focus,
                [type=password].form-control:focus,
                [type=email].form-control:focus,
                [type=tel].form-control:focus,
                [contenteditable].form-control:focus {
                    box-shadow: inset 0 -2px 0 #2196f3;
                }

                textarea[disabled],
                textarea.form-control[disabled],
                input.form-control[disabled],
                input[type=text][disabled],
                input[type=password][disabled],
                input[type=email][disabled],
                input[type=number][disabled],
                [type=text].form-control[disabled],
                [type=password].form-control[disabled],
                [type=email].form-control[disabled],
                [type=tel].form-control[disabled],
                [contenteditable].form-control[disabled],
                textarea[readonly],
                textarea.form-control[readonly],
                input.form-control[readonly],
                input[type=text][readonly],
                input[type=password][readonly],
                input[type=email][readonly],
                input[type=number][readonly],
                [type=text].form-control[readonly],
                [type=password].form-control[readonly],
                [type=email].form-control[readonly],
                [type=tel].form-control[readonly],
                [contenteditable].form-control[readonly] {
                    box-shadow: none;
                    border-bottom: 1px dotted #ddd;
                }

                textarea.input-sm,
                textarea.form-control.input-sm,
                input.form-control.input-sm,
                input[type=text].input-sm,
                input[type=password].input-sm,
                input[type=email].input-sm,
                input[type=number].input-sm,
                [type=text].form-control.input-sm,
                [type=password].form-control.input-sm,
                [type=email].form-control.input-sm,
                [type=tel].form-control.input-sm,
                [contenteditable].form-control.input-sm {
                    font-size: 12px;
                }

                textarea.input-lg,
                textarea.form-control.input-lg,
                input.form-control.input-lg,
                input[type=text].input-lg,
                input[type=password].input-lg,
                input[type=email].input-lg,
                input[type=number].input-lg,
                [type=text].form-control.input-lg,
                [type=password].form-control.input-lg,
                [type=email].form-control.input-lg,
                [type=tel].form-control.input-lg,
                [contenteditable].form-control.input-lg {
                    font-size: 17px;
                }

                select,
                select.form-control {
                    border: 0;
                    border-radius: 0;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    padding-left: 0;
                    padding-right: 0\\9;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAJ1BMVEVmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmaP/QSjAAAADHRSTlMAAgMJC0uWpKa6wMxMdjkoAAAANUlEQVR4AeXJyQEAERAAsNl7Hf3X6xt0QL6JpZWq30pdvdadme+0PMdzvHm8YThHcT1H7K0BtOMDniZhWOgAAAAASUVORK5CYII=);
                    background-size: 13px;
                    background-repeat: no-repeat;
                    background-position: right center;
                    box-shadow: inset 0 -1px 0 #dddddd;
                    font-size: 16px;
                    line-height: 1.5;
                }

                select::-ms-expand,
                select.form-control::-ms-expand {
                    display: none;
                }

                select.input-sm,
                select.form-control.input-sm {
                    font-size: 12px;
                }

                select.input-lg,
                select.form-control.input-lg {
                    font-size: 17px;
                }

                select:focus,
                select.form-control:focus {
                    box-shadow: inset 0 -2px 0 #2196f3;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAJ1BMVEUhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISF8S9ewAAAADHRSTlMAAgMJC0uWpKa6wMxMdjkoAAAANUlEQVR4AeXJyQEAERAAsNl7Hf3X6xt0QL6JpZWq30pdvdadme+0PMdzvHm8YThHcT1H7K0BtOMDniZhWOgAAAAASUVORK5CYII=);
                }

                select[multiple],
                select.form-control[multiple] {
                    background: none;
                }

                body {
                    background-color: #f6f6f6;
                }
            `}</style>



        </>
    );
}
