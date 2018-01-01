export default function reducer(state = {
    user: {email: '', password: '', passwordAgain: '', phoneNumber: '', passwordMatched: false, isLoggedIn: false,
        hasSentForgottenPassword: false, passwordReset: false},
    fetching: false,
    fetched: false,
    error: null,
    timestamp: null
}, action) {
    switch (action.type) {
        case 'UPDATE_EMAIL_FIELD': {
            return {...state, user: {...state.user, email: action.payload, passwordMatched: false}, error: null}
        }
        case 'EMAIL_NOT_VALID': {
            return {
                ...state, user: {...state.user, email: action.payload, passwordMatched: false}, error: 'Email is not valid'
            }
        }
        case 'EMAIL_VALID': {
            return {...state, timestamp: new Date(), user: {...state.user, passwordMatched: false}, error: null}
        }
        case 'SET_PASSWORD': {
            return {...state, user: {...state.user, password: action.payload, passwordMatched: false}, error: null}
        }
        case 'SET_PASSWORD_AGAIN': {
            return {...state, user: {...state.user, passwordAgain: action.payload, passwordMatched: false}, error: null}
        }
        case 'SET_CODE': {
            return {...state, user: {...state.user, resetCode: action.payload}, error: null}
        }
        case 'PASSWORD_NOT_VALID': {
            return {...state, user: {...state.user, password: action.payload, passwordMatched: false}}
        }
        case 'PASSWORD_NOT_MATCHED': {
            return {...state, user: {...state.user, passwordAgain: action.payload, passwordMatched: false}}
        }
        case 'PASSWORD_MATCHED': {
            return {...state, user: {...state.user, passwordMatched: true}}
        }
        case 'REGISTER_FAILED': {
            return {...state, error: action.payload, user: {...state.user, passwordMatched: false},}
        }
        case 'LOGIN_SUCCEEDED': {
            return {...state, user: {...state.user, password: '', passwordAgain: '', isLoggedIn: true, busy: false},
                error: null}
        }
        case 'LOGIN_IN_PROGRESS': {
            return {...state, user: {...state.user, busy: true}, error: null}
        }
        case 'LOGGED_OUT': {
            return {...state, user: {email: '', password: '', passwordAgain: '', phoneNumber: '', passwordMatched: false,
                isLoggedIn: false, hasSentForgottenPassword: false, passwordReset: false}, error: null}
        }
        case 'LOGIN_FAILED': {
            return {...state, user: {...state.user, busy: false}, error: action.payload}
        }
        case 'FORGOT_PASSWORD_SENT': {
            return {...state, user: {...state.user, hasSentForgottenPassword: true}, error: null}
        }
        case 'FORGOT_PASSWORD_SENT_FAILED': {
            return {...state, error: action.payload}
        }
        case 'PASSWORD_RESET': {
            return {...state, user: {...state.user, passwordReset: true}, error: null}
        }
        case 'PASSWORD_RESET_FAILED': {
            return {...state,  user: {...state.user, passwordReset: false}, error: action.payload}
        }
        case 'LOGGED_IN': {
            return {...state, user: {...state.user, isLoggedIn: true}, error: null}
        }
        case 'UNREGISTER_SUCCEEDED': {
            return {...state, user: {mail: '', password: '', passwordAgain: '', phoneNumber: '', unregistered: true,
                isLoggedIn: false, hasSentForgottenPassword: false, passwordReset: false}, error: null}
        }
        case 'UNREGISTER_FAILED': {
            return {...state, user: {mail: '', password: '', passwordAgain: '', phoneNumber: '', passwordMatched: false,
                isLoggedIn: false, hasSentForgottenPassword: false, passwordReset: false}, error: null}
        }
        default:
            return {
                ...state,
                user: {
                    ...state.user,
                    email: '',
                    password: '',
                    passwordAgain: '',
                    passwordMatched: false,
                    isLoggedIn: false,
                    hasSentForgottenPassword: false,
                    resetCode: null,
                    passwordReset: false
                },
                error: null
            }
    }
}