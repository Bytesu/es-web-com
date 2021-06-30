import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import './footer.scss';
import axios from 'axios';
import {AlertContext} from '../../../context';
import {FontAwesomeIcon} from '../../../lib';
import {faChevronRight,faChevronDown} from '@fortawesome/pro-light-svg-icons'

const Types = {
    ENTERPRISE: 1,
    BUSINESS: 2,
    CONTACT: 3,
};

export function Footer(props) {
    const [state, setState] = useState(0);
    const [email, setEmail] = useState('');
    const context = useContext(AlertContext);
    const handleSubmit = (e) => {
        e.preventDefault();
        const subscribeUrl = `${process.env.REACT_APP_API_URL}contact/subscribe`;
        var bodyFormData = new FormData();
        bodyFormData.append('email', email);

        return axios({
            method: 'post',
            url: subscribeUrl,
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data'},
        })
            .then((res) => {
                const {data} = res;
                if (data) {
                    context.setAlert({
                        type: 'success',
                        content: '订阅已成功，感谢您对伐木类的支持!',
                    });
                }
            })
            .catch((error) => {
                if (error.response) {
                    context.setAlert({
                        type: 'danger',
                        content: '订阅失败，请稍后重新尝试!',
                    });
                }
            });
    };
    return (
        <footer id="footer">
            <div className="footer">
                <div
                    className="panel-group visible-xs"
                    id="accordionFooter"
                    role="tablist"
                    aria-multiselectable="true"
                >
                    <div className="panel panel-default">
                        <div
                            className="panel-heading"
                            role="tab"
                            id="headingOne"
                            onClick={() => {
                                setState(state === Types.ENTERPRISE ? 0 : Types.ENTERPRISE);
                            }}
                        >
                            <h4 className="panel-title">
                                <a
                                    className={state !== Types.ENTERPRISE ? 'collapsed' : ''}
                                    role="button"
                                    data-toggle="collapse"
                                    data-parent="#accordionFooter"
                                    href="#collapseOne"
                                    aria-expanded="false"
                                    aria-controls="collapseOne"
                                >
                                    企业 <FontAwesomeIcon className="pull-right" icon={state === Types.ENTERPRISE?faChevronDown:faChevronRight}></FontAwesomeIcon>
                                </a>
                            </h4>
                        </div>
                        <div
                            id="collapseOne"
                            className={'panel-collapse   ' + (state === Types.ENTERPRISE ? '' : 'collapse')}
                            role="tabpanel"
                            aria-labelledby="headingOne"
                        >
                            <div className="panel-body">
                                <ul className="list-icons">
                                    <li>
                                        <Link to="/about">企业介绍</Link>
                                    </li>
                                    <li>
                                        <Link to="/policy">服务条款</Link>
                                    </li>
                                    <li>
                                        <Link to="/career">招贤纳士</Link>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://join.famulei.us">
                                            合作伙伴推广注册
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div
                            className="panel-heading"
                            role="tab"
                            id="headingTwo"
                            onClick={() => {
                                setState(state === Types.BUSINESS ? 0 : Types.BUSINESS);
                            }}
                        >
                            <h4 className="panel-title">
                                <a
                                    className={state !== Types.BUSINESS ? 'collapsed' : ''}
                                    role="button"
                                    data-toggle="collapse"
                                    data-parent="#accordionFooter"
                                    href="#collapseTwo"
                                    aria-expanded="false"
                                    aria-controls="collapseTwo"
                                >
                                    业务办理 <FontAwesomeIcon className="pull-right"
                                                          icon={state === Types.BUSINESS?faChevronDown:faChevronRight}></FontAwesomeIcon>
                                </a>
                            </h4>
                        </div>
                        <div
                            id="collapseTwo"
                            className={'panel-collapse  ' + (state === Types.BUSINESS ? '' : 'collapse')}
                            role="tabpanel"
                            aria-labelledby="headingTwo"
                        >
                            <div className="panel-body">
                                <ul className="list-icons">
                                    <li>
                                        <a href="/#pricing">激活新卡</a>
                                    </li>
                                    <li>
                                        <Link to="/signIn">套餐变更</Link>
                                    </li>
                                    <li>
                                        <Link to="/signIn">申请补卡</Link>
                                    </li>
                                    <li>
                                        <a href="mailto:support@famulei.us">旅行卡批发</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-default">
                        <div
                            className="panel-heading"
                            role="tab"
                            id="headingThree"
                            onClick={() => {
                                setState(state === Types.CONTACT ? 0 : Types.CONTACT);
                            }}
                        >
                            <h4 className="panel-title">
                                <a
                                    role="button"
                                    data-toggle="collapse"
                                    data-parent="#accordionFooter"
                                    className={state !== Types.CONTACT ? 'collapsed' : ''}
                                    href="#collapseThree"
                                    aria-expanded="true"
                                    aria-controls="collapseThree"
                                >
                                    联系我们 <FontAwesomeIcon className="pull-right"
                                                          icon={state === Types.CONTACT?faChevronDown:faChevronRight}></FontAwesomeIcon>
                                </a>
                            </h4>
                        </div>
                        <div
                            id="collapseThree"
                            className={'panel-collapse  ' + (state === Types.CONTACT ? '' : 'collapse')}
                            role="tabpanel"
                            aria-labelledby="headingThree"
                        >
                            <div className="panel-body">
                                <ul className="list-icons">
                                    <li>
                                        +1 415-993-7046
                                        <br/>
                                        <span>(周一至周五10am-5pm)</span>
                                    </li>
                                    <li>
                                        <a href="mailto:support@famulei.us">support@famulei.us</a>
                                    </li>
                                    <li>
                                        <a href="https://www.t-mobile.com/coverage/lte-comparison-map" target="_blank">
                                            T-Mobile信号覆盖
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.att.com/maps/wireless-coverage.html" target="_blank">
                                            AT&T信号覆盖
                                        </a>
                                    </li>
                                    <li>
                                        <Link to="/customer">客服建议和投诉</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-md-3 text-center hidden-xs">
                            <div className="footer-content text-left content-col1">
                                <h2>企业</h2>
                                <ul className="list-icons">
                                    <li>
                                        <Link to="/about">企业介绍</Link>
                                    </li>
                                    <li>
                                        <Link to="/policy">服务条款</Link>
                                    </li>
                                    <li>
                                        <Link to="/career">招贤纳士</Link>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://join.famulei.us">
                                            合作伙伴推广注册
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3 text-center hidden-xs">
                            <div className="footer-content text-left content-col2">
                                <div className="row">
                                    <div className="col-sm-12 clearfix">
                                        <h2>业务办理</h2>
                                        <ul className="list-icons">
                                            <li>
                                                <a href="/#pricing">激活新卡</a>
                                            </li>
                                            <li>
                                                <Link to="/signIn">套餐变更</Link>
                                            </li>
                                            <li>
                                                <Link to="/signIn">申请补卡</Link>
                                            </li>
                                            <li>
                                                <a href="mailto:support@famulei.us">旅行卡批发</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 text-center hidden-xs">
                            <div className="footer-content text-left content-col3">
                                <div className="row">
                                    <div className="col-sm-12 clearfix">
                                        <h2>联系我们</h2>
                                        <ul className="list-icons">
                                            <li>
                                                +1 415-993-7046
                                                <br/>
                                                <span>(周一至周五10am-5pm）</span>
                                            </li>
                                            <li>
                                                <a href="mailto:support@famulei.us">support@famulei.us</a>
                                            </li>
                                            <li>
                                                <a
                                                    href="https://www.t-mobile.com/coverage/lte-comparison-map"
                                                    target="_blank"
                                                >
                                                    T-Mobile信号覆盖
                                                </a>
                                            </li>
                                            <li>
                                                <a href="https://www.att.com/maps/wireless-coverage.html"
                                                   target="_blank">
                                                    AT&T信号覆盖
                                                </a>
                                            </li>
                                            <li>
                                                <Link to="/customer">客服建议和投诉</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-3 right-column text-center">
                            <div className="footer-content text-left content-col4">
                                <h2>订阅最新资讯</h2>
                                <div
                                    className="margin-bottom-clear clearfix"
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            className="form-control pull-left"
                                            id="subscribe"
                                            style={{marginBottom:10}}
                                            placeholder="我们要把邮件送到哪里？"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            name="email"
                                            required
                                        />
                                        <button type="submit" className="btn btn-default" onClick={handleSubmit}>
                                            提交
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <small className="copyright text-center">
                    <p>
                        ©2021 <script>document.write(new Date().getFullYear());</script>. All rights reserved by{' '}
                        <a href="/#">Overture LLC</a>.
                    </p>
                </small>
            </div>
        </footer>
    );
}
