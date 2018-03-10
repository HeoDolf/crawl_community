import {
    GET_PAGES, GET_COMMUNITY, GET_BOARD, GET_CONTENT
} from './../actions/ActionTypes'

const initState = {
    status: "INIT",
    list: [],
    length: 0,
    maxLength: 5
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
            let fillEmpty = action.list;
            if( fillEmpty.length < initState.maxLength ){
                fillEmpty.push('empty');
            }
            return Object.assign({}, state, {
                status: "SUCCESS",
                list: fillEmpty,
                length: action.list.length
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
export function CommunityReducer( state = initState, action ){
    switch( action.type ){
        case GET_COMMUNITY.READY:
            return Object.assign({}, state, {
                status: "READY"
            });
        case GET_COMMUNITY.FAILURE:
            return Object.assign({}, state, {
                status: "FAILURE",
            });
        case GET_COMMUNITY.SUCCESS:
            return Object.assign({}, state, {
                status: "SUCCESS",
                list: action.list
            });
        default:
            return state;
    }
}
export function ContentReducer( state = initState, action ){
    switch( action.type ){
        case GET_CONTENT.READY:
            return Object.assign({}, state, {
                status: "READY"
            });
        case GET_CONTENT.FAILURE:
            return Object.assign({}, state, {
                status: "FAILURE",
            });
        case GET_CONTENT.SUCCESS:
            return Object.assign({}, state, {
                status: "SUCCESS",
                list: action.list,
                lengtH: action.list.length
            });
        default:
            return state;
    }
}