import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "../components/navbar";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import Userverification from "../components/userverification";





const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "",
    description: "",
};



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en">
            <body className={inter.className}>
                <div className="flex flex-col h-screen">
                    <Header />
                    <div id="internal-content" className="glossymenu flex flex-grow ">
                        <div className="w-[249px] bg-[#F4F4F4] h-full text-xl">
                            <aside>
                                <SideNav />
                            </aside>
                        </div>
                        <div className="flex-grow p-6 md:p-12 col-md-8 overflow-y-auto">
                            <Userverification />
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
                                    {children}
                                </div>
                                <div className="clear"> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
