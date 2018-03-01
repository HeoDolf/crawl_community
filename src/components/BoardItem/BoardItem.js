// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
// Components
import { ContentList } from './../../components'
// StyleSheet
import './BoardItem.css'

class BoadrItem extends React.Component {
    constructor(props, context){
        super(props, context);
        // 상태변환 변수
        this.state = {
            reload: false,
            load: false,
            // Board Content Info
            content: {
                pages: [],
                list: {
                    new: [],
                    old: []
                },
            },
            baseTime: "00:00:00",
            view: [0, 5]
        }
        // Local
        this.cancel = {
            token: axios.CancelToken,
            exec: null
        }
        this.cancel.source = this.cancel.token.source();

        this.getContentList = this.getContentList.bind(this);
    }

    /**
     * Servicies
     */
    getContentList( community, board, baseTime ){
        this.setState(Object.assign({}, this.state, {
            reload: false,
            load: false
        }));
        
        const crawl = axios({
            url: `/api/crawler/${community}/${board}?baseTime=${this.state.baseTime}`,
            method: 'get',
            cancelToken: this.cancel.source.token
        }).then((response)=>{
            if( response ){
                const newList = response.data.list.new;
                const oldList = response.data.list.old;
                baseTime = newList.length > 0 ? newList[0].date[1] : this.state.baseTime;
    
                this.setState(Object.assign({}, this.state, {
                    load: true,
                    baseTime: baseTime,                
                    content: {
                        pages: response.data.pages,
                        list: response.data.list
                    }
                }));
                return { type: 'update' }
            }
        }).catch((error)=>{
            if( axios.isCancel(error) && error.message.type === 'reload' ){
                console.log( 'reload' )
                this.cancel.source = this.cancel.token.source();    // 새로 안만들어주면 무한루프
                return error.message;
            } else if( axios.isCancel(error) && error.message.type === 'unmount' ){
                this.getContentList = null;
                return error.message;
            }
            return {type: 'update' }
        }).then(( final )=>{
            if( final.type === 'reload' ){
                this.getContentList( final.data.community, final.data.board, final.data.baseTime );
            } else if ( final.type === 'update' ) { 
                setTimeout(()=>{
                    this.getContentList( community, board, baseTime );
                }, this.props.board.intervalTime * 1000 );
            } else {
                return 'bye'
            }
        });
    }
    /**
     * Life Cycle
     */
    componentDidMount(){
        const community = this.props.community;
        const board = this.props.board.name;
        const baseTime = this.state.baseTime;

        this.getContentList( community, board, baseTime );
    }
    componentWillReceiveProps(nextProps){
        // When was changed boards.
        if( this.props.board.name !== nextProps.board.name ){
            // Re-Run
            const community = nextProps.community;
            const board = nextProps.board.name;
            const baseTime = "00:00:00";

            // Re-Set
            this.setState(Object.assign({}, this.state, {
                reload: true,
                baseTime: baseTime,
                content: {
                    pages: [],
                    list: {
                        new: [],
                        old: this.state.content.list.old
                    },
                }
            }));
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        // if( nextState.reload ){
        //     const reload = {
        //         type: 'reload',
        //         data: {
        //             community: nextProps.community,
        //             board: nextProps.board.name,
        //             baseTime: nextState.baseTime
        //         }
        //     }
        //     console.log('[change]', reload.data );
        // }
        return true;
    }

    componentWillUpdate(){
        if( this.state.reload ){
            const reload = {
                type: 'reload',
                data: {
                    community: this.props.community,
                    board: this.props.board.name,
                    baseTime: this.state.baseTime
                }
            }
            console.log('[change]', reload.data );
            this.cancel.source.cancel(reload)     // prev-axios-cancel
        }
    }

    componentWillUnmount(){
        this.cancel.source.cancel({type: 'unmount'})     // prev-axios-cancel
        console.log('[BoardItem-UnMount]');
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
            <div className={`board ${this.props.board.name}`}>
                <div className="board-name">
                    <a>{ this.props.board.name }</a>/
                    <a>{ this.state.content.list.new.length }</a>/
                    <a>{ this.state.content.list.old.length }</a>/
                    <a>{ this.state.baseTime }</a>
                    { this.state.load ? loaded : preloader }
                </div>
                <div className="board-list-wrapper">
                {
                    this.state.content.list.new
                    ? <ContentList
                            contents={ this.state.content.list }
                            view={ this.state.view } />
                    : null  
                }
                </div>
            </div>
        )
    }
}

export default BoadrItem