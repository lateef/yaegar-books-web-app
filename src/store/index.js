import { applyMiddleware, createStore } from 'redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducer from '../reducers';

let middleware = [promise(), thunk];

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    middleware = middleware.concat(logger);
} else {
    // production code
}

export default createStore(reducer, applyMiddleware(...middleware));