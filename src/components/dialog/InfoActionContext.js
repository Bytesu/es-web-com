import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import {Dialog, Loading} from './components'
import {debounce} from 'lodash';
import {ActionBoxContext} from "./context"

let dialogIndex = 0;

export function genId() {
    dialogIndex += 1;
    return `ido-action-box-${dialogIndex}`;
}


const g = {id: ''};

export function useActionBox() {
    const [actionConfig, setActionConfig] = useState([]);
    const open = (actionBoxItem) => {
        if (actionBoxItem.id) { // exist judge
            const existItem = actionConfig.filter(item => item.id === actionBoxItem.id);
            if (existItem?.length ?? false) return;
        }
        actionBoxItem.id = actionBoxItem.id || genId();
        setActionConfig([...actionConfig, actionBoxItem]);

    };
    const clear = id => {
        if (g[id]) {
            clearTimeout(g[id]);
        }
    };
    const timerClose = debounce((id, time = 2000) => {
        clear(id);
    }, 400);
    const cancelClose = debounce(clear, 300);
    const close = id => {
        setActionConfig(actionConfig.filter(item => item.id !== id));
    };
    return {
        timerClose,
        cancelClose,
        actionConfig, // state data
        close,        // close fn
        setBodyComponent: open, //
        open,          // open fn
    };
}

const $rootOther = document.getElementById('otherRoot');
export const ActionBoxTypes = {
    BOX: 'BOX',
    DIALOG: 'DIALOG',
    LOADING: 'LOADING',
    DIALOG_CONFIRM: 'DIALOG_CONFIRM',
};


function ActionBox(props) {
    const el = document.createElement('div');
    $rootOther?.appendChild(el);
    if (!props) {
        return <div>Loading</div>
    }
    const {children, ...restProps} = props;
    const bodyComponent = function () {
        if (props.type === ActionBoxTypes.DIALOG_CONFIRM || props.type === ActionBoxTypes.DIALOG) {
            return <Dialog
                {...restProps}
            >
                {children}
            </Dialog>
        }
        return <Loading/>
    };
    return ReactDOM.createPortal(
        bodyComponent(),
        el);
}

ActionBox.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    title: PropTypes.string,
    type: PropTypes.oneOf(Object.values(ActionBoxTypes)),
    opt: PropTypes.object.isRequired,
};

ActionBox.defaultProps = {
    id: genId(),
    type: ActionBoxTypes.LOADING,
    opt: {}
};


export function ActionBoxProvider(props) {
    const {children} = props;
    const actionObj = useActionBox();
    const {actionConfig, close} = actionObj;

    return (
        <ActionBoxContext.Provider value={actionObj}>
            {
                actionConfig.map((actionBoxItem) => {
                    return <ActionBox
                        key={actionBoxItem.id}
                        id={actionBoxItem.id}
                        type={actionBoxItem.type}
                        title={actionBoxItem.title}
                        {...actionBoxItem.opt}
                        closeFn={() => {
                            actionBoxItem.opt.closeFn?.();//close cancel
                            return close(actionBoxItem.id)
                        }}
                    >
                        {actionBoxItem.bodyComponent}
                    </ActionBox>
                })
            }
            {children}
        </ActionBoxContext.Provider>
    );
}
