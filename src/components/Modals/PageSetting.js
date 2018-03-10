import React from 'react'
import axios from 'axios'

import FixedFooter from './FixedFooter.js'

const PageSetting = ({ id, title, handler, index, options })=>{
    const selected = options.community;

    return (
        <FixedFooter id={id} title={ title } onAgree={ handler.onAgree } onDegree={ handler.onDegree } >
            <form id="create_page" className="row">
                <div className="row">
                    <div className="input-field col s2">
                        <input id="page_index" name="index" type="text" value={ options.pageIndex } readOnly/>
                        <label htmlFor="page_index" className="active">Index</label>
                    </div>
                    <div className="input-field col s10">
                        <input id="page_title" name="title" type="text"/>
                        <label htmlFor="page_title">Title</label>
                    </div>
                </div>
            </form>
        </FixedFooter>
    )
}

export default PageSetting