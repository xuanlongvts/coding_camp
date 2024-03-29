import { ThemeState } from 'themes/const';

export const NSP_COMMON = 'NSP_COMMON';
import { T_COMMON } from '_redux/types';

export const NSP_LOADING_APP = 'NSP_LOADING_APP';
import { T_APP_LOADING } from '_commComp/loadingApp/types';

export const NSP_THEME_MODE_MODE_THEME = 'NSP_THEME_MODE_MODE_THEME';
import { T_DARK_MODE } from 'themes/darkMode/slice/types';

export const NSP_PRODUCTS = 'NSP_PRODUCTS';
import { T_DATA_PRODUCT } from 'comps/admin/dashboard/slice/types';

export const NSP_MINT_NFT = 'NSP_MINT_NFT';
import { T_DATA_MINT } from 'comps/admin/mint-nft/slice/types';

export const NSP_TOAST = 'NSP_TOAST';
import { I_APP_TOAST } from '_commComp/toast/types';

export interface RootState {
    theme: ThemeState;
    [NSP_COMMON]: T_COMMON;
    [NSP_LOADING_APP]: T_APP_LOADING;
    [NSP_THEME_MODE_MODE_THEME]?: T_DARK_MODE;
    [NSP_PRODUCTS]?: T_DATA_PRODUCT;
    [NSP_MINT_NFT]?: T_DATA_MINT;
    [NSP_TOAST]?: I_APP_TOAST;
}
