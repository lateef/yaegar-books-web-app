import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import {App} from './components/App';
import * as userActions from './actions/userActions';
import {bindActionCreators} from 'redux';

const mockStore = configureStore([promise(), thunk, logger]);
const store = mockStore();

const defaultProps = {
    user: {
        email: '', password: '', passwordAgain: '', phoneNumber: '', isLoggedIn: false, passwordMatched: false
    },
    fetching: false,
    fetched: false,
    error: null,
    timestamp: null,
    actions: bindActionCreators(userActions, store.dispatch)
};

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}>
        <Router><App {...defaultProps}/></Router>
    </Provider>, div);
});
