import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { T_PRODUCT } from 'comps/01-home/products/type';
import { products, addOneProductDataArr, updateOneProductData, deleteOneProductData } from '_config/tmp_data';

import Slice from './slice';
import { selectError } from './slice/selector';

const ProductsManagment = () => {
    const { actions } = Slice();
    const dispatch = useDispatch();
    const errMess = useSelector(selectError);

    const { publicKey } = useWallet();
    const [products, setProducts] = useState<T_PRODUCT[]>([]);

    useEffect(() => {
        dispatch(actions.productsCall());
    }, []);

    return (
        <>
            {errMess ? (
                <Box>
                    <AddIcon />
                </Box>
            ) : null}

            <Paper sx={{ p: 2 }}>
                product
                <br />
            </Paper>
        </>
    );
};

export default ProductsManagment;
