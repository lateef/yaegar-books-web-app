import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Layout from '../components/Layout';
import '../App.css';
import * as user from '../actions/userActions';

export class SignUpComplete extends Component {
    constructor(props) {
        super(props);
        this.props.actions.init();
    }

    handleChangeEmail = (event) => {
        let email = event.target.value.trim();
        this.props.actions.updateEmailField(email);
    };

    handleChangePassword = (event) => {
        let password = event.target.value.trim();
        this.props.actions.setPassword(password);
        this.props.actions.validatePassword(password, this.props.user.passwordAgain);
    };

    handleChangePasswordAgain = (event) => {
        let passwordAgain = event.target.value.trim();
        this.props.actions.setPasswordAgain(passwordAgain);
        this.props.actions.confirmPassword(this.props.user.password, passwordAgain);
    };

    async handlePress(e) {
        e.preventDefault();

        this.props.actions.validateEmail(this.props.user.email);
        if (this.props.user.passwordMatched) {
            await this.props.actions.signUp(this.props.user);
            if (!this.props.error) {
                this.props.history.push("/sign-up-complete")
            }
        }
    };

    render() {
        return (
            <Layout user={this.props.user} actions={this.props.actions}>
                <br/>
                <br/>
                <form onSubmit={(e) => this.handlePress(e)}>
                    <div>{this.props.error ? this.props.error : ''}</div>
                    <div>
                        <label>Email</label>
                        <input type="email" value={this.props.user.email}
                               onChange={(event) => this.handleChangeEmail(event)}/>
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
                        <input type="submit" name="signup" className="signup" value="Sign Up"
                               disabled={!this.props.user.passwordMatched}/>
                    </div>
                </form>
                <aside></aside>
            </Layout>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpComplete)

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
