import React from 'react'

function nextPage( current, length, handler ){
    if( current < length.max ){
        current += 1;
    } else {
        current = length.min;
    }
    handler( current );
}
function prevPage( current, length, handler ){
    if( current > length.min ){
        current -= 1;
    } else {
        current = length.max;
    }
    handler( current );
}
const SideButton = ({ disable, current, length, onPageChange })=>{
    return (
        <div className='side-button valign-wrapper'>
            <a className={`btn-left ${ disable ? 'disable' : '' }`} onClick={ (e)=>prevPage(current, length, onPageChange) }>
                <i className="medium material-icons">chevron_left</i>
            </a>
            <a className={`btn-right ${ disable ? 'disable' : '' }`} onClick={ (e)=>nextPage(current, length, onPageChange) }>
                <i className="medium material-icons">chevron_right</i>
            </a>
        </div>
    )
}

export { SideButton }