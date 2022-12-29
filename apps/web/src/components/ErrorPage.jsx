import React from "react";
import PropTypes from "prop-types";
import {Titled} from "react-titled";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {sep} from "../constants";

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
        <Titled title={(s) => `Error ${sep} ${s}`}>
            <Card className="m-2" style={{textAlign: 'center'}}>
                <div className="m-4">
                    {msg}
                </div>
                <Button
                    type="button"
                    className="p-button-text"
                    label="GO BACK TO DASHBOARD"
                    onClick={() => window.location = '/'}
                />
            </Card>
        </Titled>
    )
}

ErrorPage.propTypes = {
    statusCode: PropTypes.number,
    msg: PropTypes.string
}
