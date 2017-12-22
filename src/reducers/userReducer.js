export default function reducer(state = {
    user: {email: '1', password: '', passwordAgain: '', phoneNumber: '', passwordMatched: false},
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
            return {...state, user: {...state.user, email: action.payload, passwordMatched: false}, error: 'Email is not valid'}
        }
        case 'FETCH_USER_PENDING': {
            return {...state}
        }
        case 'FETCH_USER_FULFILLED': {
            return {...state, timestamp: new Date(), passwordMatched: false}
        }
        case 'FETCH_USER_REJECTED': {
            return {...state}
        }
        case 'SET_PASSWORD': {
            return {...state, user: {...state.user, password: action.payload, passwordMatched: false}}
        }
        case 'SET_PASSWORD_AGAIN': {
            return {...state, user: {...state.user, passwordAgain: action.payload, passwordMatched: false}}
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
            return {...state, error: action.payload, passwordMatched: false}
        }
        default:
            return {...state, user: {...state.user, email: '', password: '', passwordAgain: '', passwordMatched: false}, error: null}
    }
}