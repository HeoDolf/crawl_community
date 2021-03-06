import React from 'react'
import image from './../../assets/image/plus-th.png'

const CommunitySelector = ({ list, handler })=>{
    return (
        <div className="selector community_selector input-field">
            <select id="community_selector" name="community" defaultValue=''>
                <option value='' disabled>Community</option>
                {
                    list.map((community, index)=>{
                        return (
                            <option key={index} value={ index } >
                                { community.name_kor }
                            </option>
                        )
                    })
                }
            </select>
            <label>커뮤니티</label>
        </div>
    )
}
const BoardSelector = ({ list })=>{
    return (
        <div className="selector board_selector input-field">
            <select id="board_selector" name="board" defaultValue=''>
                <option value='' disabled>Board</option>
                {
                    list.map((board, index)=>{
                        return (
                            <option key={index} value={ index } >
                                { board.name_kor }
                            </option>
                        )
                    })
                }
            </select>
            <label>게시판</label>
        </div>
    )
}
const AddBoard = ({ mode, community, selected, handler })=>{
    return (
        <div className="board-item add valign-wrapper">
            {
                mode === 'ready'
                ?
                <div className={`${ mode } valign-wrapper`}>
                    <a onClick={ handler.add }><img src={ image }/></a>
                </div>
                :
                <div className={`${ mode }`}>
                    <CommunitySelector list={community} handler={ handler.selector } />
                    {
                        selected >= 0
                        ? <BoardSelector list={ community[selected].board }/>
                        : null
                    }
                    <div className="controller row">
                        <a className="col s6" onClick={ handler.cancel }>cancel</a>
                        <a className="col s6" onClick={ handler.submit }>submit</a>
                    </div>
                </div>
            }  
        </div>
    )
}

// Modal
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

export { AddBoard, PageSetting }