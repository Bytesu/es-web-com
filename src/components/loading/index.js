import React, {Component} from 'react';
import "./index.scss"

export const Loading = () => {
    return (
        <div>
            Loading
        </div>
    );
}

export function LoadingMash() {
    return <div className="loading-mask" style={{display: "block"}}>
        <div className="loading-indicator">
            <LoadingIcon size={"3x"}></LoadingIcon>
            <div className=" la-2x">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
}

/**
 * loading icon
 * @returns {*}
 * @constructor
 */
export function LoadingIcon(props) {
    return <div>Loading</div>;
}
