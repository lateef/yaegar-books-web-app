import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import {App} from './App';
import * as userActions from './actions/userActions';
import {bindActionCreators} from 'redux';

const mockStore = configureStore([promise(), thunk, logger]);
const store = mockStore();

const defaultProps = {
    user: {email: '', password: '', passwordAgain: '', phoneNumber: '', passwordMatched: false},
    fetching: false,
    fetched: false,
    error: null,
    timestamp: null,
    actions: bindActionCreators(userActions, store.dispatch)
};

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><App {...defaultProps}/></Provider>, div);
});
