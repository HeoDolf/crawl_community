// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
// Actions
import { getPageList, getCommunityList } from './../actions/getList.act.js'
// Components
import { Header, SideButton } from './../components'
// Containers 
import Page from './Page.js'
import Home from './Home.js'

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
        if( nextProps.page.status !== 'READY' && JSON.stringify(nextProps.page) !== JSON.stringify(this.props.page) ){
            let current = this.state.current.index;
            if( current > 0 && nextProps.page.length < this.props.page.length ){
                current -= 1;
            }
            this.setState( Object.assign({}, this.state, {
                current: {
                    index: current,
                    page: current > -1 ? nextProps.page.list[current] : 'home'
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

    render(){
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
                    {
                        this.state.current.page === 'home'
                        ? <Home />
                        : <Page page={ this.state.current.page } />
                    }
                </section>
                
            </div>
        )
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