import {applyMiddleware, createStore} from 'redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducer from '../reducers';
import Auth from '../aws-cognito/index';

let middleware = [promise(), thunk];

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    middleware = middleware.concat(logger);
} else {
    // production code
}

let store = createStore(reducer, applyMiddleware(...middleware));

const isSignedIn = Auth.isSignedIn();
if (isSignedIn) {
    store.dispatch({type: 'LOGIN_SUCCEEDED'});
}

export default store;