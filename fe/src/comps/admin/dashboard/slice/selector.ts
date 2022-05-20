import { createSelector } from '@reduxjs/toolkit';

import { NSP_PRODUCTS, RootState } from '_types/root_state_type';

import { initialState } from '.';
import {
    KEY_ERR_MESS,
    KEY_DATA_PRODUCT,
    KEY_PRODUCT_INIT,
    T_DATA_PRODUCT,
    KEY_TX_LISTS,
    KEY_PRODUCT_ADD_UPDATE_ONE,
    KEY_PRODUCT_DELETE_ONE,
    KEY_PRODUCT_ADD_ONE_SUCCESS,
} from './types';

const selectProduct = (state: RootState) => state[NSP_PRODUCTS] || initialState;

export const selectProductInit = createSelector([selectProduct], (i: T_DATA_PRODUCT) => i[KEY_PRODUCT_INIT]);
export const selectProducts = createSelector([selectProduct], (i: T_DATA_PRODUCT) => i[KEY_DATA_PRODUCT]);
export const selectError = createSelector([selectProduct], (i: T_DATA_PRODUCT) => i[KEY_ERR_MESS]);
export const selectTx = createSelector([selectProduct], (i: T_DATA_PRODUCT) => i[KEY_TX_LISTS]);

export const selectProductAddOrUpdate = createSelector([selectProduct], (i: T_DATA_PRODUCT) => i[KEY_PRODUCT_ADD_UPDATE_ONE]);
export const selectProductDelete = createSelector([selectProduct], (i: T_DATA_PRODUCT) => i[KEY_PRODUCT_DELETE_ONE]);
export const selectProductAddSuccess = createSelector([selectProduct], (i: T_DATA_PRODUCT) => i[KEY_PRODUCT_ADD_ONE_SUCCESS]);
