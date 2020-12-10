import React, {createRef} from 'react';
import _ from 'underscore';
import './search.css';
import PropTypes from 'prop-types';
import {_PureComponent} from './common'
import {ConstCode, postFn} from '../request'

/**
 * @desc  doc info
 * @todo
 * 1. ok-测试.
 * 2. ok-接口对接
 * 交互
 * 1. ok-选中后,选中的数据回显到输入框
 * 2. 失焦后,提示面板隐藏
 * 3. 删除历史记录(有需求层面分析，暂不处理)
 * 4. 复制粘贴
 * 5. 多实例测试
 *
 *
 * 功能实现
 * 1. 停止输入后搜索
 * 2. 保留历史记录
 * 3. 搜索结果中高亮关键词
 * 4.
 */

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
    return <input
        ref={ref}
        type="text"
        {...props}
        onChange={onChangeDeb}
    />
})


/**
 * suggestion com
 * @param props
 * @returns {*}
 * @private
 */
class Suggettions extends _PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            list: props.datas,
            active: props.active,
        }
    }

    activeItemFn() { //
    }

    static getDerivedStateFromProps(props, state) {
        if (props.active !== state.active || JSON.stringify(props.datas) !== JSON.stringify(state.list)) {
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
            {list.map((item, index) => <div
                key={item.id}
                onClick={() => {
                    props.onItemClick && props.onItemClick(item, index)
                }}
                className={(index === active ? 'suggestion-item-active ' : '') + ' suggestion-item'}
            >{item.value}</div>)}
        </div>
    }
}

Suggettions.propTypes = {
    datas: PropTypes.array, //列表
    active: PropTypes.number, //当前选中索引
    onItemClick: PropTypes.func //选中项事件
}


export default class Search extends _PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            suggestion: {
                show: false,
                list: [
                    {value: '1'},
                    {value: '2'},
                    {value: '3'},
                ],
                active: -1
            },
            keyword: '',
            history: []
        }
        this.searchRef = createRef();

    }

    _inputChange(e) {
        let keyword = e.target.value;//, {history} = self.state;

        this._inputValueChangeEffect({keyword});
    }

    /**
     * value change effect
     * @param keyword . the keyword need to change  presentation
     * @param suggestion. the suggestion need to change
     * @private
     */
    async _inputValueChangeEffect({keyword, suggestion}) {
        const self = this;
        let list = await this._fetch(keyword);
        let {history} = self.state;
        history = history.filter(item => item.value !== keyword); //filter repeat
        history.unshift({id: self.genKey(), value: keyword});//add first
        console.log(history);
        self.setSta({
            history: history,
            suggestion: Object.assign({}, this.state.suggestion, {
                show: true,
                active: -1,
                list: list,
            }, suggestion || {}),
            keyword: keyword,
        })
    }

    _open(search) {
        // window.open('https://github.com/search?q=' + search, '_blank');
    }

    _keyDown(e) {
        const self = this, {suggestion} = this.state, negativeOneIndex = -1;
        switch (e.keyCode) {
            case 13: //return
                let search = suggestion.active === negativeOneIndex ? self.state.keyword : suggestion.list[suggestion.active].value;
                // window.open('https://github.com/search?q=' + search, '_blank');
                self._open(search);
                break;
            case 38: //up
                let preIndex = suggestion.active - 1;
                if (preIndex < negativeOneIndex) return;
                self.setSta({
                    suggestion: Object.assign({}, suggestion, {
                        active: preIndex,
                    })
                })
                break;
            case 40: //down
                let nextIndex = suggestion.active + 1, len = suggestion.list.length;
                if (nextIndex > len - 1) return;
                self.setSta({
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
        self.setSta({show: false});
    }

    async _fetch(keyword = '') {
        const self = this;
        if (!keyword) return [];
        let list = [];
        try {
            let res = await postFn('/graphql', {
                query: `
                {
                  __type(name: "Repository") {
                    name
                    kind
                    description
                    fields {
                      name
                      description
                    }
                  }
                  search(query: ${keyword}, type: REPOSITORY, first: 10) {
                    edges {
                      node
                    }
                  }
                }
            `
            })
            if (res.code === ConstCode.OK) {
                list = res.data.__type.fields.map(item => ({id: self.genId(), value: item.name.replace(keyword,`<span>${keyword}</span>`)}))
            }
        } catch (error) {
            // list = [{id: -1, value: '[接口]'+error.message}];
            console.warn('接口获取失败->' + error.message)

        }
        return list;
    }

    componentDidMount() {
        // this._fetch();

    }

    render() {
        const {history, keyword, suggestion} = this.state, self = this;
        return <div
            className="search-input-ctner"
        >
            <div>
                <Input
                    ref={this.searchRef}
                    placeholder="请输入搜索关键字"
                    defaultValue={keyword}
                    onChange={this._inputChange.bind(this)}
                    onKeyDown={this._keyDown.bind(this)}
                ></Input>
            </div>
            {suggestion.show && ((keyword && !!suggestion.list.length) || (!keyword && !!history.length)) ? <Suggettions
                datas={keyword ? suggestion.list : history}
                active={suggestion.active}

                onItemClick={(item, index) => {
                    self.searchRef.current.value = item.value;
                    self._inputValueChangeEffect({
                        keyword: item.value,
                        suggestion: Object.assign({}, suggestion, {show: false, active: index})
                    })
                    self._open(item.value);
                }}
            ></Suggettions> : null}
        </div>
    }

}
