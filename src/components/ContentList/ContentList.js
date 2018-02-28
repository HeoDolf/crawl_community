import React from 'react'

const ContentItem = ({ content })=>{
    return (
        <li className="collection-item avatar">
            {/* Need to hyper-link */}
            <img className="circle empty" /> 
            <span className="title">{ content.title }</span>
            <p>
                { content.writer }
                { content.date[1] /* 0: date, 1: Time */ }
            </p>
            <a href="#!" className="secondary-content">
                <i className="material-icons">grade</i>
            </a>
        </li>
    )
}

const ContentList = ({ contents })=>{
    return (
        <ul className="content-list collection">
        {
            contents.map((content, index)=><ContentItem key={index} content={content}/>)
        }
        </ul>
    )
}

export default ContentList
