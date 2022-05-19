import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { useWallet } from '@solana/wallet-adapter-react';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Fab from '@mui/material/Fab';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { T_PRODUCT } from 'comps/01-home/products/type';
import { productsInit } from '_config/tmp_data';
import { appToastActions } from '_commComp/toast/slice';
import LinkRouters from '_routers';
import { FIELDS } from '_commComp/toast/types';
import { AutoAirdrop } from '_utils/solana';

import Slice from './slice';
import { selectProducts } from './slice/selector';

const ProductsManagment = () => {
    const { actions } = Slice();
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const router = useRouter();
    const { publicKey } = useWallet();

    const [idProductDelete, setIdProductDelete] = useState<string | null>(null);

    useEffect(() => {
        dispatch(actions.productsCall());
    }, []);

    useEffect(() => {
        (async () => {
            if (publicKey) {
                const func = () =>
                    dispatch(
                        appToastActions.toastOpen({
                            [FIELDS.typeAlert]: 'success',
                            [FIELDS.mess]: 'Auto airdrop 2 SOL to your wallet. Success!',
                        }),
                    );
                await AutoAirdrop(publicKey, func);
            }
        })();
    }, [publicKey]);

    const initProduct = () => {
        if (!publicKey) {
            dispatch(
                appToastActions.toastOpen({
                    mess: 'Connect wallet first and change network to DevNet!',
                }),
            );
            return;
        }
        dispatch(actions.productsInitCall(productsInit));
    };

    const handleAdd = () => {
        router.push(LinkRouters.adminProductActions);
    };

    const handleEdit = (id: string) => () => {
        router.push(`${LinkRouters.adminProductActions}/${id}`);
    };

    const handleDelete = (id: string) => () => {
        if (!publicKey) {
            dispatch(
                appToastActions.toastOpen({
                    mess: 'Connect wallet first and change network to DevNet!',
                }),
            );
            return;
        }
        setIdProductDelete(id);
    };

    const handleClose = (isYes: boolean) => () => {
        isYes && idProductDelete && dispatch(actions.productDeleteOneCall(idProductDelete));
        setIdProductDelete(null);
    };

    return (
        <>
            {!products?.length ? (
                <Box>
                    <Fab size="medium" aria-label="add" onClick={initProduct}>
                        <AddIcon />
                    </Fab>
                </Box>
            ) : (
                <>
                    <Box>
                        <Fab size="medium" aria-label="add" sx={{ cursor: 'pointer', mb: 3 }} onClick={handleAdd}>
                            <AddIcon />
                        </Fab>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Number</TableCell>
                                        <TableCell align="left">Title</TableCell>
                                        <TableCell align="center">Price</TableCell>
                                        <TableCell align="left">Description</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((item: T_PRODUCT, k: number) => (
                                        <TableRow key={k} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                {++k}
                                            </TableCell>
                                            <TableCell align="left">{item.title}</TableCell>
                                            <TableCell align="center">{item.price}</TableCell>
                                            <TableCell align="left">{item.description}</TableCell>
                                            <TableCell align="right">
                                                <Fab size="small" aria-label="edit" onClick={handleEdit(item.id)}>
                                                    <ModeEditIcon />
                                                </Fab>
                                                <Fab size="small" aria-label="delete" sx={{ ml: 2 }} onClick={handleDelete(item.id)}>
                                                    <DeleteForeverIcon />
                                                </Fab>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )}

            <Dialog
                open={!idProductDelete ? false : true}
                onClose={handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <DialogContentText id="alert-dialog-description">&nbsp;</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose(true)}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProductsManagment;
