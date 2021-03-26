import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

import {
    REGISTR_SUCCESS,
    REGISTR_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS
} from './types';

//Load User
export const loadUSer = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth/');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}

//Register User
export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, email, password});

    try {
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTR_SUCCESS,
            payload: res.data
        });

        dispatch(loadUSer());
    } catch(err) {
        const errors = err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: REGISTR_FAIL
        });
    }
}

//Login User
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email, password});

    try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUSer());
    } catch(err) {
        const errors = err.response.data.errors;

        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: LOGIN_FAIL
        });
    }
}