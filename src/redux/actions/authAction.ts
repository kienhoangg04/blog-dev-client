import { Dispatch } from 'redux';
import { AUTH, IAuthType } from '../types/authType';
import { ALERT, IAlertType } from '../types/alertTypes';
import { IUserLogin, IUserRegister } from '../../utils/TypeScript';
import { postAPI, getAPI } from '../../utils/fetchData';
import { validRegister } from '../../utils/Valid';
import { validatePhone } from '../../utils/Valid';
import { checkTokenExp } from '../../utils/checkTokenExp';

export const login = (userLogin: IUserLogin) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI('login', userLogin);
        dispatch({
            type: AUTH,
            payload: res.data,
        });
        dispatch({ type: ALERT, payload: { success: res.data.msg } });
        localStorage.setItem('logged', 'blog-kh');
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};

export const register = (userRegister: IUserRegister) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const check = validRegister(userRegister);
    if (check.errLength > 0) {
        dispatch({ type: ALERT, payload: { errors: check.errMsg } });
        return;
    }
    try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI(`register`, userRegister);
        dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};

export const refreshToken = () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const logged = localStorage.getItem('logged');
    if (logged !== 'blog-kh') return;
    try {
        dispatch({ type: ALERT, payload: { loading: true } });

        const res = await getAPI('refresh_token');
        dispatch({ type: AUTH, payload: res.data });

        dispatch({ type: ALERT, payload: {} });
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        localStorage.removeItem('logged');
    }
};

export const logout = (token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
        localStorage.removeItem('logged');
        dispatch({ type: AUTH, payload: {} });
        await getAPI('logout', access_token);
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};

export const googleLogin = (id_token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } });

        const res = await postAPI('google_login', { id_token });
        dispatch({ type: AUTH, payload: res.data });

        dispatch({ type: ALERT, payload: { success: res.data.msg } });
        localStorage.setItem('logged', 'blog-kh');
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};

export const facebookLogin =
    (accessToken: string, userID: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
        try {
            dispatch({ type: ALERT, payload: { loading: true } });

            const res = await postAPI('facebook_login', { accessToken, userID });
            dispatch({ type: AUTH, payload: res.data });
            dispatch({ type: ALERT, payload: { success: res.data.msg } });
            localStorage.setItem('logged', 'blog-kh');
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        }
    };

export const loginSMS = (phone: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const check = validatePhone(phone);
    if (!check) return dispatch({ type: ALERT, payload: { errors: 'Phone number format is incorrect.' } });
    try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI('login_sms', { phone });
        if (!res.data.valid) {
            verifySMS(phone, dispatch);
        }
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};

const verifySMS = async (phone: string, dispatch: Dispatch<IAuthType | IAlertType>) => {
    const code = prompt('Enter your code');
    if (!code) return;

    try {
        dispatch({ type: ALERT, payload: { loading: true } });

        const res = await postAPI('sms_verify', { phone, code });
        dispatch({ type: AUTH, payload: res.data });
        dispatch({ type: ALERT, payload: { success: res.data.msg } });
        localStorage.setItem('logged', 'blog-kh');
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        setTimeout(() => {
            verifySMS(phone, dispatch);
        }, 300);
    }
};

export const forgotPassword = (account: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI('forgot_password', { account });
        dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};
