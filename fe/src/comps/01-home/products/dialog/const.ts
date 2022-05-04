import { T_PRODUCT } from 'comps/01-home/products/type';

export interface I_ProductByt {
    idProductBuy: string;
    products: T_PRODUCT[];
    unit: string;
}

export interface I_DiglogBox extends I_ProductByt {
    open: boolean;
    handleClose: () => void;
}

export interface I_FrmGenegrate extends I_ProductByt {
    handleGenerateQrCode: () => void;
}
