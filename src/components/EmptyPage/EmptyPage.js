import React from 'react'
import image from './../../assets/image/plus-th.png'
import './EmptyPage.css'

import { PageSetting } from './../../components'

const EmptyPage = ({ handler, options })=>{
    const modal_id = "CreatePage";
    return (
        <div className="wrapper empty valign-wrapper">
            <div className="img-wrapper">
                <a href={`#${modal_id}`}><img src={ image }/></a>
            </div>
            <PageSetting 
                    id={modal_id} 
                    title="페이지 생성" 
                    handler={handler} 
                    options={options}/>
        </div>
    )
}

export default EmptyPage