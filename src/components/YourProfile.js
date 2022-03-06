import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {Card} from "primereact/card";

export default function YourProfile(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(loadProject(props.id));
        // return () => {}
    }, [props.id]);

    return (
        <Card className="m-2">
            <h1>Your Profile</h1>
        </Card>
    )
}

YourProfile.propTypes = {
    id: PropTypes.string.isRequired,
}
