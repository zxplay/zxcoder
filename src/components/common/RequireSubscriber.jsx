import React, {Fragment} from "react";
import {useSelector} from "react-redux";

function RequireSubscriber({children}) {
    const received = useSelector(state => state?.subscriber.subscribeFunctionReceived);

    if (received) {
        return <Fragment>{children}</Fragment>
    }

    return <Fragment/>
}

export default RequireSubscriber;
