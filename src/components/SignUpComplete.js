import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Layout from './Layout';
import '../App.css';
import * as user from '../actions/userActions';

export class SignUpComplete extends Component {

    render() {
        return (
            <Layout user={this.props.user} actions={this.props.actions} history={this.props.history}>
                <main>
                    <h1>Sign Up Email Sent</h1>
                    <br/>
                    <br/>
                    <p>
                        A sign up confirmation has been sent to you email,
                        Please click the link in the email to complete your registration.
                    </p>
                    <br/>
                    <p>Click the button below to login after your registration has been confirmed</p>
                    <p/>
                    <p/>
                </main>
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
