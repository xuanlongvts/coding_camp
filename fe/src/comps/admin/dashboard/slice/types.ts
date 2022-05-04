import { T_PRODUCT } from 'comps/01-home/products/type';

export const KEY_ERR_MESS = 'errMess';
export const KEY_DATA_PRODUCT = 'dataProduct';
export const KEY_PRODUCT_INIT = 'productInit';
export const KEY_PRODUCT_GET_ALL = 'productsAll';

export interface T_DATA_PRODUCT {
    [KEY_ERR_MESS]: string | null;
    [KEY_PRODUCT_INIT]: T_PRODUCT[] | null;
    [KEY_DATA_PRODUCT]: T_PRODUCT[] | [];
}
