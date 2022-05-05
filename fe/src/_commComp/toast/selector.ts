import { createSelector } from '@reduxjs/toolkit';

import { NSP_TOAST, RootState } from '_types/root_state_type';

import { initialState } from './slice';
import { I_APP_TOAST } from './types';

const selectAppToast = (state: RootState) => state[NSP_TOAST] || initialState;

export const selectToast = createSelector(selectAppToast, (i: I_APP_TOAST) => i);
