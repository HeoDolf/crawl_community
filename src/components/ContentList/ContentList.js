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
                <span className="date col s6 right-align">{ content.date[1] /* 0: date, 1: Time */ }</span>
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
    let list = null;
    if( contents ){
        list = contents.new.map((content,index)=>{
            return <ContentItem key={"new_"+index} content={content} isNew={true} />
        });
        list = list.concat(
            contents.old.slice(display[0], display[1]).map((content,index)=>{
                return <ContentItem key={"old_"+index} content={content} isNew={false} />
            })
         )
    }

    return (
        <div className="content-list">
            <ul className="collection">
                { list }
            </ul>
        </div>
    )
}

export default ContentList
