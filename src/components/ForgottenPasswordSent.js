import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import Layout from '../components/Layout';
import '../App.css';
import * as user from '../actions/userActions';

export class LogIn extends Component {
    handleChangeEmail = (event) => {
        let email = event.target.value.trim();
        this.props.actions.updateEmailField(email);
    };

    handleChangeResetCode = (event) => {
        let resetCode = event.target.value.trim();
        this.props.actions.setResetCode(resetCode);
    };

    handleChangePassword = (event) => {
        let password = event.target.value.trim();
        this.props.actions.setPassword(password);
        this.props.actions.validatePassword(password, this.props.user.passwordAgain);
    };

    handleChangePasswordAgain = (event) => {
        let passwordAgain = event.target.value.trim();
        this.props.actions.setPasswordAgain(passwordAgain);
        this.props.actions.validatePassword(this.props.user.password, passwordAgain);
    };

    handleResetPassword = (e) => {
        e.preventDefault();
        if (this.props.user.passwordMatched) {
            this.props.actions.forgotPasswordReset(this.props.user);
        }
    };

    render() {
        return (
            <Layout user={this.props.user} actions={this.props.actions} history={this.props.history}>
                <br/>
                <br/>
                {this.props.user.passwordReset ?
                    <div>
                        <h1>Password Reset Successfully!</h1>
                        <Link to="/log-in">Log In</Link>
                    </div> :
                    <form onSubmit={(e) => this.handleResetPassword(e)}>
                        <h1>Sent! Check Your Email</h1>
                        <br/>
                        <div>{this.props.error ? this.props.error : ''}</div>
                        <div>
                            <label>Email</label>
                            <input type="email" value={this.props.user.email}
                                   onChange={(event) => this.handleChangeEmail(event)}/>
                            <br/>
                            <br/>
                        </div>
                        <div>
                            <label>Reset code</label>
                            <input type="number" onChange={(event) => this.handleChangeResetCode(event)}/>
                            <br/>
                            <br/>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" value={this.props.user.password}
                                   onChange={(event) => this.handleChangePassword(event)}/>
                            <br/>
                            <br/>
                        </div>
                        <div>
                            <label htmlFor="passwordAgain">Password Again</label>
                            <input type="password" value={this.props.user.passwordAgain}
                                   onChange={(event) => this.handleChangePasswordAgain(event)}/>
                            <br/>
                            <br/>
                        </div>
                        <div>
                            <input type="submit" name="forgotpasswordsent" className="forgotpasswordsent"
                                   value="Reset password"
                                   disabled={!this.props.user.passwordMatched || !this.props.user.resetCode}/>
                        </div>
                    </form>}
                <aside></aside>
            </Layout>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)

function mapStateToProps(state, ownProps) {
    return {
        user: state.user.user,
        error: state.user.error,
        timestamp: state.user.timestamp
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(user, dispatch)
    };
}
