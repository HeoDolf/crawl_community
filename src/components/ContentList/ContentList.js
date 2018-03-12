import React from 'react'
import './ContentList.css'
import './../../assets/animate.css'


function handleRemoveNew( event ){
    event.target.classList.remove('new');
    const icon = event.target.querySelector('.new-icon')
    if( icon ){
        setTimeout(()=>icon.remove(), 300);
    }
}

const ContentItem = ({ content, isNew })=>{
    return (
        <li className={`collection-item avatar ${isNew ? 'new animated bounceInLeft p13s' : ''}`} 
            // onMouseOver={ handleRemoveNew }
            onClick={ handleRemoveNew }>

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
    let news = [];
    let olds = [];

    for(let index = 0; index < contents.new.length; index++){
        const item = contents.new[index];
        news.push(
            <ContentItem key={index} content={item.content} isNew={true} />
        )
    }
    // for(let index = 0; index < contents.old.length; index++){
    for(let index = 0; index < contents.old.length; index++){
        const item = contents.old[index];
        olds.push(
            <ContentItem key={index} content={item.content} isNew={false} />
        )
        // if( index > display[1] ){
        //     break;
        // }
    }

    return (
        <div className="content-wrapper">
            <ul className="collection">
                {
                    news
                }
                {
                    olds
                }
            </ul>
        </div>
    )
}

export default ContentList
