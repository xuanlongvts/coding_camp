import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice, useInjectReducer } from '_redux';
import { NSP_TOAST } from '_types/root_state_type';

import { I_APP_TOAST, FIELDS } from './types';

export const initialState: I_APP_TOAST = {
    [FIELDS.open]: false,
    [FIELDS.typeAlert]: 'warning',
    [FIELDS.mess]: '',
    [FIELDS.newPosition]: {
        vertical: 'bottom',
        horizontal: 'right',
    },
};

const slice = createSlice({
    name: NSP_TOAST,
    initialState,
    reducers: {
        toastOpen(state, action: PayloadAction<I_APP_TOAST>) {
            const { [FIELDS.typeAlert]: newTypeAlert, [FIELDS.mess]: newMess, [FIELDS.newPosition]: newPosition } = action.payload;
            state[FIELDS.open] = true;
            state[FIELDS.mess] = newMess;
            newTypeAlert && (state[FIELDS.typeAlert] = newTypeAlert);
            newPosition && (state[FIELDS.newPosition] = newPosition);
        },
        toastClose(state) {
            state[FIELDS.open] = false;
        },
    },
});

export const { actions: appToastActions, reducer } = slice;

const useAppToastSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    return { actions: slice.actions };
};

export default useAppToastSlice;
