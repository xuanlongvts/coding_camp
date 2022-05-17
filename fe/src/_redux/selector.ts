import { createSelector } from '@reduxjs/toolkit';

import { NSP_COMMON, RootState } from '_types/root_state_type';

import { initialState } from './slice';
import { T_COMMON } from './types';

const selectComm = (state: RootState) => state[NSP_COMMON] || initialState;

export const selectCommState = createSelector([selectComm], (i: T_COMMON) => i.common);
