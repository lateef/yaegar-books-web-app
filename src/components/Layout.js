import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';

export default class Layout extends Component {
    handleLogout = () => {
        this.props.actions.logout();
    };

    render() {
        return (
            <div className="container">
                <header>
                    <h1 className="app-title">Yaegar Books</h1>
                    <br/>
                    <h2 className="app-intro">
                        Accounting software for businesses
                    </h2>
                </header>
                <nav>
                    <ul>
                        <li className="nav-link"><Link to="/">Home</Link></li>
                        {this.props.user.isLoggedIn ? '' :
                            <li className="nav-link"><Link to="/sign-up">Sign Up</Link></li>}
                        {this.props.user.isLoggedIn ? '' : <li className="nav-link"><Link to="/log-in">Log In</Link></li>}
                        {this.props.user.isLoggedIn ?
                            <li className="nav-link" onClick={() => {
                                this.handleLogout()
                            }}><Link to="">Log Out</Link></li> : ''}
                            </ul>
                </nav>
                {this.props.children}
                <footer>Yaegar Limited</footer>
            </div>

        )
    }
}