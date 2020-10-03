import { ACTION_LOGIN, ACTION_LOGOUT } from '../actions/auth';

const initialState = {
    email: '',
    password: '',
    isLoggedIn: false,
    wasLoggedOut: false
}

export function reducer(state = initialState, action) {
    switch(action.type) {
        case ACTION_LOGIN:
            return {
                ...state,
                email: action.email,
                password: action.password,
                isLoggedIn: true,
                wasLoggedOut: false
            }    
        case ACTION_LOGOUT:
            return {
                ...state,
                email: '',
                password: '',
                isLoggedIn: false,
                wasLoggedOut: action.wasLoggedOut
            }
        default:
            return state;
    }
}