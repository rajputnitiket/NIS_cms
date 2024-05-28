import React from 'react';


interface Magazine {
    imgSrc: string;
    pdfLink: string;
    flipBookLink: string;
    language: string;
}

const magazines: Magazine[] = [
    {
        imgSrc: 'https://newindiasamachar.pib.gov.in/WriteReadData/Magazine//2024/Mar/M202403162.jpg',
        pdfLink: 'https://newindiasamachar.pib.gov.in/WriteReadData/Magazine//2024/Mar/M202403162.pdf',
        flipBookLink: 'http://newindiasamachar.pib.gov.in/WriteReadData/flipbook/2024/Mar/2nd/Hindi/index.html',
        language: 'Hindi'
    },
    {
        imgSrc: 'https://newindiasamachar.pib.gov.in/WriteReadData/Magazine//2024/Mar/M202403161.jpg',
        pdfLink: 'https://newindiasamachar.pib.gov.in/WriteReadData/Magazine//2024/Mar/M202403161.pdf',
        flipBookLink: 'http://newindiasamachar.pib.gov.in/WriteReadData/flipbook/2024/Mar/2nd/English/index.html',
        language: 'English'
    },
    {
        imgSrc: 'https://newindiasamachar.pib.gov.in/WriteReadData/Magazine//2024/Mar/M2024031610.jpg',
        pdfLink: 'https://newindiasamachar.pib.gov.in/WriteReadData/Magazine//2024/Mar/M2024031610.pdf',
        flipBookLink: 'http://newindiasamachar.pib.gov.in/WriteReadData/flipbook/2024/Mar/2nd/Assamese/index.html',
        language: 'Assamese'
    },
    // Add more magazine entries as needed
];

const MagazineList: React.FC = () => {
    return (
        <div id="internal-content">
            <div className="content-area">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><a href="Dashboard.aspx">Home</a></li>
                        <li><a href="#">Uploaded Latest Issue</a></li>
                    </ul>
                </div>
                <div className="container">
                    <div className="component">
                        <div id="ContentPlaceHolder1_mgzine_w">
                            <ul className="align">
                                {magazines.map((magazine, index) => (
                                    <li key={index}>
                                        <div className="card wh_bx">
                                            <figure className="book">
                                                <ul className="hardcover_front">
                                                    <li>
                                                        <img src={magazine.imgSrc} alt="" width="100%" height="100%" />
                                                    </li>
                                                    <li></li>
                                                </ul>
                                                <ul className="page">
                                                    <li></li>
                                                    <li>
                                                        <a className="btn" href={magazine.pdfLink} target="_blank" title="Download PDF">Download <i className="fa fa-download"></i></a>
                                                    </li>
                                                    <li></li>
                                                    <li></li>
                                                    <li></li>
                                                </ul>
                                                <ul className="hardcover_back">
                                                    <li></li>
                                                    <li></li>
                                                </ul>
                                                <ul className="book_spine">
                                                    <li></li>
                                                    <li></li>
                                                </ul>
                                            </figure>
                                            <figcaption className="cap_pp"></figcaption>
                                            <div className="ln_book">{magazine.language}</div>
                                            <a href={magazine.flipBookLink} className="more11" target="_blank">Flip Book</a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MagazineList;
