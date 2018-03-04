import React from 'react'
import axios from 'axios'

import FixedFooter from './FixedFooter.js'


function handleChange(event){
    console.log( event );
}

const SelectCommunity = ({ list })=>{
    return (
        <div className="input-field col s12">
            <select id="set_community" name="community">
                <option defaultValue='' disabled selected>Community</option>
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
        <div>
        {
            list.map((board, index)=>{
                const id = `set_board_${board.name}`;
                return (
                    <p key={index}>
                        <input type="checkbox" name="board" value={ index } id={ id } />
                        <label htmlFor={ id }>{board.name_kor}</label>
                    </p>
                )
            })
        }
        </div>
    )
}
const CreatePage = ({ id, title, handler, index, options })=>{
    const selected = options.community;

    return (
        <FixedFooter id={id} title={ title } onAgree={ handler.onAgree } onDegree={ handler.onDegree} >
            <form id="create_page" className="row">
                <div className="row">
                    <div className="input-field col s2">
                        <input id="page_title" name="index" type="text" value={ options.pageIndex } readOnly/>
                        <label htmlFor="page_title">Title</label>
                    </div>
                    <div className="input-field col s10">
                        <input id="page_title" name="title" type="text"/>
                        <label htmlFor="page_title">Title</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col s6">
                        <SelectCommunity list={options.list} />
                    </div>
                    <div className="col s6">
                        {
                            selected > -1
                            ? <SelectBoard list={ options.list[ selected ].board }/>
                            : null
                        }
                    </div>
                </div>
            </form>
        </FixedFooter>
    )
}

export default CreatePage