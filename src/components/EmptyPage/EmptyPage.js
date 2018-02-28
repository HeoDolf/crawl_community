import React from 'react'
import image from './../../assets/image/plus-th.png'
import './EmptyPage.css'

const EmptyPage = ({/* props */})=>{
    return (
        <div className="page-wrapper valign-wrapper">
            <div className="img-wrapper">
                <img src={ image }/>
            </div>
        </div>
    )
}

export default EmptyPage