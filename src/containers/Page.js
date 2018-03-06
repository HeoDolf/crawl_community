// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
// Actions
import { getPageList } from './../actions/getList.act.js'
// Components
import { BoardItem, BoardItemAdd } from './../components'

const defaultProps = {
    
}
const defaultState = {
    add: {
        mode: 'ready',
        comIndex: -1,
        selected: []
    }
}
class Page extends React.Component {
    constructor(props, context){
        super(props, context);

        this.state = defaultState;

        this.handleAddBoard = this.handleAddBoard.bind(this);
        this.handleSubmitBoard = this.handleSubmitBoard.bind(this);
        this.handleCommunitySelector = this.handleCommunitySelector.bind(this);
        this.handleBoardSelector = this.handleBoardSelector.bind(this);
    }
    /**
     * Servicies
     */
    handleAddBoard( event ){
        event.preventDefault();
        this.setState(Object.assign({}, this.state, {
            add: {
                mode: 'write',
                comIndex: -1,
                selected: []
            }
        }));
    }

    // 이거는 App 에서 받아와야 하지 않을까?
    // 아니면 여기서 getPageList Action 실행시키면 되겠군
    handleSubmitBoard( event ){
        event.preventDefault();
        
        this.props.getPageList();

        this.setState(Object.assign({}, this.state, {
            add: defaultState.add
        }));
    }
    handleCommunitySelector( event ){
        const comIndex = event.target.value;
        if( this.state.add.comIndex !== comIndex ){
            this.setState(Object.assign({}, this.state, {
                add: {
                    mode: 'write',
                    comIndex: comIndex,
                    selected: this.state.add.selected
                }
            }));
        }
    }
    handleBoardSelector( event ){
        const bodIndex = event.target.querySelectorAll(':checked');

        // console.log( this.props.community.list[this.state.add.comIndex].board[])
    }

    /**
     * Life Cycle
     */
    
    componentWillReceiveProps(nextProps){
        if( JSON.stringify(nextProps.page) !== JSON.stringify( this.props.page )){
            $('#community_selector, #board_selector').material_select('destroy');
            this.setState(Object.assign({}, this.state, {
                add: defaultState.add
            }));
        }
    }

    render(){
        return (
            <div className="wrapper">
                <p className="valign-wrapper">
                    <a className="page-title">{this.props.page.title}</a>
                    /
                    <a className="page-community">{this.props.page._community.name}</a>
                    <span className="page-setting">
                        <a href="#setting">
                            <i className="material-icons small">settings</i>
                        </a>
                        <a href="#delete" onClick={()=>this.props.handler.deletePage( this.props.page )}>
                            <i className="material-icons small">delete</i>
                        </a>
                    </span>
                </p>
                <div className="board-wrapper">
                { 
                    this.props.page._board.map((board, index)=>{
                        return (
                            <BoardItem 
                                key={ index } 
                                community={this.props.page._community.name} 
                                board={ board }/>
                        );
                    })
                }
                <BoardItemAdd 
                        mode={ this.state.add.mode }
                        community={ this.props.community.list }
                        selected={ this.state.add.comIndex }
                        handler={{
                            add: this.handleAddBoard,
                            submit: this.handleSubmitBoard,
                            selector: this.handleCommunitySelector
                        }}/>
                </div>
                {/* 여기에 Setting Modal */}
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, prevContext){
        if( this.state.add.mode === 'write' ){
            $('#community_selector, #board_selector').material_select();

            $('#community_selector').off('change', this.handleCommunitySelector);
            $('#community_selector').on('change', this.handleCommunitySelector);

            document.getElementById('board_selector').removeEventListener('blur', this.handleBoardSelector);
            document.getElementById('board_selector').addEventListener('blur', this.handleBoardSelector);
        }
    }
}

Page.defaultProps = defaultProps;

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
)( Page )
