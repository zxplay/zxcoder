import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import ReactMarkdown from "react-markdown";
import {Card} from "primereact/card";
import {requestTermsOfUse} from "../redux/actions/app";

export default function InfoLegacyTerms() {
    const dispatch = useDispatch();

    const text = useSelector(state => state?.app.termsOfUse);

    useEffect(() => {
        if (!text) {
            dispatch(requestTermsOfUse());
        }
    }, []);

    return (
        <Card className="m-2">
            <ReactMarkdown>
                {text}
            </ReactMarkdown>
        </Card>
    )
}
