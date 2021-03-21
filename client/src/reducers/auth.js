import {
    REGISTR_SUCCESS,
    REGISTR_FAIL
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function(state = initialState, action){
    const {type, payload} = action;

    switch(type){

        case REGISTR_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            };
        case REGISTR_FAIL:
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