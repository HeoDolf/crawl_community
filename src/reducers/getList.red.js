import {
    GET_PAGES, GET_COMMUNITY, GET_BOARD, GET_CONTENTS
} from './../actions/ActionTypes'

const initState = {
    status: "INIT",
    list: [],
    maxLength: 5
}
export function PageReducer( state = initState, action ){
    console.log( "[reducer]", state );
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
            let fillEmpty = new Array( initState.maxLength ).fill('empty');
            for(let index in action.list ){
                fillEmpty[index] = action.list[index];
            }
            return Object.assign({}, state, {
                status: "SUCCESS",
                list: fillEmpty
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