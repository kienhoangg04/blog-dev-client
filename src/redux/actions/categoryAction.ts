import { Dispatch } from 'redux';
import { ALERT, IAlertType } from '../types/alertTypes';
import {
    CREATE_CATEGORY,
    GET_CATEGORIES,
    ICategoryType,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
} from '../types/categoryType';
import { postAPI, getAPI, patchAPI, deleteAPI } from '../../utils/fetchData';
import { ICategory } from '../../utils/TypeScript';

import { checkTokenExp } from '../../utils/checkTokenExp';

export const createCategory =
    (name: string, token: string) => async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            dispatch({ type: ALERT, payload: { loading: true } });

            const res = await postAPI('category', { name }, access_token);
            dispatch({
                type: CREATE_CATEGORY,
                payload: res.data.newCategory,
            });

            dispatch({ type: ALERT, payload: { loading: false } });
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        }
    };

export const getCategories = () => async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } });

        const res = await getAPI('category');
        dispatch({
            type: GET_CATEGORIES,
            payload: res.data.categories,
        });

        dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};

export const updateCategory =
    (data: ICategory, token: string) => async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            dispatch({
                type: UPDATE_CATEGORY,
                payload: data,
            });
            const res = await patchAPI(
                `category/${data._id}`,
                {
                    name: data.name,
                },
                access_token,
            );

            dispatch({ type: ALERT, payload: { success: res.data.msg } });
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        }
    };

export const deleteCategory = (id: string, token: string) => async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
        dispatch({
            type: DELETE_CATEGORY,
            payload: id,
        });
        const res = await deleteAPI(`category/${id}`, access_token);
        dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};
