import {
    REGISTR_SUCCESS,
    REGISTR_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    DELETE_ACCOUNT
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function auth(state = initialState, action){
    const {type, payload} = action;
    switch(type){

        case USER_LOADED:
            return{
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            };
        case LOGIN_SUCCESS:
        case REGISTR_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            };
        case DELETE_ACCOUNT:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case REGISTR_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                toke: null,
                isAuthenticated: false,
                loading: false
            };

        default:
            return state;
    }
}