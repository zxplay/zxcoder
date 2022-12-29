import React from "react";
import {useSelector} from "react-redux";

export default function RequireSubscriber({children}) {
    const received = useSelector(state => state?.subscriber.subscribeFunctionReceived);

    if (received) {
        return <>{children}</>
    }

    return <></>
}
