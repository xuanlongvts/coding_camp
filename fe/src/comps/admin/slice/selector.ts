import { createSelector } from '@reduxjs/toolkit';

import { NSP_ACCOUNT, RootState } from '_types/root_state_type';

import { initialState } from '.';
import { KEY_ROUTER_LIST, T_SIGN_UP, KEY_DATA_USER, KEY_ERR_MESS, KEY_INFOR_USER_SUBMIT } from './types';

const selectAccount = (state: RootState) => state[NSP_ACCOUNT] || initialState;

export const selectInforUserSubmit = createSelector([selectAccount], (i: T_SIGN_UP) => i[KEY_INFOR_USER_SUBMIT]);
export const selectDataUser = createSelector([selectAccount], (i: T_SIGN_UP) => i[KEY_DATA_USER]);
export const selectError = createSelector([selectAccount], (i: T_SIGN_UP) => i[KEY_ERR_MESS]);
