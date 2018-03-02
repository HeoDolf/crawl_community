// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
// Actions
import { getPageList, getBoardList } from './../actions/getList.act.js'
// Components
import { Header, EmptyPage, SideButton  } from './../components'
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

        this.onPageChange = this.onPageChange.bind(this);
    }
    /**
     * Servicies
     */
    onPageChange( pageIndex ){
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
        this.props.getPageList();
    }

    render(){
        let PageWrapper;
        if( this.state.current.page === 'empty' ){
            PageWrapper = <EmptyPage />
        } else if ( this.state.current.page === 'home' ){
            PageWrapper = <Home />
        } else {
            PageWrapper = <Page page={ this.state.current.page } />
        }

        return (
            <div id="app">
                <Header 
                    logined={{username: 'admin', nickname: '허돌프'}} 
                    pages={ this.props.page.list }
                    onPageChange={ this.onPageChange }
                    active={ this.state.current.index }
                    />
                <section className="page">
                { PageWrapper }
                </section>
                <SideButton disable={-1}/>
            </div>
        )        
    }
}
App.defaultProps = defaultProps;

const mapStateToProps = (state)=>{
    return {
        page: state.PageReducer
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        getPageList: ()=>dispatch( getPageList()),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)