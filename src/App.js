import './App.css';
import React from 'react';
import Pages from './pages/'
class App extends React.PureComponent {
    render() {
        return (
            <div className="App">
                <Pages></Pages>
            </div>
        )
    };
}

export default App;
