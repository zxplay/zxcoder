import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import ReactMarkdown from "react-markdown";
import {Card} from "primereact/card";
import {requestPrivacyPolicy} from "../redux/app/actions";

export default function LegalPrivacy() {
    const dispatch = useDispatch();

    const text = useSelector(state => state?.app.privacyPolicy);

    useEffect(() => {
        if (!text) {
            dispatch(requestPrivacyPolicy());
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
