import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import App from './components/App';
import SignUpComplete from './components/SignUpComplete';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
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
            </div>
        </Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
