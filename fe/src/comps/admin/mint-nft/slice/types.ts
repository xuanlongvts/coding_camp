export const KEY_ERR_MESS = 'errMess';
export const KEY_DATA_PREPARE = 'dataPrepare';
export const KEY_DATA_MINTED = 'dataMinted';

export type T_DATA_PREPARE = {
    name: string;
    symbol: string;
    metadataUrl: string;
};

export interface T_DATA_MINT {
    [KEY_ERR_MESS]: string | null;
    [KEY_DATA_PREPARE]: T_DATA_PREPARE | null;
    [KEY_DATA_MINTED]: string | null;
}
