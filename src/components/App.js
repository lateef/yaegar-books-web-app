import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {bindActionCreators} from 'redux';
import Layout from '../components/Layout';
import '../App.css';
import * as userActions from '../actions/userActions';

export class App extends Component {
    render() {
        return (
            <Layout user={this.props.user} actions={this.props.actions} history={this.props.history}>
                <main>
                    <h1>Welcome</h1>
                </main>
                <aside>
                </aside>
            </Layout>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

function mapStateToProps(state, ownProps) {
    return {
        user: state.user.user,
        error: state.user.error,
        timestamp: state.user.timestamp
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch)
    };
}
