// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
// Actions
import { getPageList } from './../../actions/getList.act.js'
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
        this.state.reload = true;

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

        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
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
                // console.log('[create-token]');
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
        // 이렇게 호출하면 안될 것 같은뎁...
        // session이 없는디
        const sessionCheckAndRun = axios({
            url: '/api/session/board',
            meothod: 'get'
        }).then((response)=>{
            this.getContent( this.props.board.community, this.props.board.name, null );
        }).catch((error)=>{
            console.log("[session-board-check-error]", error);
        });

    }
    componentWillReceiveProps(nextProps){
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
        if( this.state.reload !== nextState.reload || this.props.board.name !== nextProps.board.name ){
            // Stop Crawling
            if( this.cancel.exec ){ this.cancel.exec('cancel'); }
            if( this.timeout ) clearTimeout( this.timeout );
            this.getContent( nextProps.board.community, nextProps.board.name, null );
        }
        return true;
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

    componentWillUnmount(){
        // Stop Crawling
        if( this.cancel.exec ){ this.cancel.exec('cancel'); }
        if( this.timeout ) clearTimeout( this.timeout );
        console.log('[BoardItem-UnMount]');
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getPageList: ()=>dispatch( getPageList() ),
    }
}

export default connect(
    null,
    mapDispatchToProps
)( BoadrItem )
