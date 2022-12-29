import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {Card} from "primereact/card";
import {Titled} from "react-titled";
import {sep} from "../constants";

export default function YourProfile() {
    const {id} = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(loadProfile(id));
        // return () => {}
    }, [id]);

    return (
        <Titled title={(s) => `Your Profile ${sep} ${s}`}>
            <Card className="m-2">
                <h1>Your Profile</h1>
            </Card>
        </Titled>
    )
}
