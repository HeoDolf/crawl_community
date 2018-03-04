// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
// Components
import { BoardItem } from './../components'
// actions
import { getBoardList } from './../actions/getList.act.js'

const defaultProps = {
    board: []
}
class Page extends React.Component {
    constructor(props, context){
        super(props, context);
        console.log( props.page );
    }
    /**
     * Servicies
     */
    // 크롤러를 여기서 실행하면 어떻게 될까..?

    /**
     * Life Cycle
     */
    componentDidMount(){
        this.props.getBoardList( this.props.page._community.name );
    }
    componentWillReceiveProps(nextProps){
        if( JSON.stringify(this.props.page) !== JSON.stringify(nextProps.page)){
            // Change to Page
            this.props.getBoardList( nextProps.page._community.name );
        }
    }
    componentWillUnmount(){
        console.log("[page is unmount]");
    }
    render(){
        return (
            <div className="page-wrapper">
                <a>{this.props.page.title} {this.props.page._community.name}</a>
                <div className="board-wrapper">
                { 
                    this.props.board.list.map((board, index)=>{
                        return (
                            <BoardItem 
                                key={ index } 
                                community={this.props.page._community.name} 
                                board={ board }/>
                        );
                    })
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
const mapDispatchToProps = (dispatch)=>{
    return {
        getBoardList: ( community )=>dispatch( getBoardList( community ) )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Page)
