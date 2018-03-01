// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
// Components
import { BoardItem } from './../components'
// actions
import { getContentList } from './../actions/crawler.act.js'

const defaultProps = {
    board: []
}
class Page extends React.Component {
    constructor(props, context){
        super(props, context);
    }
    /**
     * Servicies
     */
    // BoardList 여기서 호출하자 


     /**
     * Life Cycle
     */
    componentWillReceiveProps(nextProps){
    }
    componentWillUnmount(){
        console.log("[page is unmount]");
    }
    render(){
        return (
            <div className="page-wrapper">
                <a>{this.props.page.title} {this.props.page._community.name}</a>
                <div>
                {
                    this.props.board.list
                    ? this.props.board.list.map((board, index)=>{
                        return (
                            <BoardItem 
                                key={ index } 
                                community={this.props.page._community.name} 
                                board={ board }>
                            </BoardItem>
                        )
                    })
                    : null
                }
                </div>
            </div>
        )
    }
}
Page.defaultProps = defaultProps;

const mapStateToProps = (state)=>{
    return {
        board: state.BoardReducer
    }
}
export default connect(
    mapStateToProps
)(Page)