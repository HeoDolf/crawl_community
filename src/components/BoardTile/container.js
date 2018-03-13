// Libaries, Modules
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
// socket
import io from 'socket.io-client';
// Presenter
import { ContentList } from './presenter'
// StyleSheet
import './style.css'

const initState = {
    loaded: true,
    content: {
        new: [],
        old: []
    }
}

class Container extends Component {

    constructor(props, context){
        super(props, context);
        // Set State
        this.state = initState;
        
        // Socket
        this.socket = null;
        // Display Content Count
        this.display = [0, 5];
        // AXIOS CANCEL TOKEN
        this.token = null;

        // Handler 
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        // Service
        this._getContent = this._getContent.bind(this);
        this._updateLoadState = this._updateLoadState.bind(this);
        this._updateNewContent = this._updateNewContent.bind(this);
        this._updateNextContent = this._updateNextContent.bind(this);

        this._setSocket = this._setSocket.bind(this);
        this._clearSocket = this._clearSocket.bind(this);
        this._changeSocket = this._changeSocket.bind(this);
    }

    /**
     * Handle Socket
     */
    _setSocket( roomName ){
        const socket = io('http://localhost:3001');
        // Hande Send
        socket.emit('join the room', roomName);
        // Hnalde Redceive
        socket.on('connected', ( )=>{
            // console.log( "[connected]", socket );
        });
        socket.on('update content', ( data )=>{
            console.log('[Hey~ new content!]', data );
            this._getContent( data.community, data.board );
        });
        socket.on('changed room', ()=>{
            // console.log("[changed room]")
        });
        socket.on('error', ( error )=>{
            console.error("[socket]", error)
        });
        socket.on('connect_error', ( error )=>{
            console.error('[socket-connect]', error);
        });
        return socket;
    }
    _changeSocket( newRoomName ){
        if( this.socket ){
            this.socket.emit('change the room', newRoomName );
        }
    }
    _clearSocket(){
        const socket = this.socket;
        if( socket ){
            socket.emit('leave the room');
            socket.disconnect('hey');
            socket.close();
        }
    }

    /**
     * Servicies
     */
    _getContent( community, board, lastContent ){
        this._updateLoadState( false );

        const isGetNext = arguments.length === 3;
        const URL = `/api/content/${ Array.from(arguments).join('/') }`
        const config = {
            url: URL,
            method: 'get',
            cancelToken: new axios.CancelToken( cancel =>{
                this.token = cancel
            })
        }
        const req = axios(config)
        .catch( error => Promise.resolve(error) )
        .then( response => {
            if( response && response.status === 200 ){
                isGetNext
                ? this._updateNextContent( response.data.list )
                : this._updateNewContent( response.data.list )
            }
        }).catch( error => {
            console.error('[_getContent]',error );
            !axios.isCancel(error) && this._updateLoadState( true );
        });
    }
    _updateLoadState( flag ){
        this.setState(Object.assign({}, this.state,{
            loaded: flag
        }));
    }
    _updateNewContent( news ){
        this.setState(Object.assign({}, this.state, {
            loaded: true,
            content: {
                new: news,
                old: news.concat(this.state.content.old)
            }
        }));
    }
    _updateNextContent( nexts ){
        this.setState(Object.assign({}, this.state, {
            loaded: true,
            content: {
                new: this.state.content.new,
                old: this.state.content.old.concat( nexts ) 
            }
        }));
    }

    _animateFadeInOut( selector, toggle ){
        const $el = $(selector);
        if( toggle ){
            $el.toggleClass('fadeOut', false);
            $el.toggleClass('fadeIn', true);
        } else {
            $el.toggleClass('fadeIn', false);
            $el.toggleClass('fadeOut', true);
        }
    }

    handleScroll( event ){
        event.preventDefault();
        const el = event.target;

        const wrapperHeight = el.offsetHeight;
        const contentHeight = el.children[0].offsetHeight;
        const persent = parseInt( el.scrollTop / (contentHeight - wrapperHeight) * 100);

        // console.log( el, persent + '%' );

        // 여기서 안보이는 자료들 고스팅 해주면 될듯
        if( this.state.loaded === true && persent >= 95 ){
            const community = this.props.board.community.name;
            const board = this.props.board.name;
            const lastId = this.state.content.new[this.state.content.new.length-1].content.no;

            this._getContent( community, board, lastId );
        }
    }
    // Handler
    handleDeleteBoard( event ){
        event.preventDefault();
        if( confirm("정말로 삭제하시겠습니까?") ){
            this._animateFadeInOut(`.board-item.${this.props.board.name}`, false);
            const config = {
                url: '/api/page/board',
                method: 'delete',
                data: {
                    page: this.props.page._id,
                    board: this.props.board._id
                }
            }
            const deletePageBoard = axios(config)
            .then((response)=>{
                this.props.getPageList();
            }).catch((error)=>{
                console.error('[board-delete-error]', error);
            });
        }
    }
    componentWillMount(){
        const community = this.props.board.community.name;
        const board = this.props.board.name;
        const roomName = community + '_' + board;

        this.socket = this._setSocket( roomName );
    }
    
    /**
     * Life Cycle
     */
    componentDidMount(){
        // TODO: ...
        const community = this.props.board.community.name;
        const board = this.props.board.name;

        this._animateFadeInOut(`.board-item.${this.props.board.name}`, true);

        this._getContent( community, board );
    }
    componentWillReceiveProps(nextProps){
        if( this.props.page._id !== nextProps.page._id ){
            // TODO: Re-Call _getContent
            const community = nextProps.board.community.name;
            const board = nextProps.board.name;
            const newRoomName = community + "_" + board;
            
            // Init Board Item
            this.setState( initState );
    
            // Change Socket Room
            this._changeSocket( newRoomName );
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        if( this.props.page._id !== nextProps.page._id ){
            const community = nextProps.board.community.name;
            const board = nextProps.board.name;

            // Re-call
            this._getContent( community, board );
        }

        return true;
    }

    componentWillUnmount(){
        console.log('[board-item-unmount]');
        // Do Ajax Cancel
        this.token !== null &&  this.token('called disconnect');

        // Do Socket
        const roomName = this.props.board.community.name + "_" + this.props.board.name;
        this._clearSocket( roomName );
    }

    render(){
        const loaded = ( <a><i className="material-icons small">check</i></a> );
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
        return (
            <div className={`board-item ${this.props.board.name} animated p3s`}>
                <div className="board-state row">
                    <div className="board-title col s11">
                        { this.state.loaded ? loaded : preloader }
                        &nbsp;&nbsp;
                        <a>{ this.props.board.name_kor }</a>
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
}

Container.propTypes = {
    getPageList: PropTypes.func.isRequired
}

export default Container