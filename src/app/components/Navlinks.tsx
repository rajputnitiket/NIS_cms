'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
    {
        name: "Dashboard",
        href: "/dashboard",
        sublinks: []
    },
    {
        name: "Magazine",
        href: "/magazine",
        sublinks: [
            { name: "Add Magazine", href: "/dashboardN/magazine/addMagazine" },
            { name: "Vie Magazine", href: "/dashboardN/magazine/viewMag" },
        ]
    },
    {
        name: "Add News Article",
        href: "/article",
        sublinks: [
            { name: "Add Article", href: "/dashboardN/article/addArticle" },
            { name: "View Article", href: "/dashboardN/article/view" },

        ]
    },
    {
        name: "Add News Article Title",
        href: "",
        sublinks: [
            { name: "Add Title", href: "/dashboardN/article/addCategory" },
            { name: "View Title", href: "/dashboardN/article/viewCategory" },
        ]
    },
    { name: "Banner", href: "/dashboardN/banner/addBanner", sublinks: [] },
    { name: "Show Uploaded Latest Issue", href: "/dashboardN/", sublinks: [] },
    { name: "Show Uploaded News Articles", href: "/dashboardN", sublinks: [] }
];

const Navlinks: React.FC = () => {
    const pathname = usePathname();
    const [activeLink, setActiveLink] = useState<string | null>(null);
    const [arrowRotation, setArrowRotation] = useState<{ [key: string]: boolean }>({});

    const toggleArrowRotation = (linkName: string) => {
        setArrowRotation(prevState => ({
            ...prevState,
            [linkName]: !prevState[linkName]
        }));
    };

    return (
        <div>


            <div className="glossymenu">
                {links.map((link) => (
                    <div key={link.name}>
                        <ul>
                            {link.sublinks && link.sublinks.length > 0 ? (
                                <li key={link.name} className={`menuitem ${activeLink === link.name ? 'submenuheader' : ''}`} onClick={() => {
                                    setActiveLink(activeLink === link.name ? null : link.name);
                                    toggleArrowRotation(link.name);
                                }}>
                                    <span>{link.name}</span>
                                    <span className="arrow" style={{ marginLeft: 'auto', transform: arrowRotation[link.name] ? 'rotate(0deg)' : 'rotate(90deg)' }}>&#9660;</span>
                                </li>
                            ) : (
                                <li key={link.name} className="menuitem">
                                    <Link href={link.href}>
                                        {link.name}
                                    </Link>
                                </li>
                            )}
                        </ul>
                        <div className="submenu">
                            {link.sublinks.length > 0 && activeLink === link.name && (
                                <ul>
                                    {link.sublinks.map((sublink) => (
                                        <li key={sublink.name}>
                                            <Link href={sublink.href}>
                                                {sublink.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .menuitem {
                    display: flex;
                    justify-content: space-between;
                }
                .arrow {
                    margin-left: 5px;
                    transition: transform 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Navlinks;
