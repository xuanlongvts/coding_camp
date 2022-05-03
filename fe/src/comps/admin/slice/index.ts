import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_ACCOUNT } from '_types/root_state_type';
import { createSlice, useInjectReducer, useInjectSaga } from '_redux';

import * as TYPES_KEYS from './types';
import saga from './saga';

export const initialState: TYPES_KEYS.T_SIGN_UP = {
    [TYPES_KEYS.KEY_ERR_MESS]: null,
    [TYPES_KEYS.KEY_DATA_USER]: null,
    [TYPES_KEYS.KEY_ROUTER_LIST]: null,
    [TYPES_KEYS.KEY_JWT_PROFILE]: null,
    [TYPES_KEYS.KEY_INFOR_USER_SUBMIT]: null,
    [TYPES_KEYS.KEY_LOGOUT_SUBMIT]: false,
};
const { [TYPES_KEYS.KEY_ERR_MESS]: initErrMess, [TYPES_KEYS.KEY_DATA_USER]: initDataUser } = initialState;

const slice = createSlice({
    name: NSP_ACCOUNT,
    initialState,
    reducers: {
        loginCall(state, action: PayloadAction<TYPES_KEYS.T_PAYLOAD_INFOR_USER_SUBMIT>) {
            state[TYPES_KEYS.KEY_INFOR_USER_SUBMIT] = action.payload;
            state[TYPES_KEYS.KEY_LOGOUT_SUBMIT] = false;
        },
        loginSuccess(state, action: PayloadAction<TYPES_KEYS.T_DATA_USER>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = initErrMess;
            state[TYPES_KEYS.KEY_DATA_USER] = action.payload;
        },
        loginFailed(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = action.payload;
            state[TYPES_KEYS.KEY_DATA_USER] = initDataUser;
        },
        logoutCall(state) {
            state[TYPES_KEYS.KEY_LOGOUT_SUBMIT] = true;
        },
        logoutSuccess(state) {
            state[TYPES_KEYS.KEY_ERR_MESS] = initErrMess;
            state[TYPES_KEYS.KEY_DATA_USER] = initDataUser;
        },
        logoutFailed(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = action.payload;
        },
        getAccountRouter(state, action: PayloadAction<TYPES_KEYS.T_ROUTER_LIST>) {
            const { routerList } = action.payload;
            state[TYPES_KEYS.KEY_ROUTER_LIST] = routerList;
        },
        setJwtProfile(state, action: PayloadAction<TYPES_KEYS.T_JWT_PROFILE>) {
            const { jwtProfile } = action.payload;
            state[TYPES_KEYS.KEY_JWT_PROFILE] = jwtProfile;
        },
        resetError(state) {
            state[TYPES_KEYS.KEY_ERR_MESS] = initErrMess;
        },
    },
});

export const { actions: accountLoginActions, reducer } = slice;

export default () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga });
    return { actions: slice.actions };
};
