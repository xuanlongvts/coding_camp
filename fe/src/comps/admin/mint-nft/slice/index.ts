import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_MINT_NFT } from '_types/root_state_type';
import { createSlice, useInjectReducer, useInjectSaga } from '_redux';
import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

import * as TYPES_KEYS from './types';
import saga from './saga';

export const initialState: TYPES_KEYS.T_DATA_MINT = {
    [TYPES_KEYS.KEY_ERR_MESS]: null,
    [TYPES_KEYS.KEY_DATA_PREPARE]: null,
    [TYPES_KEYS.KEY_DATA_MINTED]: null,
};
const { [TYPES_KEYS.KEY_ERR_MESS]: initErrMess } = initialState;

const slice = createSlice({
    name: NSP_MINT_NFT,
    initialState,
    reducers: {
        mintNftCall(state, action: PayloadAction<TYPES_KEYS.T_DATA_PREPARE>) {
            state[TYPES_KEYS.KEY_DATA_PREPARE] = action.payload;
        },
        mintNftCallSuccess(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = initErrMess;
            state[TYPES_KEYS.KEY_DATA_MINTED] = action.payload;
        },
        mintNftCallFailed(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = action.payload;
        },
    },
});

export const { actions: mintActions, reducer } = slice;

export default () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga });
    return { actions: slice.actions };
};
