import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';

import HistoryBack from '_commComp/backHistory';
import SliceProduct from 'comps/admin/dashboard/slice';
import { T_PRODUCT } from 'comps/01-home/products/type';
import { selectProducts } from 'comps/admin/dashboard/slice/selector';

import FrmProduct, { E_TYPES } from './frm';

const UpdateProduct = () => {
    const { actions } = SliceProduct();
    const dispatch = useDispatch();
    const router = useRouter();
    const products = useSelector(selectProducts);

    const [productUpdating, setProductUpdating] = useState<T_PRODUCT | null>(null);

    useEffect(() => {
        dispatch(actions.productsCall());
    }, []);

    useEffect(() => {
        const getIdProduct = router.query.id;
        const findProduct = products.filter(i => i.id === getIdProduct)[0];
        setProductUpdating(findProduct);
    }, [products]);

    return (
        <>
            <Box sx={{ width: '100%', marginBottom: 0 }}>
                <HistoryBack />
            </Box>
            {productUpdating ? <FrmProduct type={E_TYPES.Update} productUpdating={productUpdating} /> : null}
        </>
    );
};

export default UpdateProduct;
