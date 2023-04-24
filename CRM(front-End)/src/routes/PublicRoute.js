import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { utils } from 'c:/Users/Cogent/Desktop/Neew/web-app-react/src/_helpers';
const PublicRoute =  ({component: Component, restricted, ...rest}) => {
    const authorized =  utils.isLogin();
    console.log('PUBLIC_ROUTE',authorized)
    console.log('PUBLIC_ROUTE_RESTRICTED',restricted)
    return (
        <Route {...rest} render={props => (
            authorized && restricted ?
                <Redirect to="/dashboard" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;