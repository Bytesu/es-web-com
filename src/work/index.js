import React from 'react';
import './index.css'
import {_PureComponent} from '../search/common'
import _ from 'underscore';

function Header(props) {
    return <header>
        <div className="header">{props.children}</div>
    </header>
}

class App extends _PureComponent {
    state = {
        skills: {
            'React&Vue技能': this.formatData([
                '基础组件',
                '基础组件单元测试',
                '业务组件',
                '业务组件单元测试',
                '复杂交互效果',
                '组件性能优化',
                '工程化构建',
                '图表展示',
                '数据大屏',
                '网站开发',
                '业务模块开发',
                '前端项目推进',
                '前端技术培训',
                '等相关技能'
            ]),
            'jQuery技能栈': this.formatData([
                'jquery类开发和维护',
                'jquery类项目开发',
            ]),
            '工作方式': this.formatData([
                '西安驻场',
                '远程工作',
            ]),
            '其他服务': this.formatData([
                '前端技术交流',
                '人才梯队培养',
            ]),
            '合作形式': this.formatData([
                '兼职',
                '项目制',
            ]),
        },
        about: {
            '关于我们': this.formatData([
                '如您在招聘高级前端来协助完成您的产品，暂未招到合适人选，我们能够协助您过度到合适人选到来。' +
                '我们是西安软件领域创业者，受疫情影响, 今年业务不是太好, 希望通过此种方式为同业提供帮助和度过眼前处境。<br/>' +
                '如信赖, 请放心我们的技术能力，虽然比不上阿里前端专家, 但也自信看齐阿里高级前端.<br/>'+
                '多年的工作经历使我们能够用更成熟的方式去处理合作中的问题、工作沟通、团队协作。<br/>' +
                '对压力有足够的韧性, 对合作相信我们是"好脾气"的合适人员。<br/>' +
                '我们目标明确，请放心代码安全问题.<br/>'+
                '<br/>最后我们期待与您合作，或者更进一步能够成为创业路上朋友.'
            ]),
            '您需要我们的场景': this.formatData([
                '如您在招聘高级前端来协助完成您的产品，暂未招到合适人选时，我们能够协助您过度到合适人选到来。'
            ])
        },
        copyed: false,
    }

    formatData(list) {
        return list.map(item => {
            return {
                id: this.genId(),
                value: item,
                label: item
            }
        })
    }


    componentDidMount() {
    }

    UNSAFE_componentWillUnMount() {
        this.timer && clearTimeout(this.timer);
    }

    copySuccess = _.debounce(() => {
        const wx = document.querySelector('.skills-item-wx')

        var range = document.createRange();
        range.selectNodeContents(wx);
        range.setStartBefore(wx.querySelector('span'))
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range)
        document.execCommand("copy");
        this.setState({copyed: true}, () => {
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({copyed: false})
            }, 3000)
        })
    }, 300)

    render() {
        const {state} = this;
        return (
            <div className="front-work-app">
                <div className="title">前端服务</div>
                {
                    Object.keys(state.skills).map(key => {
                        return <div key={key}>
                            <Header>{key}</Header>
                            <div className="skills flex-row">
                                {
                                    state.skills[key].map(item => {
                                        return <p
                                            className="skills-item"
                                            title={item.label}
                                            key={item.id}>{item.label}</p>
                                    })
                                }
                            </div>
                        </div>
                    })
                }
                <Header>联系我们</Header>
                <div className="skills flex-row">
                    <p
                        href="java"
                        onClick={this.copySuccess}
                        className="skills-item skills-item-wx"
                    >(复制)微信:<span>tclm-soft</span>{state.copyed ? <span className="copy-success">复制成功</span> : null}</p>
                    <a
                        href="tel:15029351330"
                        className="skills-item skills-item-phone"
                    >(拨打)电话:15029351330</a>
                </div>
                {
                    Object.keys(state.about).map(key => {
                        return <div
                            key={key}
                        >
                            <Header>{key}</Header>
                            <div
                                className="skills flex-row">
                                {
                                    state.about[key].map(item => {
                                        return <p
                                            className="desc"
                                            title={item.label}
                                            key={item.id}
                                            dangerouslySetInnerHTML={{__html: item.label}}
                                        ></p>
                                    })
                                }
                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
    ;
}

export default App;
