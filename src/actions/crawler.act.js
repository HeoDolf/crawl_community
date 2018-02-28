import {
    GET_CONTENTS
} from './ActionTypes'
import axios from 'axios'

export function getContentList( community, board, baseTime ){
    return (dispatch)=>{
        dispatch(setReady( GET_CONTENTS ));
        
        const params = {params:{baseTime:baseTime}}
        axios.get(`/api/crawler/${community}/${board}`, params)
            .then((response)=>{
                dispatch(setSuccess( GET_CONTENTS, response.data.contents, response.data.pages ));
            })
            .catch((error)=>{
                dispatch(setFailure( GET_CONTENTS, error.response.data.error ));
            });
    }
}

function setReady( types ){
    return { 
        type: types.READY
    }
}
function setSuccess( types, list, pages ){
    return {
        type: types.SUCCESS,
        list: list,
        pages: pages
    }
}
function setFailure( types, error ){
    return {
        type: types.FAILURE,
        error: error
    }
}