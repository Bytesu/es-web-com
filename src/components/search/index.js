import React, {createRef} from 'react';
import _ from 'underscore';
import './search.css';
import PropTypes from 'prop-types';
import {_PureComponent, ErrorBoundary} from './common'

/**
 *
 * input com
 * @param props
 * @returns {*}
 * @private
 */
const Input = React.forwardRef((props, ref) => {
    const onChange = props.onChange || function (v) {
        console.log(v.target.value);
    }
    const onChangeDeb = _.debounce(onChange, 300);
    const {loading, ..._props} = props;
    return <div>
        <input
            ref={ref}
            type="text"
            {..._props}
            onChange={onChangeDeb}
        />
        {loading ? <div className='input-loading'>加载...</div> : null}
    </div>
})
Input.propTypes = {
    loading: PropTypes.bool, //是否加载中
    onChange: PropTypes.func //输入框内容改变
}


/**
 * suggestion com
 * @param props
 * @returns {*}
 * @private
 */
class Suggesttions extends _PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            list: props.datas,
            active: props.active,
            props
        }
    }

    activeItemFn() { //
    }

    static getDerivedStateFromProps(props, state) {

        if (props.active !== state.props.active || JSON.stringify(props.datas) !== JSON.stringify(state.props.list)) {
            return {
                active: props.active,
                list: props.datas
            };
        }
        return null;
    }

    render() {
        const {list, active} = this.state, {props} = this;
        return <div
            className="suggestion-ctner"
        >
            {list.map((item, index) => <a
                title={item.value}
                key={item.id}
                onClick={() => {
                    props.onItemClick && props.onItemClick(item, index)
                }}
                className={(index === active ? 'suggestion-item-active ' : '') + ' suggestion-item'}
                dangerouslySetInnerHTML={{__html: item.label}}
            ></a>)}
        </div>
    }
}

Suggesttions.defaultProps = {
    active: -1
};
Suggesttions.propTypes = {
    datas: PropTypes.array.isRequired, //列表
    active: PropTypes.number, //当前选中索引
    onItemClick: PropTypes.func //选中项事件
}

export default class Search extends _PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            suggestion: {
                show: false,
                loading: false,
                list: [],
                active: -1
            },
            _keyword: props.keyword,
            keyword: props.keyword,
            history: props.keyword ? [
                {id: -1, value: props.keyword}
            ] : []
        }
        this.listObjCached = {};    //search cacahe
        this.searchRef = createRef();
        this._onBlur = _.debounce(this._onBlur, 300)

    }

    _inputChange = (e) => {
        let keyword = e.target.value;
        this._inputValueChangeEffect({keyword});

    }

    componentDidMount() {
        if (this.props.keyword) //for init keyword
            this.updateInputVal({value: this.props.keyword}, -1);

    }

    componentWillUnmount() {
        this.listObjCached = null;

    }


    /**
     * value change effect
     * @param keyword . the keyword need to change  presentation
     // * @param suggestion. the suggestion need to change
     * @private
     */
    async _inputValueChangeEffect({keyword}) {

        const self = this, {state} = this;
        let {history} = self.state;
        //1. keyword is ''
        if (!keyword) {
            return self.setState({
                history: history,
                suggestion: Object.assign({}, state.suggestion, {
                    show: true,
                    active: -1,
                }),
                keyword: keyword,
            })
        }

        //2. keyword is cached
        let existIndex = history.findIndex(item => item.value === keyword);
        if (
            existIndex !== -1
            && keyword
            && history
            && history.length
            && self.listObjCached[keyword]
        ) {
            history = [history[existIndex], ...history.slice(0, existIndex), ...history.slice(existIndex + 1)]
            return self.setState({
                history: history,
                suggestion: Object.assign({}, state.suggestion, {
                    show: true,
                    active: -1,
                    list: self.listObjCached[keyword],
                }),
                keyword: keyword,
            })
        }

        //3. fetch data by keyword
        await self.setSta({
            suggestion: Object.assign({}, state.suggestion, {
                loading: true,//loading start
            }),
        });
        const fetchRes = await this._fetch(keyword);
        if (fetchRes.cancel) return ;//canceled request
        self.listObjCached[keyword] = fetchRes.list;

        history.unshift({id: self.genKey(), value: keyword, label: keyword});//add first

        self.setState({
            history: history,
            suggestion: Object.assign({}, state.suggestion, {
                show: true,
                loading: false,//loading finished
                active: -1,
                list: fetchRes.list,
            }),
            keyword: keyword,
        })

    }

    _onFocus = () => {
        this._inputValueChangeEffect({keyword:this.state.keyword})

    }

    _open = (search) => {
        if (search.url) return window.open(search.url, '_blank');
        window.open('https://github.com/search?q=' + search.value, '_blank');

    }


    static getDerivedStateFromProps(props, state) {
        if (props.keyword !== state._keyword) {
            return Object.assign({}, state, {
                keyword: props.keyword,
                _keyword: props.keyword,
            });
        }
        return null;

    }


    _keyDown = (e) => {

        const self = this, {suggestion} = this.state, negativeOneIndex = -1;

        switch (e.keyCode) {
            case 13: //return key
                let search = suggestion.active === negativeOneIndex ? {value: self.state.keyword} : suggestion.list[suggestion.active];
                this.updateInputVal(search, -1)
                self._open(search);
                break;
            case 38: //up key
                let preIndex = suggestion.active - 1;
                if (preIndex < negativeOneIndex) return;
                self.setState({
                    suggestion: Object.assign({}, suggestion, {
                        active: preIndex,
                    })
                })
                break;
            case 40: //down key
                let nextIndex = suggestion.active + 1, len = suggestion.list.length;
                if (nextIndex > len - 1) return;
                self.setState({
                    suggestion: Object.assign({}, suggestion, {
                        active: nextIndex,
                    })
                })
                break;
            default:
                break;
        }

    }

    _suggustionSelect() {
        const self = this;
        self.setState({show: false});

    }

    async _fetch(keyword = '') {
        if (!keyword) return {list: []};
        return await this.props.search(keyword)

    }

    _onBlur = () => {
        this.setState({
            suggestion: Object.assign({}, this.state.suggestion, {
                show: false,
            })
        })

    }


    componentDidUpdate(preProps, preState, spanshot) {
        if (preState._keyword !== this.state._keyword) {
            this.updateInputVal({value: this.state._keyword}, -1)
        }
    }


    updateInputVal(item, currentIndex) {
        const self = this;//, {suggestion} = this.state;
        self.searchRef.current.value = item.value;
        // delete suggestion.list;
        self._inputValueChangeEffect({keyword: item.value})
        if (currentIndex !== -1 && item) {
            self._open(item);
        }

    }


    render() {
        const {history, keyword, suggestion} = this.state, self = this;
        //display suggestion: 1. loading 2. suggestion.show==true 3. list or history exist
        const showSug = !suggestion.loading
            && suggestion.show
            && ((keyword && !!(suggestion.list || []).length) || (!keyword && !!(history || []).length));
        return <ErrorBoundary>
            <div
                className="search-input-ctner"
            >
                <div>
                    <Input
                        ref={self.searchRef}
                        placeholder="请输入搜索关键字"
                        defaultValue={keyword}
                        loading={suggestion.loading}
                        onChange={self._inputChange}
                        onBlur={self._onBlur}
                        onFocus={self._onFocus}
                        onKeyDown={self._keyDown}
                    ></Input>
                </div>
                {
                    showSug ? <Suggesttions
                        datas={keyword ? suggestion.list : history}
                        active={suggestion.active}
                        onItemClick={(item, index) => {
                            self.updateInputVal(item, index)
                        }}
                    ></Suggesttions> : null
                }
            </div>
        </ErrorBoundary>
    }

}

Search.propTypes = {
    keyword: PropTypes.string, //props 数据源
    /**
     *
     *  @todo 此处需约束外部代码,分两种场景
     * 1. [已实现]固定UI展示,
     * 2. [待实现]定制化UI展示, 二阶段实现
     *
     * 此处待优化,1. 未约束参数类型,2. 未约束返回值类型
     * 业务组件调用, 参数为查询字符串,返回值需遵循结构：
     * {
     *  cancel:true,
     *  list:[{id:'',label:'',value:'',url:''}],
     *  }
     */
    search: PropTypes.func.isRequired
}


