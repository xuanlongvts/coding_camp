import { useEffect, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { T_PRODUCT } from 'comps/01-home/products/type';
import { productsInit, addOneProductDataArr, updateOneProductData, deleteOneProductData } from '_config/tmp_data';
import { transactionExplorer } from '_config';

import SliceToast from '_commComp/toast/slice';

import Slice from './slice';
import { selectError, selectProducts, selectTx } from './slice/selector';

const ProductsManagment = () => {
    const { actions } = Slice();
    const { actions: actionsToast } = SliceToast();
    const dispatch = useDispatch();
    const errMess = useSelector(selectError);
    const products = useSelector(selectProducts);

    const txInit = useSelector(selectTx)?.txInit;

    const { publicKey } = useWallet();

    useEffect(() => {
        if (txInit) {
            const hrefLink = transactionExplorer(txInit);
            dispatch(
                actionsToast.toastOpen({
                    mess: 'Initial product success!',
                    linkRef: {
                        mess: 'Transaction Link',
                        link: hrefLink,
                        target: '_blank',
                    },
                }),
            );
        }
    }, [txInit]);

    useEffect(() => {
        dispatch(actions.productsCall());
    }, []);

    const initProduct = () => {
        if (!publicKey) {
            dispatch(
                actionsToast.toastOpen({
                    mess: 'Connect wallet first and change network to DevNet!',
                }),
            );
            return;
        }
        dispatch(actions.productsInitCall(productsInit));
    };

    return (
        <>
            {!products.length ? (
                <Box>
                    <AddIcon sx={{ cursor: 'pointer' }} onClick={initProduct} />
                </Box>
            ) : (
                <Paper sx={{ p: 2 }}>
                    product
                    <br />
                </Paper>
            )}
        </>
    );
};

export default ProductsManagment;
