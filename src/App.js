import './App.css';
import Search from './search/'
import 'element-theme-default';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          single page app for search.
        </p>
        <Search></Search>
      </header>
    </div>
  );
}

export default App;
