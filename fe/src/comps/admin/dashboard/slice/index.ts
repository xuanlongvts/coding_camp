import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_PRODUCTS } from '_types/root_state_type';
import { Obj } from '_types/index';
import { createSlice, useInjectReducer, useInjectSaga } from '_redux';
import { T_PRODUCT } from 'comps/01-home/products/type';

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
        productsCall() {
            // console.log('productsCall');
        },
        productsCallSuccess(state, action: PayloadAction<T_PRODUCT[]>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = initErrMess;
            state[TYPES_KEYS.KEY_DATA_PRODUCT] = action.payload;
        },
        productsCallFailed(state, action: PayloadAction<Obj>) {
            const { message } = action.payload;
            state[TYPES_KEYS.KEY_ERR_MESS] = message;
        },
    },
});

export const { actions: productsActions, reducer } = slice;

export default () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga });
    return { actions: slice.actions };
};
