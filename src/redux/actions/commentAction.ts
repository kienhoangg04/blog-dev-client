import { Dispatch } from 'redux';
import { ALERT, IAlertType } from '../types/alertTypes';

import {
    ICreateCommentType,
    GET_COMMENTS,
    IGetCommentsType,
    IReplyCommentType,
    IUpdateCommentType,
    IDeleteCommentType,
} from '../types/commentType';

import { IComment } from '../../utils/TypeScript';
import { postAPI, getAPI, patchAPI, deleteAPI } from '../../utils/fetchData';
import { checkTokenExp } from '../../utils/checkTokenExp';

export const createComment =
    (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | ICreateCommentType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            await postAPI('comment', data, access_token);
            // dispatch({
            //     type: CREATE_COMMENT,
            //     payload: { ...res.data, user: data.user },
            // });
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        }
    };

export const getComments = (id: string, num: number) => async (dispatch: Dispatch<IAlertType | IGetCommentsType>) => {
    try {
        let limit = 4;
        const res = await getAPI(`comments/blog/${id}?page=${num}&limit=${limit}`);

        dispatch({
            type: GET_COMMENTS,
            payload: {
                data: res.data.comments,
                total: res.data.total,
            },
        });
    } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
};

export const replyComments =
    (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | IReplyCommentType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            await postAPI('reply_comment', data, access_token);

            // dispatch({
            //     type: REPLY_COMMENT,
            //     payload: { ...res.data, user: data.user, reply_user: data.reply_user },
            // });
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        }
    };

export const updateComment =
    (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | IUpdateCommentType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            // dispatch({
            //     type: data.comment_root ? UPDATE_COMMENT_REPLY : UPDATE_COMMENT,
            //     payload: data,
            // });

            const res = await patchAPI(`comment/${data._id}`, { data }, access_token);
            dispatch({ type: ALERT, payload: { success: res.data.msg } });
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        }
    };

export const deleteComment =
    (data: IComment, token: string) => async (dispatch: Dispatch<IAlertType | IDeleteCommentType>) => {
        const result = await checkTokenExp(token, dispatch);
        const access_token = result ? result : token;
        try {
            // dispatch({
            //     type: data.comment_root ? DELETE_COMMENT_REPLY : DELETE_COMMENT,
            //     payload: data,
            // });

            const res = await deleteAPI(`comment/${data._id}`, access_token);
            dispatch({ type: ALERT, payload: { success: res.data.msg } });
        } catch (error: any) {
            dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
        }
    };
