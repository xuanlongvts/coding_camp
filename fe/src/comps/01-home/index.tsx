import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Slice from 'comps/admin/dashboard/slice';
import { selectProducts } from 'comps/admin/dashboard/slice/selector';

import Product from 'comps/01-home/products';
import Welcome from './welcom';
import { T_PRODUCT } from './products/type';

const HomeComp = () => {
    const { actions } = Slice();
    const products: T_PRODUCT[] = useSelector(selectProducts);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.productsCall());
    }, []);

    return <>{products?.length ? <Product products={products} /> : <Welcome />}</>;
};

export default HomeComp;
