import './App.css';
import React from 'react';
import Pages from './pages/'
import {AlertProvider} from './context';

class App extends React.PureComponent {
    render() {
        return (
            <AlertProvider>
            <div className="App">
                <Pages></Pages>
            </div>
            </AlertProvider>
        )
    };
}

export default App;
