// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
// Components
import { BoardLayout } from './../components'

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
    componentWillReceiveProps(){
        if( nextProps.page && nextProps.board ){
            const community = nextProps.page._community.name;
            const board = nextProps.board.list[0].name;
            const baseTime = '15:00:00';
            const intervalTime = nextProps.board.list[0].intervalTime;
        }
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
        let board = [];
        if( this.props.page !== 'empty' ){
            if( this.props.board.status === 'SUCCESS' ){
                board = this.props.board.list.map((board, index)=>{
                    return (
                        <div key={index} className={`board ${board.name}`}>
                            <a>{ board.name }</a>
                        </div>
                    )
                });
            }
        }
        return (
            <div className="page-wrapper">
                <a>{this.props.page.title}</a>
                <div className="board">
                    { board }
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
    mapStateToProps,
)(Page)