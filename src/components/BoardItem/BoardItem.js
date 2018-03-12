// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
// socket
import io from 'socket.io-client';

// Actions
import { getPageList, getContentList } from './../../actions/getList.act.js'
// Components
import { ContentList } from './../../components'
// StyleSheet
import './BoardItem.css'

class BoadrItem extends React.Component {
    constructor(props, context){
        super(props, context);

        this.socket = this.setSocket( props.board.community.name, props.board.name );

        this.state = {
            loaded: true,
            content: {
                new: [],
                old: []
            }
        }

        // Display Content Count
        this.display = [0, 5];

        // handler 
        this.getContent = this.getContent.bind(this);
        this.getNextContent = this.getNextContent.bind(this);

        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }
    /**
     * Socket
     */
    setSocket( community, board ){
        const socket = io(`http://localhost:3001/${community}/${board}`);
        socket.on('no update', ()=>{
            console.log('[Update not yet...]')
        });
        socket.on('update content', ( data )=>{
            console.log('[Hey~ new content!]', data );
            this.getContent( data.community, data.board );
        });
        socket.on('error', (error)=>{
            console.error("[socket]",error)
        });
        socket.on('connect_error', (error)=>{
            // handle server error here
            console.log('Error connecting to server', error);
        });
        return socket;
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
                content: {
                    new: response.data.list,
                    old: this.state.content.old
                }
            }))
        }).catch((error)=>{
            console.log( error );
            this.setState(Object.assign({}, this.state, {
                loaded: true
            }));
        });
    }
    getNextContent( community, board, lastId ){
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
        if( typeof lastId === 'string' || typeof lastId === 'number' ){
            url.push( lastId )
        }
        const req = axios({
            url: url.join('/'),
            method: 'get'
        }).then((response)=>{
            console.log( response.data );
            this.setState(Object.assign({}, this.state, {
                loaded: true,
                content: {
                    new: this.state.content.new,
                    old: this.state.content.old.concat( response.data.list )
                }
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
        // TODO: ...
        const community = this.props.board.community.name;
        const board = this.props.board.name;

        // this.props.getContentList( community, board 
        this.getContent( community, board );
    }
    componentWillReceiveProps(nextProps){
        if( this.props.board._id !== nextProps.board._id ){
            // TODO: Re-Call getContent
            const community = nextProps.board.community.name;
            const board = nextProps.board.name;

            this.socket = this.setSocket( community, board );
            this.getContent( community, board );
        }
    }
   
    handleScroll( event ){
        event.preventDefault();
        const el = event.target;

        const wrapperHeight = el.offsetHeight;
        const contentHeight = el.children[0].offsetHeight;
        const persent = parseInt( el.scrollTop / (contentHeight - wrapperHeight) * 100);

        console.log( el, persent + '%' );

        // 여기서 안보이는 자료들 고스팅 해주면 될듯

        if( this.state.loaded === true && persent >= 95 ){
            const community = this.props.board.community.name;
            const board = this.props.board.name;
            const lastId = this.state.content.new[this.state.content.new.length-1].content.no;

            console.log(community, board, lastId );

            this.getNextContent( community, board, lastId );
        }

        // getNextPage();
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
                <div className="board-state row">
                    <div className="board-title col s11">
                        <a>{ this.props.board.name_kor }</a>
                        &nbsp;&nbsp;
                        { this.state.loaded ? loaded : preloader }
                    </div>
                    <div className="board-control col s1">
                        <a href='#delete_board' onClick={ this.handleDeleteBoard }>
                            <i className="material-icons small">close</i>
                        </a>
                    </div>
                </div>
                <div className="board-pagination row">
                    pagination
                </div>
                <div className="board-list-wrapper" onScroll={ this.handleScroll }>
                {
                    this.state.content 
                    ? <ContentList
                        contents={ this.state.content }
                        display={ this.display } />
                    : null  
                }
                </div>
            </div>
        )
    }   
    componentWillUpdate(){
    }
    componentDidUpdate(){
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
