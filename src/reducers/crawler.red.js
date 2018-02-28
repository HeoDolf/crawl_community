import { GET_CONTENTS } from './../actions/ActionTypes'

const initState = {
    status: "INIT",
    list: [],
    pages: []
}
export default function CrawlerReducer( state = initState, action ){
    console.log( "[reducer]", state );
    switch( action.type ){
        case GET_CONTENTS.READY:
            return Object.assign({}, state, {
                status: "READY"
            });
        case GET_CONTENTS.FAILURE:
            return Object.assign({}, state, {
                status: "FAILURE",
            });
        case GET_CONTENTS.SUCCESS:
            return Object.assign({}, state, {
                status: "SUCCESS",
                list: action.list,
                pages: action.pages
            });
        default:
            return state;
    }
}