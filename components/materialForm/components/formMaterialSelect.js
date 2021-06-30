import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

export function FormMaterialSelect(props) {
    const classes = useStyles();

    const [val, setVal] = React.useState(props.value);
    React.useEffect(() => {
        if (props.value !== val) {
            setVal(props.value)
        }
    }, [props.value])

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={val}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    setVal(event.target.value);
                    props.onChange(event.target.value)
                }}
            >
                {
                    props.options.map(opt => {
                        return <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>;
                    })
                }
            </Select>
        </FormControl>
    );
}


FormMaterialSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.array.isRequired,
};
FormMaterialSelect.defaultProps = {
    label: 'label',
    onChange() {
    },
    options: [],
}
