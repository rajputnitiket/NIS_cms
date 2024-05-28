import Link from 'next/link';
import React from 'react';
import header from '../app/images/header-bg.jpg'


const headerimg = '@/app/images/header-bg.jpg'
const Navbar = () => {
    return (
        <nav className="flex flex-row space-x-6 border-b mb-5 px-5 h-[61px] hover:bg-gray-600 items-center bg-[url('../app/images/header-bg.jpg')]" >
            <div className='basis-[80%] '>
                <Link className='col font-bold text-l text-[#ee8425]' href="/">NEW INDIA SAMACHAR</Link>

            </div>

            <ul className='flex  space-x-6 text-white justify-items-end '>
                <li className='hover:underline'><Link href="/">Dashboard</Link></li>
                <li className='hover:underline'><Link href="/">LogOut</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
