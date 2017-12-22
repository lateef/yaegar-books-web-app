import validator from 'validator';

import Auth from '../aws-cognito/index';

export function init() {
    return function (dispatch) {
        dispatch({type: 'INIT'});
    }
}

export function updateEmailField(email) {
    return function (dispatch) {
        dispatch({type: 'UPDATE_EMAIL_FIELD', payload: email});
    }
}

export function validateEmail(email) {
    return function (dispatch) {
        if (!validator.isEmail(email)) {
            dispatch({type: 'EMAIL_NOT_VALID', payload: email});
        } else {
            dispatch({type: 'FETCH_USER_FULFILLED', payload: email})//FETCH_USER, payload: axios.get()})
        }
    }
}

export function setPassword(password) {
    return function (dispatch) {
        dispatch({type: 'SET_PASSWORD', payload: password});
    }
}

export function setPasswordAgain(password) {
    return function (dispatch) {
        dispatch({type: 'SET_PASSWORD_AGAIN', payload: password});
    }
}

export function validatePassword(password1, password2) {
    return function (dispatch) {

        if (passesPasswordTest(password1)) {
            dispatch({type: 'SET_PASSWORD', payload: password1});
            if (password2.length > 0) {
                confirmPassword(password1, password2);
            }
        } else {
            dispatch({type: 'PASSWORD_NOT_VALID', payload: password1});
        }
    }
}

export function confirmPassword(password1, password2) {
    return function (dispatch) {
        if (!passesPasswordTest(password2)) {
            return;
        }
        if (!validator.equals(password1, password2)) {
            dispatch({type: 'PASSWORD_NOT_MATCHED', payload: password2});
        } else {
            dispatch({type: 'PASSWORD_MATCHED', payload: password1});
        }
    }
}

export function signUp(user) {
    return async function (dispatch) {
        try {
            return await new Promise((resolve, reject) => {
                Auth.handleNewCustomerRegistration(user.email, user.password, user.email, user.phoneNumber, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    dispatch({type: 'REGISTER_SUCCEEDED', payload: result});
                    resolve();
                });
            });
        } catch (e) {
            dispatch({type: 'REGISTER_FAILED', payload: e.message});
            return new Error('REGISTER_FAILED');
        }
    }
}

function passesPasswordTest(password) {
    return validator.matches(password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/);
}