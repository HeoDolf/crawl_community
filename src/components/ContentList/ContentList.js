import React from 'react'
import './ContentList.css'
import './../../assets/animate.css'

const ContentItem = ({ content, animated })=>{
    return (
        <li className={`collection-item avatar ${animated ? 'animated bounceInLeft p13s' : ''}`}>
            {/* Need to hyper-link */}
            <img className="circle empty" /> 
            <span className="title"><a target="new-tab" href={content.url}>{ content.title }</a></span>
            <p>
                { content.writer }<br/>
                { content.date[1] /* 0: date, 1: Time */ }
            </p>
            <a href="#!" className="secondary-content">
                <i className="material-icons">grade</i>
            </a>
        </li>
    )
}

const ContentList = ({ contents, view })=>{
    let list = null;
    if( contents ){
        list = contents.new.map((content,index)=>{
            return <ContentItem key={"new_"+index} content={content} animated={true} />
        });
        list = list.concat(
            contents.old.slice(view[0], view[1]).map((content,index)=>{
                return <ContentItem key={"old_"+index} content={content} animated={false} />
            })
         )
    }

    return (
        <ul className="content-list collection">
        { list }
        </ul>
    )
}

export default ContentList
