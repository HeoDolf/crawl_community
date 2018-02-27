import React from 'react'
import { connect } from 'react-redux'

import { getPageList, getBoardList } from './../actions/getList.act.js'

import { Header, SideButton, EmptyPage } from './../components'
import Pages from './Pages.js'

const defaultProps = {
    description: "Main App",
    initPage: {
        index: -1,
        page: null
    }
}

class App extends React.Component {
    constructor(props, context){
        super(props, context);

        this.state = {}
        this.state.current = props.initPage;

        this.onPageChange = this.onPageChange.bind(this);
    }
    componentDidMount(){
        this.props.getPageList();
    }

    onPageChange( pageIndex ){
        // 가져오는게 끝났을 때 없데이트 하면 좋을 듯 한데
        this.setState( Object.assign({}, this.state, {
            current: {
                index: pageIndex, 
                page: pageIndex < this.props.page.list.length ? this.props.page.list[pageIndex] : null
            }
        }));
    }
    componentWillUpdate(nextProps, nextState){
        if( nextProps.page.list !== this.props.page.list ){
            return true;
        }
        if( nextState.current.index !== this.state.current.index ){
            if( nextState.current.index !== -1 ){
                this.props.getBoardList( nextState.current.page._community.name );
            }
            return true;
        }
        return false;
    }

    render(){
        return (
            <div id="app">
                <Header 
                    logined={{username: 'admin', nickname: '허돌프'}} 
                    pages={ this.props.page.list }
                    onPageChange={ this.onPageChange }
                    active={ this.state.current.index }
                    />
                {
                    this.state.current.page !== null 
                    ? <Pages page={ this.state.current.page } />
                    : <EmptyPage />
                }
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
        getPageList: ()=>dispatch( getPageList() ),
        getBoardList: (community)=>dispatch( getBoardList(community) )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
// export default App