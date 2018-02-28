import { combineReducers } from 'redux'
import { PageReducer, BoardReducer } from './getList.red.js';
import CrawlerReducer from './crawler.red.js';

export default combineReducers({
    // TODO: Write Reducers
    PageReducer,
    BoardReducer,
    CrawlerReducer
});