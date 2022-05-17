import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_COMMON } from '_types/root_state_type';
import { createSlice, useInjectReducer } from '_redux';

import { T_COMMON } from './types';

export const initialState: T_COMMON = {
    common: {
        wallet: null,
        connection: null,
    },
};

const slice = createSlice({
    name: NSP_COMMON,
    initialState,
    reducers: {
        commonInitCall(state, action: PayloadAction<T_COMMON>) {
            state.common = action.payload.common;
        },
    },
});

export const { actions: commonActions, reducer } = slice;

export default () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    return { actions: slice.actions };
};
