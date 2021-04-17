import React from 'react';

export function FormSelect(props) {
    return (
        <select
            {...props}
        >
            {props.children}
        </select>
    );
}

