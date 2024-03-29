import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_PRODUCTS } from '_types/root_state_type';
import { Obj } from '_types/index';
import { createSlice, useInjectReducer, useInjectSaga } from '_redux';
import { T_PRODUCT } from 'comps/01-home/products/type';
import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

import * as TYPES_KEYS from './types';
import saga from './saga';

const getTxInit = LocalStorageServices.getItem(LocalStorageKey().tx_lists.initProduct);

let getTxAddOneProduct = LocalStorageServices.getItem(LocalStorageKey().tx_lists.addOneProduct);
getTxAddOneProduct = getTxAddOneProduct ? [getTxAddOneProduct] : [];

let getTxUpdateOneProduct = LocalStorageServices.getItem(LocalStorageKey().tx_lists!.updateOneProduct);
getTxUpdateOneProduct = getTxUpdateOneProduct ? [getTxUpdateOneProduct] : [];

let getTxDeleteOneProduct = LocalStorageServices.getItem(LocalStorageKey().tx_lists!.deleteOneProduct);
getTxDeleteOneProduct = getTxDeleteOneProduct ? [getTxDeleteOneProduct] : [];

export const initialState: TYPES_KEYS.T_DATA_PRODUCT = {
    [TYPES_KEYS.KEY_ERR_MESS]: null,
    [TYPES_KEYS.KEY_PRODUCT_INIT]: null,
    [TYPES_KEYS.KEY_DATA_PRODUCT]: [],
    [TYPES_KEYS.KEY_PRODUCT_ADD_UPDATE_ONE]: null,
    [TYPES_KEYS.KEY_PRODUCT_ADD_ONE_SUCCESS]: false,
    [TYPES_KEYS.KEY_PRODUCT_DELETE_ONE]: null,
    [TYPES_KEYS.KEY_TX_LISTS]: {
        txInit: getTxInit,
        txAddOneProduct: getTxAddOneProduct,
        txUpdateOneProduct: getTxUpdateOneProduct,
        txDeleteOneProduct: getTxDeleteOneProduct,
    },
};
const { [TYPES_KEYS.KEY_ERR_MESS]: initErrMess } = initialState;

const slice = createSlice({
    name: NSP_PRODUCTS,
    initialState,
    reducers: {
        productsInitCall(state, action: PayloadAction<T_PRODUCT[]>) {
            state[TYPES_KEYS.KEY_PRODUCT_INIT] = action.payload;
        },
        productsInitCallSuccess(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_TX_LISTS]!.txInit = action.payload;
        },
        productsAddOneProductCallSuccess(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_TX_LISTS]!.txAddOneProduct.push(action.payload);
        },
        productsUpdateOneProductCallSuccess(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_TX_LISTS]!.txUpdateOneProduct.push(action.payload);
        },
        productsDeleteOneProductCallSuccess(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_TX_LISTS]!.txDeleteOneProduct.push(action.payload);
        },
        productsCall() {
            // console.log('productsCall');
        },
        productAddOneCall(state, action: PayloadAction<T_PRODUCT>) {
            state[TYPES_KEYS.KEY_PRODUCT_ADD_ONE_SUCCESS] = false;
            state[TYPES_KEYS.KEY_PRODUCT_ADD_UPDATE_ONE] = action.payload;
        },
        productAddOneCallSuccess(state) {
            state[TYPES_KEYS.KEY_PRODUCT_ADD_ONE_SUCCESS] = true;
        },
        productUpdateOneCall(state, action: PayloadAction<T_PRODUCT>) {
            state[TYPES_KEYS.KEY_PRODUCT_ADD_UPDATE_ONE] = action.payload;
        },
        productDeleteOneCall(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_PRODUCT_DELETE_ONE] = action.payload;
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
