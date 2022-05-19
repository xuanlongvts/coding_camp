import { useState } from 'react';

import BasicMasonry from './masory';
import ListNormal from './list';

import { unitPay as unitPayConst } from './const';
import DialogBox from './dialog';
import { T_PRODUCT } from './type';

const ListProduct = ({ products }: { products: T_PRODUCT[] }) => {
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

    return (
        <>
            {/* {products?.length ? <BasicMasonry products={products} handleQuickBuy={handleQuickBuy} /> : null} */}

            {products?.length ? <ListNormal products={products} handleQuickBuy={handleQuickBuy} /> : null}

            {idProductBuy ? (
                <DialogBox open={open} products={products} unit={unitPay} idProductBuy={idProductBuy} handleClose={handleClose} />
            ) : null}
        </>
    );
};

export default ListProduct;
