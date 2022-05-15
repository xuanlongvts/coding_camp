import * as Yup from 'yup';

import { NftNameField, NftDesField } from '_validate';

export enum ENUM_FIELDS {
    name = 'name',
    des = 'des',
}

export interface T_HOOKS_FOMR_NFT_SEND {
    [ENUM_FIELDS.name]: string;
    [ENUM_FIELDS.des]: string;
}

const SendNftSchema = Yup.object().shape({
    [ENUM_FIELDS.name]: NftNameField,
    [ENUM_FIELDS.des]: NftDesField,
});

export default SendNftSchema;
