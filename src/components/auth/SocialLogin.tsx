import React from 'react';
import { FacebookLogin, FacebookLoginAuthResponse } from 'react-facebook-login-lite';
import { facebookLogin, googleLogin } from '../../redux/actions/authAction';
import { useDispatch } from 'react-redux';

function SocialLogin() {
    const dispatch = useDispatch();

    // google

    // facebook
    const onFbSuccess = (response: FacebookLoginAuthResponse) => {
        const { accessToken, userID } = response.authResponse;
        dispatch(facebookLogin(accessToken, userID));
    };

    return (
        <>
            <div></div>
            <div>
                <FacebookLogin appId="7076645655778551" onSuccess={onFbSuccess} />
            </div>
        </>
    );
}

export default SocialLogin;
