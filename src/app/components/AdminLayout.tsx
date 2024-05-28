import Head from 'next/head';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <Head>
                <title>Admin Panel</title>
                {/* Include your CSS files here */}
                <link rel="stylesheet" href="/css/style.css" />
                <script src="/js/jquery.min.js"></script>
                {/* Include other scripts */}
            </Head>
            <body className="i-bg">
                <header>
                    <h2>NEW INDIA SAMACHAR</h2>
                    <div className="right-link">
                        <ul style={{ float: 'right', paddingRight: '75px' }}>
                            <li className="dashbord"><Link href="/dashboard">Dashboard</Link></li>
                            <li className="logout"><Link href="/logout">Logout</Link></li>
                        </ul>
                    </div>
                    <div className="clear"></div>
                </header>
                <div id="internal-content">
                    <aside>
                        {/* Your menu structure goes here */}
                    </aside>
                    <section>
                        <div className="welcome-s">
                            <p><strong className="col-t">Hi, User</strong>, NEW INDIA SAMACHAR </p>
                            <span>{new Date().toLocaleDateString()}</span>
                            <div className="clear"></div>
                        </div>
                        <div className="breadcrum">
                            <ul>
                                <li className="last"><a href="#">{router.pathname}</a></li>
                            </ul>
                            <div className="clear"></div>
                        </div>
                        <div className="content-section">
                            <div className="content-heading">
                                <h2>NIS: Title</h2>
                            </div>
                            <div className="content-area">
                                {/* Content from each page will be inserted here */}
                                {children}
                            </div>
                            <div className="clear"></div>
                        </div>
                    </section>
                </div>
                <div className="clear"></div>
            </body>
        </>
    );
};

export default AdminLayout;
