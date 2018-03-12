// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

// Actions
import { getPageList } from './../actions/getList.act.js'
// Components
import { BoardItem, BoardItemAdd, PageSetting } from './../components'

const defaultProps = {
    
}
const defaultState = {
    add: {
        mode: 'ready',
        comIndex: -1,
        bodIndex: -1
    }
}
class Page extends React.Component {
    constructor(props, context){
        super(props, context);

        this.state = defaultState;

        this.handleCreatePage = this.handleCreatePage.bind(this);
        this.handleDeletePage = this.handleDeletePage.bind(this);

        this.handleAddBoard = this.handleAddBoard.bind(this);
        this.handleCreateBoardSubmit = this.handleCreateBoardSubmit.bind(this);
        this.handleCreateBoardCancel = this.handleCreateBoardCancel.bind(this);

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
                bodIndex: -1
            }
        }));
    }

    handleCommunitySelector( event ){
        const comIndex = event.target.value;
        if( this.state.add.comIndex !== comIndex ){
            // set board-selector
            this.setState(Object.assign({}, this.state, {
                add: {
                    mode: 'write',
                    comIndex: comIndex,
                    bodIndex: -1
                }
            }));
        }
    }
    handleBoardSelector( event ){
        const bodIndex = event.target.value;
        if( this.state.add.bodIndex !== bodIndex ){
            this.setState(Object.assign({}, this.state, {
                add: {
                    mode: 'write',
                    comIndex: this.state.add.comIndex,
                    bodIndex: bodIndex
                }
            }));
        }
    }
    // 이거는 App 에서 받아와야 하지 않을까?
    // 아니면 여기서 getPageList Action 실행시키면 되겠군
    handleCreateBoardSubmit( event ){
        event.preventDefault();
        const data = {
            page: this.props.page._id,
            board: this.props.community.list[this.state.add.comIndex].board[this.state.add.bodIndex]._id
        }
        const addBoard = axios({
            url: '/api/page/board',
            method: 'put',
            data: data
        }).then((response)=>{
            this.props.getPageList();
        }).catch((error)=>{
            console.log( error );
        });
    }
    handleCreateBoardCancel( event ){
        event.preventDefault();
        this.setState(Object.assign({}, this.state, {
            add: defaultState.add
        }));
    }


    handleCreatePage( event ){
        event.preventDefault();
        const form = document.querySelector('form#create_page');

        const pagIndex = form.querySelector('[name=index]').value
        const title = form.querySelector('[name=title]').value;

        if( pagIndex < 0 ){ return false; }
        if( title.length === 0 || title === '' ){ return false; }
        
        const savePage = axios({
            url: '/api/page',
            method: 'post',
            data: {
                index: pagIndex,
                title: title
            } 
        }).then((response)=>{
            this.props.getPageList();
        }).catch((error)=>{
            console.log('[failure create page...]');
        });
    }
    
    handleDeletePage( event ){
        event.preventDefault();
        if( confirm("정말로 삭제 하시겠습니까?") ){
            const data = {
                page: this.props.page._id,
            }
            const deletePage = axios({
                url: '/api/page',
                method: 'delete',
                data: data
            }).then((response)=>{
                this.props.getPageList();
            }).catch((error)=>{
                console.log( error );
            });
        }
    }

    /**
     * Life Cycle
     */
    componentDidMount(){
        console.log('[mounted Page]');
        if( this.props.page === 'empty' ){
            // Set Material_modal
            $('.modal').modal();
            $('#CreatePage').modal('open');
            console.log('[modal on!]')
        } else {
            if( this.state.add.mode === 'write' ){
                $('#community_selector, #board_selector').material_select();
    
                $('#community_selector').off('change', this.handleCommunitySelector);
                $('#community_selector').on('change', this.handleCommunitySelector);
    
                const board_selector = $('#board_selector');
                if( board_selector.length > 0 ){
                    board_selector[0].value = ''
                    board_selector.off('change', this.handleBoardSelector);
                    board_selector.on('change', this.handleBoardSelector);
                }
            }
        }
    }
    
    componentWillReceiveProps(nextProps){
        if( JSON.stringify(nextProps.page) !== JSON.stringify( this.props.page )){
            $('#community_selector, #board_selector').material_select();
            this.setState(Object.assign({}, this.state, {
                add: defaultState.add
            }));
        }
    }


    render(){
        if( this.props.page === 'empty' ){
            return (
                <PageSetting 
                    id="CreatePage" 
                    title="페이지 생성"
                    handler={{
                        onAgree: this.handleCreatePage
                    }}
                    options={{
                        pageIndex: this.props.page.length ? this.props.page.length : 0,
                    }}/>
            )
        }
        return (
            <div className="page-wrapper">
                <p className="valign-wrapper">
                    <a className="page-title">{this.props.page.title}</a>
                    <span className="page-setting">
                        <a href="#setting">
                            <i className="material-icons small">settings</i>
                        </a>
                        <a href="#delete" onClick={ this.handleDeletePage }>
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
                                page={ this.props.page } 
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
                        submit: this.handleCreateBoardSubmit,
                        cancel: this.handleCreateBoardCancel,
                        selector: this.handleCommunitySelector
                    }}/>
                </div>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, prevContext){
        if( this.props.page === 'empty' ){
            // Set Material_modal
            $('.modal').modal();
            $('#CreatePage').modal('open');
            console.log('[modal on!]')
        } else {
            if( this.state.add.mode === 'write' ){
                $('#community_selector, #board_selector').material_select();
    
                $('#community_selector').off('change', this.handleCommunitySelector);
                $('#community_selector').on('change', this.handleCommunitySelector);
    
                const board_selector = $('#board_selector');
                if( board_selector.length > 0 ){
                    board_selector[0].value = ''
                    board_selector.off('change', this.handleBoardSelector);
                    board_selector.on('change', this.handleBoardSelector);
                }
            }
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
