import { createSelector } from '@reduxjs/toolkit';

import { NSP_MINT_NFT, RootState } from '_types/root_state_type';

import { initialState } from '.';
import { KEY_ERR_MESS, KEY_DATA_MINTED, KEY_DATA_PREPARE, KEY_MINT_NFT_SUCCESS, T_DATA_MINT } from './types';

const selectMint = (state: RootState) => state[NSP_MINT_NFT] || initialState;

export const selectMintPrepare = createSelector([selectMint], (i: T_DATA_MINT) => i[KEY_DATA_PREPARE]);
export const selectDataMinted = createSelector([selectMint], (i: T_DATA_MINT) => i[KEY_DATA_MINTED]);
export const selectError = createSelector([selectMint], (i: T_DATA_MINT) => i[KEY_ERR_MESS]);

export const selectMintNftSuccess = createSelector([selectMint], (i: T_DATA_MINT) => i[KEY_MINT_NFT_SUCCESS]);
