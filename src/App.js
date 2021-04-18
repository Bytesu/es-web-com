import './App.css';
import React from 'react';
import Pages from './pages/'
import {AlertProvider} from './context';

class App extends React.PureComponent {
    render() {
        return (
            <AlertProvider>
                    <Pages></Pages>
            </AlertProvider>
        )
    };
}

export default App;
