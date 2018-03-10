import React from 'react'
import image from './../../assets/image/plus-th.png'

const SelectCommunity = ({ list, handler })=>{
    return (
        <div className="community_selector input-field">
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
const SelectBoard = ({ list })=>{
    return (
        <div className="board_selector input-field">
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
const BoardItemAdd = ({ mode, community, selected, handler })=>{
    console.log( selected );

    return (
        <div className="board-item add valign-wrapper">
            <div className={`wrapper ${ mode }`}>
            {
                mode === 'ready'
                ?
                    <a onClick={ handler.add }><img src={ image }/></a>
                :
                    <div>
                        <SelectCommunity list={community} handler={ handler.selector } />
                        {
                            selected >= 0
                            ? <SelectBoard list={ community[selected].board }/>
                            : null
                        }
                        <a onClick={ handler.submit }>submit</a> 
                    </div>
            }  
            </div>
        </div>
    )
}

export default BoardItemAdd