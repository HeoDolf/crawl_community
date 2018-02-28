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
        this.state = {}
        this.state.board = props.board;
    }
    /**
     * Servicies
     */


    /**
     * Life Cycle
     */
    componentWillReceiveProps(nextProps){
    }
    componentWillUpdate(nextProps, nextState){
        if( JSON.stringify(this.props.page) !== JSON.stringify(nextProps.page)){
            return true;
        }
        if( JSON.stringify(this.props.board) !== JSON.stringify(nextProps.board)){
            return true;
        }
        return false;
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
                                current={ board } />
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