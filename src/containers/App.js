// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
// Actions
import { getPageList, getBoardList, getCommunityList } from './../actions/getList.act.js'
// Components
import { Header, EmptyPage, SideButton, CreatePage } from './../components'
import Page from './Page.js'
import Home from './Home.js'
import { relative } from 'path';

const defaultProps = {
    description: "Main App",
    initPage: {
        index: -1,
        page: 'home'
    }
}

class App extends React.Component {
    constructor(props, context){
        super(props, context);

        this.state = {}
        this.state.current = props.initPage;

        this.state.create = {
            community: -1,
            board: [],
            intervalTime: 1
        }


        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleSavePage = this.handleSavePage.bind(this);
        this.handleDeletePage = this.handleDeletePage.bind(this);
        this.handleUpdatePage = this.handleUpdatePage.bind(this);
    }
    /**
     * Servicies
     * 이거 나중에 다 Actions으로 만들어 보자
     */
    handlePageChange( pageIndex ){
        // 가져오는게 끝났을 때 없데이트 하면 좋을 듯 한데
        this.setState( Object.assign({}, this.state, {
            current: {
                index: pageIndex,
                page: pageIndex > -1 ? this.props.page.list[pageIndex] : 'home'
            }
        }));
    }
    handleOptionChange( event ){
        this.setState(Object.assign({}, this.state, {
            create: {
                community: event.target.value
            }
        }));
    }
    handleSavePage( event ){
        event.preventDefault();
        const form = document.querySelector('form#create_page');

        const title = form.querySelector('[name=title]').value;
        const pagIndex = form.querySelector('[name=index]').value
        const comIndex = form.querySelector('[name=community]').value;
        const board = Array.from(form.querySelectorAll('[name=board]:checked')).map((board)=>{
            return this.props.community.list[comIndex].board[board.value]._id;
        });

        if( pagIndex < 0 ){ return false; }
        if( title.length === 0 || title === '' ){ return false; }
        if( board.length === 0 ){ return false; }
        
        const savePage = axios({
            url: '/api/page',
            method: 'post',
            data: {
                title: title,
                index: pagIndex,
                community: this.props.community.list[comIndex].name,
                board: board
            } 
        }).then((response)=>{
            console.log('[created page!!!]');
            this.props.getPageList();
        }).catch((error)=>{
            console.log('[failure create page...]');
        });
    }
    handleDeletePage( page ){
        if( confirm("정말로 삭제 하시겠습니까?") ){
            const deletePage = axios({
                url: '/api/page',
                method: 'delete',
                data: {
                    title: page.title,
                    index: page.index
                }
            }).then((response)=>{
                this.props.getPageList();
            }).catch((error)=>{
                console.log( error );
            });
        }
    }
    // Create Board
    handleUpdatePage( page ){
        console.log('[update]', page );
    }

    /**
     * Life Cycle
     */
    componentDidMount(){
        // For User Pagination
        this.props.getPageList();
        // For Page Setting
        this.props.getCommunityList();
    }

    componentWillReceiveProps(nextProps){
        if( JSON.stringify(nextProps.page) !== JSON.stringify(this.props.page) ){
            this.setState( Object.assign({}, this.state, {
                current: {
                    index: this.state.current.index,
                    page: this.state.current.index > -1 ? nextProps.page.list[this.state.current.index] : 'home'
                }
            }));
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        if( JSON.stringify(nextState.create) !== JSON.stringify(this.state.create)){
            return true;
        }
        if( nextProps.page.status === 'READY' || nextProps.community.status === 'READY' ){
            return false;
        }
        return true;
    }
    componentWillUpdate(){
        
    }

    render(){
        let PageWrapper;
        if( this.state.current.page === 'empty' ){
            PageWrapper = <EmptyPage
                            handler={{
                                onAgree: this.handleSavePage
                            }}
                            options={{
                                pageIndex: this.props.page.length,
                                community: this.state.create.community,
                                list: this.props.community.list,
                            }}/>
        } else if ( this.state.current.page === 'home' ){
            PageWrapper = <Home />
        } else {
            /**
             * Page Setting을 여기에서 추가해줘야할듯
             */
            PageWrapper = <Page 
                            page={ this.state.current.page }
                            handler={{
                                deletePage: this.handleDeletePage,
                                updatePage: this.handleUpdatePage
                            }}/>
        }
        return (
            <div id="app">
                <Header 
                    logined={{username: 'admin', nickname: '허돌프'}} 
                    pages={ this.props.page.list }
                    onPageChange={ this.handlePageChange }
                    active={ this.state.current.index }
                    />
                <section className="page">
                    <SideButton 
                        current={ this.state.current.index }
                        onPageChange={ this.handlePageChange }
                        length={{
                            min: 0,
                            max: this.props.page.length-1
                        }}
                        disable={ this.props.page.length === 0 }/>
                    { PageWrapper }
                </section>
            </div>
        )
    }
    componentDidUpdate(){
        if( this.state.current.page === 'empty' ){
            // Set Material_modal
            $('.modal').modal();
            $('#CreatePage').modal('open');
            // Set Material_select
            $('select').material_select();
            $('#set_community').off('change', this.handleOptionChange );
            $('#set_community').on('change', this.handleOptionChange );
        }
    }
}
App.defaultProps = defaultProps;

const mapStateToProps = (state)=>{
    return {
        page: state.PageReducer,
        community: state.CommunityReducer
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        getPageList: ()=>dispatch( getPageList() ),
        getCommunityList: ()=>dispatch( getCommunityList( true ) ),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)