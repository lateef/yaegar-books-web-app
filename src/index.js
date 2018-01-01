import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import App from './components/App';
import SignUpComplete from './components/SignUpComplete';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import ForgottenPassword from './components/ForgottenPassword';
import ForgottenPasswordSent from './components/ForgottenPasswordSent';
import registerServiceWorker from './registerServiceWorker';

import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Route exact path="/" component={App}/>
                <Route path="/sign-up-complete" component={SignUpComplete}/>
                <Route path="/sign-up" component={SignUp}/>
                <Route path="/log-in" component={LogIn}/>
                <Route path="/forgotten-password" component={ForgottenPassword}/>
                <Route path="/forgotten-password-sent" component={ForgottenPasswordSent}/>
            </div>
        </Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
