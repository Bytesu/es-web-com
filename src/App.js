import './App.css';
import React from 'react';
import FrontWork from './work/'
class App extends React.PureComponent {
    state = {
    }

    componentDidMount() {
    }

    static getDerivedStateFromProps() {
        return null;
    }

    render() {
        return (
            <div className="App">
                <FrontWork></FrontWork>
            </div>
        )
    };
}

export default App;
