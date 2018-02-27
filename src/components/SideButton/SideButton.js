import React from 'react'
import './SideButton.css'

const SideButton = ({ disable })=>{
    return (
        <div className='side-button valign-wrapper'>
            <a className={`btn-left ${disable == -1 ? 'disable' : ''}`}>
                <i className="medium material-icons">chevron_left</i>
            </a>
            <a className={`btn-right ${disable == 1 ? 'disable' : ''}`}>
                <i className="medium material-icons">chevron_right</i>
            </a>
        </div>
    )
}

export default SideButton