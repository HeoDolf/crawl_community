// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
// socket
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3001');
socket.on('receive msg', (msg)=>{
    console.log('[receive]', msg)
});
socket.emit('send msg', "server - hi");

// Actions
import { getPageList, getContentList } from './../../actions/getList.act.js'
// Components
import { ContentList } from './../../components'
// StyleSheet
import './BoardItem.css'

class BoadrItem extends React.Component {
    constructor(props, context){
        super(props, context);

        this.state = {
            loaded: true,
            content: []
        }

        // Display Content Count
        this.display = [0, 5];

        // handler 
        this.getContent = this.getContent.bind(this);
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
    }

    /**
     * Servicies
     */
    getContent( community, board ){
        // 여기에 결국에는 그 뭐시냐 그게 필요 한건가...
        this.setState(Object.assign({}, this.state,{
            loaded: false
        }));

        let url = ['/api', 'content'];
        if( typeof community === 'string' ){
            url.push( community );
        }
        if( typeof board === 'string' ){
            url.push( board );
        }
        const req = axios({
            url: url.join('/'),
            method: 'get'
        }).then((response)=>{
            this.setState(Object.assign({}, this.state, {
                loaded: true,
                content: response.data.list
            }))
        }).catch((error)=>{
            console.log( error );
            this.setState(Object.assign({}, this.state, {
                loaded: true
            }));
        });
    }

    // Handler
    handleDeleteBoard( event ){
        event.preventDefault();
        if( confirm("정말로 삭제하시겠습니까?")){
            const data = {
                page: this.props.page._id,
                board: this.props.board._id
            }
            const deletePageBoard = axios({
                url: '/api/page/board',
                method: 'delete',
                data: data
            }).then((response)=>{
                this.props.getPageList();
            }).catch((error)=>{
                console.error('[board-delete-error]', error);
            });
        }
    }
    
    /**
     * Life Cycle
     */
    componentDidMount(){
        socket.emit('connected', "Heo");

        // TODO: ...
        const community = this.props.board.community.name;
        const board = this.props.board.name;

        // this.props.getContentList( community, board 
        this.getContent( community, board );
    }
    componentWillReceiveProps(nextProps){
        console.log( nextProps.content );
        if( this.props.board.name !== nextProps.board.name ){
            // TODO: Re-Call getContentList
            const community = nextProps.board.community.name;
            const board = nextProps.board.name;
            // this.props.getContentList( community, board );
            this.getContent( community, board );
        }
    }

    render(){
        const preloader = (
            <div className='preloader-wrapper small active'>
                <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
                </div>
            </div>
        )
        const loaded = ( <a><i className="material-icons small">check</i></a> )
        return (
            <div className={`board-item ${this.props.board.name}`}>
                <div className="board-title row">
                    <div className="col s6">
                        <a>{ this.props.board.name_kor }</a>
                        <a href='#delete_board' onClick={ this.handleDeleteBoard }>
                            <i className="material-icons small">delete</i>
                        </a>
                    </div>
                    <div className="col s6 right-align">
                        { this.state.loaded ? loaded : preloader }
                    </div>
                </div>
                <div className="board-list-wrapper">
                {
                    this.state.content.length > 0 
                    ? <ContentList
                            contents={ this.state.content }
                            display={ this.display } />
                    : null  
                }
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        // TODO: ...
    }
}

const mapStateToProps = (state)=>{
    return {
        // 이걸 액션으로 가져오니까, 다같이 공유를 해버리네...
        content: state.ContentReducer
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getPageList: ()=>dispatch( getPageList() ),
        getContentList: ( community, board )=>dispatch( getContentList( community, board ) )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( BoadrItem )
