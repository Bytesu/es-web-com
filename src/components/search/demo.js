import '../common.css';
import React from 'react';
import Search from './'
import {ConstCode, postFn} from "../../lib/request";

class App extends React.PureComponent {
    state = {
        keyword: 'react',
    }
    componentDidMount() {
    }

    static getDerivedStateFromProps() {
        return null;
    }

    async searchFn(keyword, requestId) {
        let list = [];
        try {
            const res = await postFn('/graphql', {
                requestId,
                query: ` {
                  search(query: "${keyword}", type: REPOSITORY, first: 10) {
                    nodes {
                      ... on Repository {
                        id
                        name
                        description
                        nameWithOwner
                        owner {
                          id
                        }
                        url
                      }
                    }
                  }
                }
            `
            })
            list = res.data.data.search.nodes.map(item => ({
                id: item.id,
                value: item.nameWithOwner,
                url: item.url,
                label: item.nameWithOwner.replace(keyword, `<span>${keyword}</span>`),
            }))
            return {list};
        } catch (error) {
            return {
                cancel: error.code === ConstCode.CANCEL,
                list
            };
        }
    }

    render() {
        const {keyword} = this.state;
        return (
            <div className="App">
                <header className="App-header">

                    <button
                        onClick={() => {
                            this.setState({keyword: this.state.keyword == 'r' ? 'react' : 'r'});
                        }}
                    >change keyword to : {this.state.keyword == 'r' ? 'react' : 'r'}</button>
                    <p>
                        single page app for search.
                    </p>
                    <Search
                        search={(keyword) => this.searchFn(keyword, 'search-1-')}
                    ></Search>
                    <Search
                        search={(keyword) => this.searchFn(keyword, 'search-2-')}
                        keyword={keyword}
                    ></Search>

                </header>
            </div>
        )
    };
}

export default App;
