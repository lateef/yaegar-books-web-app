import awsmobile from '../aws-exports';

import {CognitoUserPool, CognitoUserAttribute} from 'amazon-cognito-identity-js'

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



export {
    handleNewCustomerRegistration
}