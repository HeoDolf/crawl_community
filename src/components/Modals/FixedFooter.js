import React from 'react'

const FixedFooter = ({ id, title, children, onAgree })=>{
    return (
        <div id={ id } className="modal modal-fixed-footer">
            <div className="modal-content">
                <h4>{ title }</h4>
                { children }
            </div>
                <div className="modal-footer">
                <a className="modal-action modal-close waves-effect waves-green btn-flat" onClick={onAgree}>Save</a>
                <a href="#!" className="modal-action modal-close waves-effect waves-red btn-flat ">Cancel</a>
            </div>
        </div>
    )
}

export default FixedFooter