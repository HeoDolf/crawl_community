import React from 'react'
import './../../assets/animate.css'

const ContentItem = ({ content, isNew })=>{
    return (
        <li className={`collection-item avatar ${isNew ? 'new animated bounceInLeft p13s' : ''}`} >

            <img className="circle empty" /> 
            <p className="title"><a target="new-tab" href={content.url}>{ content.title }</a></p>
            <p className="row">
                <span className="writer col s6 left-align">{ content.writer }</span>
                <span className="date col s6 right-align">{ content.date_arr[1] /* 0: date, 1: Time */ }</span>
            </p>
            {
                isNew
                ? <a href="#!" className="new-icon secondary-content">
                    <i className="material-icons">fiber_new</i>
                </a>
                : null
            }
        </li>
    )
}
const ContentList = ({ contents, display })=>{
    const news = contents.new.map( (item, index)=><ContentItem key={index} content={item.content} isNew={true} /> )
    const olds = contents.old.map( (item, index)=><ContentItem key={index} content={item.content} isNew={true} /> )
    return (
        <div className="content-wrapper">
            <ul className="collection">
                { news }
                {/*  */}
                { olds }
            </ul>
        </div>
    )
}

export { ContentList }
