// Libaries, Modules
import React, { Component } from 'react'
import { connect } from 'react-redux'
// Actions
import { getPageList } from './../../actions/getList.act.js'
import container from './container.js';

const mapDispatchToProps = (dispatch)=>{
    return {
        getPageList: ()=>dispatch( getPageList() ),
    }
}

export default connect(
    null,
    mapDispatchToProps
)( container )
