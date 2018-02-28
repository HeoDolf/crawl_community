// Libaries, Modules
import React from 'react'
import axios from 'axios'
// Components
import { ContentList } from './../../components'

function getContents( community, board, baseTime ){
    return axios.get(`/api/crawler/${community}/${board}`, {params:{baseTime:baseTime}});
}

// Conetents => ContentList => BoardItem => BoardLayout;
const BoardItem = ({ community, board })=>{
    const baseTime = "15:00:00"
    return (
        <div className={`board ${board}`}>
        {
            getContents( community, board.name, baseTime ).then((response)=>{
                return (<ContentList contents={ response.data.contents }/>)
            }).catch((error)=>{
                return (<a>Empty Contents</a>);
            })
        }
        </div>
    )
}

const BaordLayout = ({ community, boards })=>{
    return (
        boards.map((board, index)=>{
            return (
                <div key={index} className={`board ${board.name}`}>
                    <a>{ board.name }</a>
                    {
                        <BoardItem 
                            key={index}
                            community={community} 
                            board={board}
                            />
                    }
                </div>
            )
        })
    )
}

export default BaordLayout