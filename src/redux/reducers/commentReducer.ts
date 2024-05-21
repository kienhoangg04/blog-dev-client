import {
    ICommentState,
    CREATE_COMMENT,
    GET_COMMENTS,
    ICommentType,
    REPLY_COMMENT,
    UPDATE_COMMENT,
    UPDATE_COMMENT_REPLY,
    DELETE_COMMENT,
    DELETE_COMMENT_REPLY,
} from '../types/commentType';

const initialState = {
    data: [],
    total: 1,
};

const commentReducer = (state: ICommentState = initialState, action: ICommentType): ICommentState => {
    switch (action.type) {
        case CREATE_COMMENT:
            return {
                ...state,
                data: [action.payload, ...state.data],
            };
        case GET_COMMENTS:
            return action.payload;

        case REPLY_COMMENT:
            return {
                ...state,
                data: state.data.map((item) =>
                    item._id === action.payload.comment_root
                        ? {
                              ...item,
                              replyCM: [action.payload, ...item.replyCM],
                          }
                        : item,
                ),
            };
        case UPDATE_COMMENT:
            return {
                ...state,
                data: state.data.map((item) => (item._id === action.payload._id ? action.payload : item)),
            };
        case UPDATE_COMMENT_REPLY:
            return {
                ...state,
                data: state.data.map((item) =>
                    item._id === action.payload.comment_root
                        ? {
                              ...item,
                              replyCM: item.replyCM?.map((rep) =>
                                  rep._id === action.payload._id ? action.payload : rep,
                              ),
                          }
                        : item,
                ),
            };
        case DELETE_COMMENT:
            return {
                ...state,
                data: state.data.filter((item) => item._id !== action.payload._id),
            };
        case DELETE_COMMENT_REPLY:
            return {
                ...state,
                data: state.data.map((item) =>
                    item._id === action.payload.comment_root
                        ? {
                              ...item,
                              replyCM: item.replyCM?.filter((rep) => rep._id !== action.payload._id),
                          }
                        : item,
                ),
            };
        default:
            return state;
    }
};

export default commentReducer;
