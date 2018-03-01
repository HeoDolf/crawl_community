// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
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
            baseTime: "00:00:00",
            view: [0, 5]
        }
        // Local
        this.cancel = {
            token: axios.CancelToken,
            exec: null
        }
        this.interval = null;

        this.getContentList = this.getContentList.bind(this);
    }

    /**
     * Servicies
     */
    getContentList( community, board, baseTime ){
        this.setState(Object.assign({}, this.state, {
            load: false
        }));
        
        const crawl = axios({
            url: `/api/crawler/${community}/${board}?baseTime=${this.state.baseTime}`,
            method: 'get',
            cancelToken: new this.cancel.token((c)=>{ this.cancel.exec = c })
        }).then((response)=>{

            const newList = response.data.list;
            const oldList = this.state.content.list.new.concat( this.state.content.list.old );
            const baseTime = newList.length > 0 ? newList[0].date[1] : this.state.baseTime;

            console.log( `[${community}-${board}]`, newList, oldList );

            this.setState(Object.assign({}, this.state, {
                load: true,
                baseTime: baseTime,                
                content: {
                    pages: response.data.pages,
                    list: {
                        new: newList,
                        old: oldList
                    }
                }
            }));
        }).catch((error)=>{
            this.setState(Object.assign({}, this.state, {
                load: true
            }));
        });
    }
    /**
     * Life Cycle
     */
    componentDidMount(){
        const community = this.props.community;
        const board = this.props.board.name;
        const baseTime = this.state.baseTime;

        // Interval 말고 다른 방법을 찾아봐야될듯
        // Auto-run
        this.interval = setInterval(()=>{
            this.getContentList( community, board, baseTime );
        }, 5000);
    }
    componentWillReceiveProps(nextProps){
        // When was changed boards.
        if( this.props.board.name !== nextProps.board.name ){
            // Cancel
            if( this.interval ){ clearInterval( this.interval ) }
            this.cancel.exec();     // prev-axios-cancel

            // Re-Set
            this.setState(Object.assign({}, this.state, {
                content: {
                    pages: [],
                    list: {
                        new: [],
                        old: this.state.content.list.old
                    },
                }
            }));

            // Re-Run
            const community = nextProps.community;
            const board = nextProps.board.name;
            const baseTime = this.state.baseTime;
    
            this.interval = setInterval(()=>{
                this.getContentList( community, board, baseTime );
            }, 3000);
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        console.log( "[should]",nextState.content.list )
        return true;
    }

    componentWillUnmount(){
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
                    <a>{ this.props.board.name }</a>
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