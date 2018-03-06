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
            load: false,
            // Board Content Info
            content: {
                pages: [],
                list: {
                    new: [],
                    old: []
                },
            },
            baseTime: "12:00:00",
            view: [0, 5]
        }

        // Display Content Count
        this.display = [0, 5];

        // Local
        this.cancel = {
            token: axios.CancelToken,
            exec: null
        }
        this.timeout = null;

        // Crawler
        this.getContent = this.getContent.bind(this);
    }

    /**
     * Servicies
     */
    getContent( community, board, baseTime ){
        if( typeof baseTime === 'undefined' ){
            baseTime = null;
        }
        this.setState(Object.assign({}, this.state,{ 
            load: false
        }));
        this.crawler = axios({
            url: `/api/crawler/${community}/${board}?baseTime=`+baseTime,
            method: 'get',
            // cancelToken: this.cancel.source.token
            cancelToken: new this.cancel.token((cancel)=>{
                // 이렇게 만들어야 Indivisual?한 cancel이 만들어지는 듯
                console.log('[create-token]');
                this.cancel.exec = cancel
            })
        }).then((response)=>{
            // Save Response Data
            console.log('['+board+'-response]', response.data.list.new.length );

            this.setState(Object.assign({}, this.state,{
                load: true,
                baseTime: response.data.baseTime,
                content: {
                    pages: response.data.pages,
                    list: response.data.list
                }
            }));

            return { community: community, board: board, baseTime: baseTime }
        }).then(( next )=>{
            // Next Crawl
            console.log('[next-start]', next.community, next.board, next.baseTime );
            this.timeout = setTimeout(()=>{
                console.log( "[next-run]\n");
                this.getContent( next.community, next.board, next.baseTime )
            }, this.props.board.intervalTime * 2000 );
        }).catch(( error )=>{
            console.log('[final-error]', error );
        });
    }
    
    /**
     * Life Cycle
     */
    componentDidMount(){
        const community = this.props.community;
        const board = this.props.board.name;
        const baseTime = this.state.baseTime;

        this.getContent( community, board );
    }
    componentWillReceiveProps(nextProps){
        // When was changed boards.
        if( this.props.board.name !== nextProps.board.name ){
            // Re-Set
            this.setState(Object.assign({}, this.state, {
                load: true,
                baseTime: "12:00:00",
                content: {
                    pages: [],
                    list: {
                        new: [],
                        old: []
                    },
                }
            }));
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        if( this.props.board.name !== nextProps.board.name ){
            this.cancel.exec('cancel');
            if( this.timeout ) clearTimeout( this.timeout );
            this.getContent( nextProps.community, nextProps.board.name, null );
        }
        return true;
    }

    componentWillUpdate(){
    }

    componentWillUnmount(){
        this.cancel.exec('cancel');
        if( this.timeout ) clearTimeout( this.timeout );
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
            <div className={`board-item ${this.props.board.name}`}>
                <div className="board-title row">
                    <div className="col s6">
                        <a>{ this.props.board.name_kor }</a>
                    </div>
                    <div className="col s6 right-align">
                        <a>{ this.state.baseTime }</a>
                        { this.state.load ? loaded : preloader }
                    </div>
                </div>
                <div className="board-list-wrapper">
                {
                    this.state.content.list.new
                    ? <ContentList
                            contents={ this.state.content.list }
                            display={ this.display } />
                    : null  
                }
                </div>
            </div>
        )
    }
}

export default BoadrItem