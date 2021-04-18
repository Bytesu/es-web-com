import React from 'react';
import PropTypes from 'prop-types';
import {ActionBoxTypes} from "../../InfoActionContext";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import DialogComponent from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

Dialog.propTypes = {};
const stylesCustom = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(stylesCustom)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

export function Dialog(props) {
    console.log({props})
    return (
        <DialogComponent
            aria-labelledby="customized-dialog-title"
            open={true}
        >

            <DialogTitle
                onClose={() => {
                    props.closeFn?.();
                }}
                id="form-dialog-title">{props.title || '标题'}</DialogTitle>
            <DialogContent dividers>
                {props.children}
            </DialogContent>
            <DialogActions>
                {props.type === ActionBoxTypes.DIALOG_CONFIRM ? <Button onClick={() => {
                    props.closeFn?.();
                }} color="primary" autoFocus>
                    取消
                </Button> : null}
                <Button onClick={() => {
                    props.okFn?.();
                }} color="primary" autoFocus>
                    确定
                </Button>
            </DialogActions>
        </DialogComponent>
    );
}

const DIALOG_TYPES = {
    DIALOG: 'DIALOG',
    DIALOG_CONFIRM: 'DIALOG_CONFIRM',
};
Dialog.propTypes = {
    title: PropTypes.string,
    type: PropTypes.oneOf(Object.values(DIALOG_TYPES)),
    closeFn: PropTypes.func, //close ,cancel,
    okFn: PropTypes.func,// ok,confirm
};

