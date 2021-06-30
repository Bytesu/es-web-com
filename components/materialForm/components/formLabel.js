import React from 'react';
import PropTypes from 'prop-types';

export function FormLabel(props) {
    return (
        <div className="form-group has-feedback show-att-user">
            {props.noLabel?null: <label>{props.label}</label>}
            <div>
                {props.children}
            </div>
        </div>
    );
}

FormLabel.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    children: PropTypes.element,
    noLabel: PropTypes.bool
};


FormLabel.defaultProps = {
    name: 'default label',
    noLabel: false,
    children: <div>please provided the required input</div>,
};

