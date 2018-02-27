import React from 'react'
import './Header.css'


const Header = ({ onPageChange, logined, pages, active })=>{
    const myPages = pages.map((page, index)=>{
        return (
            <li key={index} className={ active === index ? 'active' : '' }>
                <a onClick={ ()=>{onPageChange( index )} }>{page.title}</a>
            </li>
        )
    });

    return (
        <header className="main-header">
            <div className="wrapper">
                <ul className="page-box">
                    <li className={ active === -1 ? 'active' : '' }>
                        <a onClick={ ()=>{onPageChange(-1)} }>Home</a>
                    </li>
                    { myPages }
                </ul>
                <ul className="user-box">
                    <li>
                    {
                        logined
                        ? <a>{logined.nickname} 님</a>
                        : <a>회원가입</a>
                    }
                    </li>
                    <li>
                    {
                        logined 
                        ? <a>로그아웃</a>
                        : <a>로그인</a>
                    }
                    </li>
                </ul>
            </div>
        </header>
    )
}
Header.defaultProps = {
    logined: null,
    pages: []
}
export default Header