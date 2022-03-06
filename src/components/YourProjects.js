import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {Card} from "primereact/card";
import ProjectList from "./ProjectList";
import RequireSubscriber from "./RequireSubscriber";

export default function YourProjects(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(loadProfile(props.id));
        // return () => {}
    }, [props.id]);

    return (
        <Card className="m-2">
            <h1>Your Projects</h1>
            <RequireSubscriber>
                <ProjectList/>
            </RequireSubscriber>
        </Card>
    )
}

YourProjects.propTypes = {
    id: PropTypes.string.isRequired,
}
