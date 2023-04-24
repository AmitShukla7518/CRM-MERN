import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'
import {utils} from '../../_helpers/utils'

export const PrivateComponent = () => {
    const isJwt = utils.getCookie('jwt_Token')
    const token = localStorage.getItem('jwt_Token')
    console.log(isJwt);
   let JWTFromLocal =  localStorage.getItem('jwt_Token')
    return token? <Outlet/>:<Navigate to="/login" />
}