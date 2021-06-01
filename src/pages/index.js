import React from 'react';
import './index.css';
import PropTypes from 'prop-types';

function Panel(props) {
    const clientHeight = window.innerHeight;
    const initHeight = props.initHeight || 300;
    const [state, setState] = React.useState({show: false, top: false,}) //{show:false,top:false,}
    const [move, setMove] = React.useState({x: 0, y: 0, w: 0, h: 0})

    const setMoveFn = React.useCallback((param = {}) => {
        setMove({
            ...move,
            ...param
        })
    }, [move])
    const marginTop = state.top ? 0 : clientHeight - initHeight - 50;
    const stretch = -move.h;
    const scrollOver = (marginTop - stretch) < 0;
    return (
        <div className='page'>
            <div>
                {
                    React.cloneElement(props.title, {
                        onClick: () => setState({show: true})
                    })
                }
            </div>
            {
                state.show && <div
                    className='panel-container'
                    style={{height: clientHeight}}
                >
                    <div
                        className='panel'
                        style={{
                            marginTop: (Math.abs(stretch) == 0 && state.top) ? 0 : (scrollOver ? 0 : (marginTop - stretch))
                        }}
                    >
                        <div className='close'>
                            <span
                                onClick={() => {
                                    setState({show: false})
                                    props.onClose?.()
                                }}>close</span>
                        </div>
                        <div
                            onTouchEnd={(e) => {
                                setState({
                                    ...state,
                                    top: stretch > 0 && marginTop > 0 && stretch > marginTop / 2
                                })
                                setMoveFn({x: 0, y: 0, w: 0, h: 0})
                            }}
                            onTouchMove={(e) => {
                                if (e.touches[0]) setMoveFn({h: e.touches[0].pageY - move.y,})
                            }}
                            onTouchStart={(e) => {
                                if (e.touches[0]) setMoveFn({y: e.touches[0].pageY,})
                            }}
                            className='content'
                            style={{
                                height: state.top ? 'calc(100vh - 50px)' : initHeight + (marginTop > 0 ? stretch : 0),
                            }}>
                            {props.children}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

Panel.propTypes = {
    title: PropTypes.element,
    onClose:PropTypes.func,
    initHeight:PropTypes.number,
}

function Index() {
    return <div>
        <Panel
            title={
                <button>whatever you want</button>
            }
            initHeight={100}
            onClose={() => {
            }}
        >
            <div style={{padding:20}}>
                whatever you want
            </div>
        </Panel>
    </div>
}

export default Index;
