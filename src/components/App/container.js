// Libaries, Modules
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
// Presenter
import { SideButton } from './presenter'
// Components 
import Page from './../Page'
import Header from './../Header'
// Style
import './style.css'

const defaultProps = {
    description: "Main App",
    initPage: {
        index: -1,
        page: 'home'
    }
}

class Container extends Component {
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
                        ? <div className="wrapper"><a>Home</a></div>
                        : <Page index={ this.state.current.index } page={ this.state.current.page } />
                    }
                </section>
                
            </div>
        )
    }
}
Container.defaultProps = defaultProps;
Container.propTypes = {
    page: PropTypes.object.isRequired,
    community: PropTypes.object.isRequired,

    getPageList: PropTypes.func.isRequired,
    getCommunityList: PropTypes.func.isRequired
}

export default Container