import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { utils } from '../_helpers';


const PrivateRoute =  ({component: Component, ...rest}) => {
    const authorized = utils.isLogin();
    console.log('PRIVATE_ROUTE',authorized)
  return (
      // Show the component only when the user is logged in
      // Otherwise, redirect the user to /signin page
      <Route {...rest} render={props => (
        authorized ?
              <Component {...props} />
          : <Redirect to="/signin" />
      )} />
  );
};

export default PrivateRoute;