// Libaries, Modules
import React from 'react'
import { connect } from 'react-redux'
// Components
import { ContentList } from './../../components'

import axios from 'axios'

class BoadrItem extends React.Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            loadContent: false,
            content: {
                pages: [],
                list: []
            }
        }
        this.getContentList = this.getContentList.bind(this);
    }

    /**
     * Servicies
     */
    getContentList( community, board, baseTime ){
        const params = {params:{baseTime:baseTime}}
        axios.get(`/api/crawler/${community}/${board}`, params)
            .then((response)=>{
                console.log( response.data );
                this.setState(Object.assign({}, this.state, {
                    content: response.data
                }));
            })
            .catch((error)=>{
                console.log( error.response );
            });
    } 
    /**
     * Life Cycle
     */
    componentDidMount(){
        this.setState(Object.assign({}, this.state, {
            loadContent: true
        }));
    }
    componentWillReceiveProps(nextProps){
        console.log( nextProps );
        if( this.props.current.name !== nextProps.current.name ){
            this.getContentList( this.props.community, nextProps.current.name, "16:00:00" );
        }
    }

    render(){
        return (
            <div className={`board ${this.props.current.name}`}>
            <h6>{ this.props.current.name }</h6>
            {
                this.state.content.list
                ? <ContentList contents={ this.state.content.list }/>
                : null
            }
            </div>
        )
    }
}

export default BoadrItem