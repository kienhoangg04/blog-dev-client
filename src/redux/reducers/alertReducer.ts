import { ALERT, IAlertType } from '../types/alertTypes';
import { IAlert } from '../../utils/TypeScript';

const alertReducer = (state: IAlert = {}, action: IAlertType): IAlert => {
    switch (action.type) {
        case ALERT:
            return action.payload;
        default:
            return state;
    }
};

export default alertReducer;
