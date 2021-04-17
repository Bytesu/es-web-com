import React from 'react';
import {LoadingIcon} from '../../../loading'

Loading.propTypes = {};

export function Loading(props) {
    return (
        <div className='flex flex-center'>
            <LoadingIcon></LoadingIcon>
        </div>
    );
}

export default Loading;