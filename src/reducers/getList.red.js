import {
    GET_PAGES, GET_COMMUNITY, GET_BOARD, GET_CONTENTS
} from './../actions/ActionTypes'

const initState = {
    status: "INIT",
    list: []
}
export function PageReducer( state = initState, action ){
    switch( action.type ){
        case GET_PAGES.READY:
            return Object.assign({}, state, {
                status: "READY"
            });
        case GET_PAGES.FAILURE:
            return Object.assign({}, state, {
                status: "FAILURE",
            });
        case GET_PAGES.SUCCESS:
            return Object.assign({}, state, {
                status: "SUCCESS",
                list: action.list
            });
        default:
            return state;
    }
}
export function BoardReducer( state = initState, action ){
    switch( action.type ){
        case GET_BOARD.READY:
            return Object.assign({}, state, {
                status: "READY"
            });
        case GET_BOARD.FAILURE:
            return Object.assign({}, state, {
                status: "FAILURE",
            });
        case GET_BOARD.SUCCESS:
            return Object.assign({}, state, {
                status: "SUCCESS",
                list: action.list
            });
        default:
            return state;
    }
}