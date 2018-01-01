import AWS from 'aws-sdk';
import awsmobile from '../aws-exports';

import {CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js'

const userPool = new CognitoUserPool({
    UserPoolId: awsmobile.aws_user_pools_id,
    ClientId: awsmobile.aws_user_pools_web_client_id,
});

function handleNewCustomerRegistration(username, password, email, phoneNumber, registerCallBack) {
    const dataEmail = {
        Name: 'email',
        Value: email
    };
    const dataPhone = {
        Name: 'phone_number',
        Value: phoneNumber
    };
    const userAttributes = [];
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributePhone = new CognitoUserAttribute(dataPhone);


    if (dataEmail.Value) {
        userAttributes.push(attributeEmail);
    }
    if (dataPhone.Value) {
        userAttributes.push(attributePhone);
    }

    userPool.signUp(username, password, userAttributes, null, registerCallBack);
}

function handleSignIn(username, password, loginCallBack) {
    const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
    });
    let cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, loginCallBack);
}

function handleForgotPassword(username, forgotPasswordCallBack) {
    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
    });
    cognitoUser.forgotPassword(forgotPasswordCallBack);
}

function handleForgotPasswordReset(username, verificationCode, newPassword, forgotPasswordCallBack) {
    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
    });
    cognitoUser.confirmPassword(verificationCode, newPassword, forgotPasswordCallBack);
}

function handleSignOut() {
    const cognitoUser = getCurrentUser();

    if (cognitoUser) {
        cognitoUser.signOut();
        window.localStorage.removeItem('currSession');
        window.localStorage.removeItem('awsCredentials');
        window.localStorage.setItem('isLoggedIn', false);
    }
}

function handleUnregisterCustomer(unregisterCallBack) {
    const cognitoUser = getCurrentUser();
    cognitoUser.getSession((e, s) => console.log(e || 'session acquired = session.isValid()'));

    cognitoUser.deleteUser(unregisterCallBack);

    window.localStorage.removeItem('currSession');
    window.localStorage.removeItem('awsCredentials');
    window.localStorage.setItem('isLoggedIn', false);
}

function getCurrentUser() {
    const userPool = new CognitoUserPool({
        UserPoolId: awsmobile.aws_user_pools_id,
        ClientId: awsmobile.aws_user_pools_web_client_id
    });

    return userPool.getCurrentUser();
}

function isSignedIn() {
    return window.localStorage.getItem('isLoggedIn') === 'true';
}

const getCredentials = async function getCredentials(session) {
    window.localStorage.setItem('currSession', JSON.stringify(session));
    await setCredentials(getCognitoCredentials(session));

    window.localStorage.setItem('isLoggedIn', true);
};

const getCognitoCredentials = function getCognitoCredentials(session) {
    const loginCred = `cognito-idp.${awsmobile.aws_project_region}.amazonaws.com/${awsmobile.aws_user_pools_id}`;

    const cognitoParams = {
        IdentityPoolId: awsmobile.aws_cognito_identity_pool_id,
        Logins: {
            [loginCred]: session.getIdToken().getJwtToken(),
        },
    };

    return new AWS.CognitoIdentityCredentials(cognitoParams);
};

const setCredentials = function setCredentials(credentials) {
    return new Promise((resolve, reject) => {
        AWS.config.update({region: awsmobile.aws_project_region});
        AWS.config.credentials = credentials;

        AWS.config.credentials.refresh((error) => {
            if (error) {
                reject(error);
                return;
            }

            const {accessKeyId, secretAccessKey, sessionToken} = AWS.config.credentials;
            const awsCredentials = {
                accessKeyId,
                secretAccessKey,
                sessionToken,
            };
            window.localStorage.setItem('awsCredentials', JSON.stringify(awsCredentials));

            resolve(awsCredentials);
        });
    });
};

function check(error) {
    const err = error.toString();
    if (/InvalidParameterException: Missing required parameter USERNAME$/.test(err)
        || (/UserNotFoundException?/.test(err))
        || (/NotAuthorizedException?/.test(err))) {
        return {
            invalidCredentialsMessage: 'Please enter valid email and password.',
        }
    } else if (/CodeMismatchException: Invalid code or auth state for the user.$/.test(err)) {
        return {
            invalidCredentialsMessage: 'Invalid Verification Code',
        }
    } else if (/InvalidParameterException: Missing required parameter SMS_MFA_CODE$/.test(err)) {
        return {
            invalidCredentialsMessage: 'Verficiation code can not be empty',
        }
    } else if (/PasswordResetRequiredException: Password reset required for the user$/.test(err)) {
        return {
            invalidCredentialsMessage: 'Password reset required for the user',
        }
    }else if (/UserNotConfirmedException: User is not confirmed.$/.test(err)) {
        return {
            invalidCredentialsMessage: 'User is not confirmed',
        }
    }

    console.warn(error);
    return {
        invalidCredentialsMessage: 'There was a problem',
    };
}

export {
    check, getCredentials, handleForgotPassword, handleForgotPasswordReset, handleNewCustomerRegistration, handleSignIn,
    handleSignOut, handleUnregisterCustomer, isSignedIn
}