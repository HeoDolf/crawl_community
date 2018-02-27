import React from 'react'
import { connect } from 'react-redux'

import { List, EmptyPage } from './../components'

const defaultProps = {
    board: []
}

class Pages extends React.Component {
    constructor(props, context){
        super(props, context);
        this.state = {}
        this.state.board = props.board;
    }
    componentWillUpdate(nextProps, nextState){
        if( JSON.stringify(this.props.board) !== JSON.stringify(nextProps.board)){
            return true;
        }
        return false;
    }

    render(){
        console.log( "[render]", this.props.board );
        let boardWrapper = [];
        if( this.props.board.status !== 'READY' ){
            boardWrapper= this.props.board.list.map((board, index)=>{
                return (
                    <div key={index} className={`board ${board.name}`}>
                        <a>{ board.name }</a>
                    </div>
                )
            });
        }
        return (
            <section className="page">
                <a>{this.props.page.title}</a>
                <div className="board">
                    { boardWrapper }
                </div>
            </section>
        )
    }
}
Pages.defaultProps = defaultProps;

const mapStateToProps = (state)=>{
    return {
        board: state.BoardReducer
    }
}
export default connect(
    mapStateToProps,
)(Pages)