import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_PRODUCTS } from '_types/root_state_type';
import { createSlice, useInjectReducer, useInjectSaga } from '_redux';
import { T_PRODUCT } from '_commComp/products/type';

import * as TYPES_KEYS from './types';
import saga from './saga';

export const initialState: TYPES_KEYS.T_DATA_PRODUCT = {
    [TYPES_KEYS.KEY_ERR_MESS]: null,
    [TYPES_KEYS.KEY_PRODUCT_INIT]: null,
    [TYPES_KEYS.KEY_DATA_PRODUCT]: [],
};
const { [TYPES_KEYS.KEY_ERR_MESS]: initErrMess, [TYPES_KEYS.KEY_DATA_PRODUCT]: initDataProducts } = initialState;

const slice = createSlice({
    name: NSP_PRODUCTS,
    initialState,
    reducers: {
        productsInitCall(state, action: PayloadAction<T_PRODUCT[]>) {
            state[TYPES_KEYS.KEY_PRODUCT_INIT] = action.payload;
        },
        productsInitCallSuccess(state, action: PayloadAction<T_PRODUCT[]>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = initErrMess;
            state[TYPES_KEYS.KEY_DATA_PRODUCT] = action.payload;
        },
        productsInitCallFailed(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = action.payload;
        },
    },
});

export const { actions: productsActions, reducer } = slice;

export default () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga });
    return { actions: slice.actions };
};
