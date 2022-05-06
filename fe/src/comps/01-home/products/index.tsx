import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Slice from 'comps/admin/dashboard/slice';
import { selectError, selectProducts } from 'comps/admin/dashboard/slice/selector';

import BasicMasonry from './masory';
import { unitPay as unitPayConst } from './const';
import DialogBox from './dialog';

const ListProduct = () => {
    const { actions } = Slice();

    const dispatch = useDispatch();
    const errMess = useSelector(selectError);
    const products = useSelector(selectProducts);

    const [unitPay, setUnitPay] = useState<string>(unitPayConst.sol);
    const [idProductBuy, setIdProductBuy] = useState<string>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(actions.productsCall());
    }, []);

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
            {products?.length ? <BasicMasonry products={products} handleQuickBuy={handleQuickBuy} /> : null}

            {idProductBuy ? (
                <DialogBox open={open} products={products} unit={unitPay} idProductBuy={idProductBuy} handleClose={handleClose} />
            ) : null}
        </>
    );
};

export default ListProduct;
