import React from 'react';

const defaultProps = {
    description: "Main App"
}

class App extends React.Component {
    constructor(props, context){
        super(props, context);

        console.log( props, context );
    }
    render(){
        return (
            <h1>dddd</h1>
        )        
    }
}

export default App