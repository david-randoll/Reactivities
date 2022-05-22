import React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { useStore } from "../stores/store";

interface Props extends RouteProps {
    component: React.ComponentType<any> | React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute = ({ component: Component, ...rest }: Props) => {
    const {
        userStore: { isLoggedIn },
    } = useStore();
    return <Route {...rest} render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to="/" />)} />;
};

export default PrivateRoute;
