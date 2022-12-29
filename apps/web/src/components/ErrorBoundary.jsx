import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {hideLoading} from "../dashboard_loading";
import {error} from "../redux/actions/error";
import Error from "./Error";

class ErrorBoundary extends React.Component {

    state = {hasError: false};

    static getDerivedStateFromError(_) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
        this.props.onError('Render error', 'There was a problem in rendering this content.');
    }

    render() {
        if (this.state.hasError) {
            hideLoading();
            return <Error msg="There was a problem in rendering this content."/>
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    onError: PropTypes.func.isRequired,
    children: PropTypes.any
}

const mapReduxStateToProps = (/*state*/) => ({
    // Not used
});

const mapReduxDispatchToProps = (dispatch) => ({
    onError: (title, description) => dispatch(error(title, description)),
});

export default connect(
    mapReduxStateToProps,
    mapReduxDispatchToProps
)(ErrorBoundary);
