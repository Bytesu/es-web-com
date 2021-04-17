import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

export function CustomFormInput(props) {
    return <TextField
        {...props}
        fullWidth
        variant="filled"
        label={props.label}
        className=""
    ></TextField>
}

export function ButtonCustom(props) {
    return <Button disableElevation
                   variant="contained"
                   fullWidth
                   onClick={props.onClick}
                   color="primary"
    >{props.children}</Button>;
}


ButtonCustom.propTypes = {
    onClick: PropTypes.func
};
ButtonCustom.defaultProps = {
    onClick() {
    }
}

