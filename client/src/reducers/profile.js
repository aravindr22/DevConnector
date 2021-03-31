import {
    GET_PROFILE,
    PROFILE_ERROR
} from '../actions/types';

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
};

export default function(state = initialState, action){
    const {payload, type} = action;

    switch(type){
        default:
            return state;
    }
}