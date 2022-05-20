import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridOnIcon from '@mui/icons-material/GridOn';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import useMediaQuery from '@mui/material/useMediaQuery';

import Slice from 'comps/admin/dashboard/slice';
import { selectProducts } from 'comps/admin/dashboard/slice/selector';

import Product from 'comps/01-home/products';
import Welcome from './welcom';
import { T_PRODUCT } from './products/type';

export type T_Viewmode = 'Grid' | 'Masory';

const HomeComp = () => {
    const { actions } = Slice();
    const products: T_PRODUCT[] = useSelector(selectProducts);
    const [viewMode, setViewMode] = useState<T_Viewmode>('Grid');
    const matches = useMediaQuery('(max-width: 600px)');

    const dispatch = useDispatch();

    const handleViewMode = () => {
        setViewMode(viewMode === 'Grid' ? 'Masory' : 'Grid');
    };

    useEffect(() => {
        dispatch(actions.productsCall());
    }, []);

    return (
        <>
            {!matches && products?.length ? (
                <div style={{ position: 'fixed', right: 20, top: 80, cursor: 'pointer' }} onClick={handleViewMode}>
                    {viewMode === 'Grid' ? (
                        <GridOnIcon sx={{ width: 24, height: 24 }} />
                    ) : (
                        <ViewKanbanIcon sx={{ width: 24, height: 24 }} />
                    )}
                </div>
            ) : null}

            {products?.length ? <Product products={products} viewMode={viewMode} /> : <Welcome />}
        </>
    );
};

export default HomeComp;
