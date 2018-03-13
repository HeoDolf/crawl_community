// Libaries, Modules
import React, { Component } from 'react'
import { connect } from 'react-redux'
// Actions
import { getPageList, getCommunityList } from './../../actions/getList.act.js'

import Container from './container'

const mapStateToProps = (state)=>{
    return {
        page: state.PageReducer,
        community: state.CommunityReducer
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        getPageList: ()=>dispatch( getPageList() ),
        getCommunityList: ()=>dispatch( getCommunityList( true ) ),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)( Container )