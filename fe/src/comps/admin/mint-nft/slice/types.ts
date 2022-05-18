export const KEY_ERR_MESS = 'errMess';
export const KEY_DATA_PREPARE = 'dataPrepare';
export const KEY_DATA_MINTED = 'dataMinted';

export type T_DATA_PREPARE = {
    idPubkey: string;
    name: string;
    symbol: string;
    metadataUrl: string;
    wallet?: any;
    connection?: any;
};

export interface T_DATA_MINT {
    [KEY_ERR_MESS]: string | null;
    [KEY_DATA_PREPARE]: T_DATA_PREPARE | null;
    [KEY_DATA_MINTED]: string | null;
}

export type T_RESULT_MINT_NFT = {
    errMess?: any;
    tx?: string;
};
