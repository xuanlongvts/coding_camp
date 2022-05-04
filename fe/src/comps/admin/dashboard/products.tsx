import { useEffect, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { T_PRODUCT } from 'comps/01-home/products/type';
import { productsInit, addOneProductDataArr, updateOneProductData, deleteOneProductData } from '_config/tmp_data';

import Slice from './slice';
import { selectError, selectProducts } from './slice/selector';

interface State extends SnackbarOrigin {
    open: boolean;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductsManagment = () => {
    const { actions } = Slice();
    const dispatch = useDispatch();
    const errMess = useSelector(selectError);
    const products = useSelector(selectProducts);

    const { publicKey } = useWallet();

    const [state, setState] = useState<State>({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });

    useEffect(() => {
        dispatch(actions.productsCall());
    }, []);

    const initProduct = (newState: SnackbarOrigin) => async () => {
        if (!publicKey) {
            setState({ open: true, ...newState });
            return;
        }
        dispatch(actions.productsInitCall(productsInit));
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const { vertical, horizontal, open } = state;

    return (
        <>
            {errMess ? (
                <Box>
                    <AddIcon
                        sx={{ cursor: 'pointer' }}
                        onClick={initProduct({
                            vertical: 'bottom',
                            horizontal: 'right',
                        })}
                    />
                </Box>
            ) : null}

            <Paper sx={{ p: 2 }}>
                product
                <br />
            </Paper>

            <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} onClose={handleClose} key={vertical + horizontal}>
                <Alert severity="warning">Connect Wallet First!</Alert>
            </Snackbar>
        </>
    );
};

export default ProductsManagment;
