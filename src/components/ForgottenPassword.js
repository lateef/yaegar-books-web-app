import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Layout from '../components/Layout';
import '../App.css';
import * as user from '../actions/userActions';

export class ForgottenPassword extends Component {
    constructor(props) {
        super(props);
        this.props.actions.init();
    }

    handleChangeEmail = (event) => {
        let email = event.target.value.trim();
        this.props.actions.updateEmailField(email);
    };

    async handlePress(e) {
        e.preventDefault();

        await this.props.actions.validateEmail(this.props.user.email);
        if (!this.props.error) {
            await this.props.actions.forgotPassword(this.props.user);
            if (this.props.user.hasSentForgottenPassword) {
                this.props.history.push("/forgotten-password-sent");
            }
        }
    };

    render() {
        return (
            <Layout user={this.props.user} actions={this.props.actions} history={this.props.history}>
                <br/>
                <br/>
                <form onSubmit={(e) => this.handlePress(e)}>
                    <h1>Forgotten Password</h1>
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
                        <input type="submit" name="login" className="login" value="Send"
                               disabled={!this.props.user.email}/>
                    </div>
                    <div>
                    </div>
                </form>
                <aside></aside>
            </Layout>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenPassword)

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
