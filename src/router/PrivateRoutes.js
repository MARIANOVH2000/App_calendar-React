import React from 'react'
import { Redirect, Route } from 'react-router'
import PropTypes from 'prop-types';

export const PrivateRoutes = ({
    isLoggedIn,
    component:Component,
    ...rest
}) => {
    //localStorage.setItem('lastPath',rest.location.pathname);
    return (
       <Route {...rest}
       component={(props)=>(
           (isLoggedIn)
            ?<Component {...props}/>
            :<Redirect to="/login" />
       )}
       
       
       />
    )
}
PrivateRoutes.propTypes={
    isLoggedIn:PropTypes.bool.isRequired,
    component:PropTypes.func.isRequired
}
