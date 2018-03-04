import React from 'react'
import image from './../../assets/image/plus-th.png'
import './EmptyPage.css'

const EmptyPage = ({ modal_id })=>{
    return (
        <div className="page-wrapper empty valign-wrapper">
            <div className="img-wrapper">
                <a href={`#${modal_id}`}><img src={ image }/></a>
            </div>
        </div>
    )
}

export default EmptyPage