import React, {useEffect, useLayoutEffect} from 'react';
import {Link} from 'react-router-dom';
import {Navbar, NavItem, Nav} from 'react-bootstrap';
import './index.scss';
import {faBars} from "@fortawesome/pro-light-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {useHistory} from 'react-router';
import {RouterPath} from '../../../const/';

export function Header(props) {
    const history = useHistory();
    React.useEffect(()=>{
        if (history.location.hash) {
            let anchorElement = document.getElementById(history.location.hash.replace('#',''));
            if(anchorElement) { anchorElement.scrollIntoView(); }
        }
    },[history.location.hash])
    return (
        <div className="container nav-container" id="top">
            <div className="row">
                <Navbar
                    inverse
                    staticTop={true}
                    collapseOnSelect={true}
                    className="header header-desktop fixed "
                >
                    <Navbar.Header>
                        <Navbar.Brand onClick={()=>{history.push('/')}}>
                            <Link to="/#top" style={{textDecoration: 'none', margin: 0, padding: 0}}>
                                <div className="logo"></div>
                            </Link>
                        </Navbar.Brand>
                        <Navbar.Toggle
                            onClick={(item) => {

                            }}
                        >
                            <FontAwesomeIcon style={{fontSize: '26px', marginTop: '16px'}} icon={faBars}></FontAwesomeIcon>
                            {/*<i id="responsive-menu-button" className="fa fas fa-bars" aria-hidden="true"></i>*/}
                        </Navbar.Toggle>
                    </Navbar.Header>
                    <div className="col-md-9">
                        <Navbar.Collapse>
                            <Nav pullLeft={true}>
                                <NavItem eventKey={1} onClick={()=>{history.push('/#product')}} >
                                    产品特色
                                </NavItem>
                                <NavItem eventKey={2}  onClick={()=>{history.push('/#pricing')}}>
                                    套餐详情
                                </NavItem>
                                <NavItem eventKey={2}
                                         onClick={()=>{history.push('/refill')}}
                                >
                                    手机充值
								</NavItem>
                                <NavItem eventKey={2} onClick={()=>{history.push('/#partner')}}  >
                                    友商福利
                                </NavItem>
                                <NavItem
                                    eventKey={2}
                                    onClick={() => {
                                        history.push(`${RouterPath.JOIN_US}`);
                                    }}
                                >
                                    加入我们
                                </NavItem>
                            </Nav>
                            <Nav pullRight={true}>
                                {/*<div className="headerSignInLink" style={{marginRight: '10px'}}>*/}
                                {/*    <Link to="/refill" className="signin-link">*/}
                                {/*        充值*/}
                                {/*    </Link>*/}
                                {/*</div>*/}
                                <div className="headerSignInLink">
                                    <Link to="/signIn" className="signin-link">
                                        用户登录
                                    </Link>
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>
            </div>
        </div>
    );
}
