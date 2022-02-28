import React from "react";
import PropTypes from "prop-types";
import {Button} from "primereact/button";

export default function ErrorPage(props) {
    let msg;
    if (props.msg) {
        msg = props.msg;
    } else if (props.statusCode) {
        msg = `An error ${props.statusCode} occurred on server`;
    } else {
        msg = 'An error occurred on client';
    }

    return (
        <div>
            <div>
                {msg}
            </div>
            <Button
                type="button"
                className="p-button-text"
                label="GO BACK TO DASHBOARD"
                onClick={() => window.location = '/'}
            />
        </div>
    )
}

ErrorPage.propTypes = {
    statusCode: PropTypes.number,
    msg: PropTypes.string
}
