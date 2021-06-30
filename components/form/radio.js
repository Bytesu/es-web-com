import React from 'react';
import classnames from 'classnames';
import style from "./radio.module.scss";
import PropTypes from 'prop-types';

Radio.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    sty: PropTypes.object,
};
Radio.defaultProps = {
    checked: false,
    object: {},
    onChange: () => {
    },
};

export function Radio(props) {
    return (
        <div className={classnames(style.radio, 'flex flex-center')} onClick={() => {
            props.onChange();
        }}
             style={props.sty}
        >
            <div className={classnames(style.radioLabel, props.checked ? style.checked : '')}></div>
        </div>
    );
}


