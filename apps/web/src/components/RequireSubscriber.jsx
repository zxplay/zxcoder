import React from "react";
import {useSelector} from "react-redux";

function RequireSubscriber({children}) {
    const received = useSelector(state => state?.subscriber.subscribeFunctionReceived);

    if (received) {
        return <>{children}</>
    }

    return <></>
}

export default RequireSubscriber;
