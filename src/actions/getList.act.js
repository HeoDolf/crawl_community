import axios from 'axios'
import {
    GET_PAGES, GET_COMMUNITY, GET_BOARD, GET_CONTENTS
} from './ActionTypes.js'

// Ps. Should logged state. 
export function getPageList( /* user_id? */ ){
    return ( dispatch )=>{
        dispatch(setReady( GET_PAGES ));
        
        const request = axios.get('/api/page', {params:{}})
        request.then((response)=>{
            dispatch(setSuccess( GET_PAGES, response.data.list ));
        });
        request.catch((error)=>{
            dispatch(setFailure( GET_PAGES, error.response.data ));
        });
    }
}

export function getBoardList( community ){
    return ( dispatch )=>{
        dispatch(setReady( GET_BOARD ));
        
        const url = '/api/board/'+community;
        const request = axios.get('/api/board/'+community, {params:{}})
        request.then((response)=>{
            dispatch(setSuccess( GET_BOARD, response.data.list ));
        });
        request.catch((error)=>{
            dispatch(setFailure( GET_BOARD, error.response.data ));
        });
    }
}

function setReady( types ){
    return { 
        type: types.READY
    }
}
function setSuccess( types, list ){
    return {
        type: types.SUCCESS,
        list: list
    }
}
function setFailure( types, error ){
    return {
        type: types.FAILURE,
        error: error
    }
}