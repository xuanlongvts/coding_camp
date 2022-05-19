import { useState } from 'react';

import BasicMasonry from './masory';
import ListNormal from './list';

import { unitPay as unitPayConst } from './const';
import DialogBox from './dialog';
import { T_PRODUCT } from './type';
import { T_Viewmode } from '../index';

type T_ListProduct = {
    products: T_PRODUCT[];
    viewMode: T_Viewmode;
};

const ListProduct = ({ products, viewMode }: T_ListProduct) => {
    const [unitPay, setUnitPay] = useState<string>(unitPayConst.sol);
    const [idProductBuy, setIdProductBuy] = useState<string>();
    const [open, setOpen] = useState(false);

    const handleQuickBuy = (unit: string, id: string) => {
        if (unit !== unitPay) {
            setUnitPay(unit);
        }

        setIdProductBuy(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const ListProductsView =
        viewMode === 'Grid' ? (
            <ListNormal products={products} handleQuickBuy={handleQuickBuy} />
        ) : (
            <BasicMasonry products={products} handleQuickBuy={handleQuickBuy} />
        );

    return (
        <>
            {products?.length ? ListProductsView : null}

            {idProductBuy ? (
                <DialogBox open={open} products={products} unit={unitPay} idProductBuy={idProductBuy} handleClose={handleClose} />
            ) : null}
        </>
    );
};

export default ListProduct;
