import React from "react";
import {Button} from "element-react";
import {Locate} from "./locate";
import './dropdownv2.css'

function DropdownV2List(props) {
    const styFn = React.useCallback(() => {

        const btnEle = props.wrapper.current.getClientRects()[0];
        return {
            left: btnEle.x + btnEle.width - 120,
            top: btnEle.y + 27,
            position: 'fixed',
            border: `1px solid rgba(209,219,229,1)`,
            boxShadow: '0 2px 4px rgba(0, 0, 0,0.12), 0 0 6px rgba(0,0,0, 0.12)',
            background: '#fff',
            padding: '10px 0',
            width: '120px',
            zIndex: 1,
            lineHeight: '34px',
            fontSize: '12px'
        }
    }, [props.wrapper])

    return <div style={styFn()}
                onMouseLeave={props.onMouseOut}
    >
        {
            props.list.map(item => {
                return <div key={item.val}
                            className='dropv2-item'
                            onClick={() => {
                                props.change && props.change(item.val)
                            }}>{item.label}</div>
            })
        }
    </div>
}

export function Dropdown(props) {
    const [list, setList] = React.useState(props.list || [])
    const [val] = React.useState(props.val || '操作')
    const [open, setOpen] = React.useState(false)
    const listFn = React.useCallback(() => {
        if (JSON.stringify(list) !== JSON.stringify(props.list)) {
            setList(props.list)
        }
    }, [props.list, list])
    const wrapperRef = React.useRef(null);
    React.useEffect(() => {
        listFn();
    }, [props.list])//eslint-disable-line
    React.useEffect(() => {
        const scrolEvent = (e) => {
            setOpen(false)
        };

        window.document.addEventListener("scroll", scrolEvent, {passive: false});
        window.document.querySelector('.el-table__body-wrapper').addEventListener("scroll", scrolEvent, {passive: false});
        return () => {
            window.document.removeEventListener("scroll", scrolEvent, {passive: false});
            window.document.querySelector('.el-table__body-wrapper').removeEventListener("scroll", scrolEvent, {passive: false});
        }
    }, []);
    return <div
        ref={wrapperRef}
        style={{
            display: 'inline-block',
            borderRadius: 4,
            overflow: `hidden`
        }}

    >
        <Button.Group>
            <Button
                type="primary"
                size="small"
                onClick={() => {
                    setOpen(!open)
                }}>
                {val}&nbsp;&nbsp;<i className="el-icon-arrow-down el-icon-down"></i>
            </Button>
        </Button.Group>
        {open ? <div>
            <Locate><DropdownV2List
                onMouseOut={() => {
                    setOpen(false)
                }}
                change={(val) => {
                    props.onChange(val)

                }}
                wrapper={wrapperRef} list={list}></DropdownV2List></Locate>
        </div> : null}
    </div>
}
