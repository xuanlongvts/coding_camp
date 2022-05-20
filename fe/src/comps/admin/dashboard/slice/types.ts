import { T_PRODUCT } from 'comps/01-home/products/type';

export const KEY_ERR_MESS = 'errMess';
export const KEY_DATA_PRODUCT = 'dataProduct';
export const KEY_PRODUCT_INIT = 'productInit';
export const KEY_PRODUCT_GET_ALL = 'productsAll';

export const KEY_PRODUCT_ADD_UPDATE_ONE = 'productAddUpdateOne';
export const KEY_PRODUCT_ADD_ONE_SUCCESS = 'productAddOneSuccess';
export const KEY_PRODUCT_DELETE_ONE = 'productDeleteOne';

export const KEY_TX_LISTS = 'txLists';

export interface T_DATA_PRODUCT {
    [KEY_ERR_MESS]: string | null;
    [KEY_PRODUCT_INIT]: T_PRODUCT[] | null;
    [KEY_DATA_PRODUCT]: T_PRODUCT[] | [];
    [KEY_PRODUCT_ADD_UPDATE_ONE]: T_PRODUCT | null;
    [KEY_PRODUCT_DELETE_ONE]: string | null;
    [KEY_TX_LISTS]?: {
        txInit: string | null;
        txAddOneProduct: string[];
        txUpdateOneProduct: string[];
        txDeleteOneProduct: string[];
    };
    [KEY_PRODUCT_ADD_ONE_SUCCESS]: boolean;
}
