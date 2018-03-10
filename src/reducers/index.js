import { combineReducers } from 'redux'
import { PageReducer, BoardReducer, CommunityReducer, ContentReducer } from './getList.red.js';

export default combineReducers({
    // TODO: Write Reducers
    PageReducer,
    BoardReducer,
    CommunityReducer,
    ContentReducer
});