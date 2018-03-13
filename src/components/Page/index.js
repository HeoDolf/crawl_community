// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'

// Actions
import { getPageList } from './../../actions/getList.act.js'

import Container from './container.js'

const mapStateToProps = (state)=>{
    return {
        community: state.CommunityReducer
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        getPageList: ()=>dispatch( getPageList() ),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( Container )
