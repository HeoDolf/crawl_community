// Libaries, Modules
import React from 'react'
import axios from 'axios'
// Components
import { ContentList } from './../../components'

const BoardItem = ({ community, board, contents })=>{
    console.log( community, board, contents );
    return (
        <div className={`board ${board.name}`}>
            <a>{ contents }</a>
        </div>
    )
}

export default BoardItem