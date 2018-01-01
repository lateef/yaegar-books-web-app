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
            dispatch({type: 'EMAIL_VALID', payload: email})
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
                confirmPassword(password1, password2, dispatch);
            }
        } else {
            dispatch({type: 'PASSWORD_NOT_VALID', payload: password1});
        }
    }
}

function confirmPassword(password1, password2, dispatch) {
    if (!passesPasswordTest(password2)) {
        return;
    }
    if (!validator.equals(password1, password2)) {
        dispatch({type: 'PASSWORD_NOT_MATCHED', payload: password2});
    } else {
        dispatch({type: 'PASSWORD_MATCHED', payload: password1});
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

export function logIn(user) {
    return async function (dispatch) {
        try {
            await new Promise((resolve, reject) => {
                Auth.handleSignIn(user.email, user.password, {
                    onSuccess: async (result) => {
                        dispatch({type: 'LOGIN_IN_PROGRESS'});
                        await Auth.getCredentials(result);
                        dispatch({type: 'LOGIN_SUCCEEDED', payload: result});
                        resolve();
                    },
                    onFailure: (error) => {
                        let displayError = Auth.check(error);
                        reject(displayError);
                    }
                });
            });
        } catch (e) {
            dispatch({type: 'LOGIN_FAILED', payload: e.invalidCredentialsMessage});
        }
    }
}

export function logout() {
    return async function (dispatch) {
        Auth.handleSignOut();
        dispatch({type: 'LOGGED_OUT'});
    }
}

export function forgotPassword(user) {
    return async function (dispatch) {
        try {
            await new Promise((resolve, reject) => {
                Auth.handleForgotPassword(user.email, {
                    onSuccess: (result) => {
                        dispatch({type: 'FORGOT_PASSWORD_SENT', payload: result});
                        resolve();
                    },
                    onFailure: (error) => {
                        let displayError = Auth.check(error);
                        reject(displayError);
                    }
                });
            });
        } catch (e) {
            dispatch({type: 'FORGOT_PASSWORD_SENT_FAILED', payload: 'Please enter a valid email'});
        }
    }
}

export function forgotPasswordReset(user) {
    return async function (dispatch) {
        try {
            await new Promise((resolve, reject) => {
                Auth.handleForgotPasswordReset(user.email, user.resetCode, user.password, {
                    onSuccess: (result) => {
                        dispatch({type: 'PASSWORD_RESET', payload: result});
                        resolve();
                    },
                    onFailure: (error) => {
                        let displayError = Auth.check(error);
                        reject(displayError);
                    }
                });
            });
        } catch (e) {
            dispatch({
                type: 'PASSWORD_RESET_FAILED',
                payload: 'Please check your email/verification code and try again'
            });
        }
    }
}

export function setResetCode(resetCode) {
    return function (dispatch) {
        dispatch({type: 'SET_CODE', payload: resetCode});
    }
}

export function unregister() {
    return async function (dispatch) {
        try {
            await new Promise((resolve, reject) => {
                Auth.handleUnregisterCustomer((err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    dispatch({type: 'UNREGISTER_SUCCEEDED', payload: result});
                    resolve();
                });
            });
        } catch (e) {
            dispatch({type: 'UNREGISTER_FAILED'});
        }
    }
}

function passesPasswordTest(password) {
    return validator.matches(password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/);
}