import { useEffect, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
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

import { T_PRODUCT } from 'comps/01-home/products/type';
import { productsInit, addOneProductDataArr, updateOneProductData, deleteOneProductData } from '_config/tmp_data';

import SliceToast from '_commComp/toast/slice';

import Slice from './slice';
import { selectError, selectProducts, selectTx } from './slice/selector';

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const ProductsManagment = () => {
    const { actions } = Slice();
    const { actions: actionsToast } = SliceToast();
    const dispatch = useDispatch();
    const errMess = useSelector(selectError);
    const products = useSelector(selectProducts);

    const { publicKey } = useWallet();

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

    const handleEdit = (id: string) => () => {};

    const handleDelete = (id: string) => () => {};

    return (
        <>
            {!products?.length ? (
                <Box>
                    <AddIcon sx={{ cursor: 'pointer' }} onClick={initProduct} />
                </Box>
            ) : (
                <>
                    <Box>
                        <AddIcon sx={{ cursor: 'pointer', marginBottom: 2 }} />

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
                                                <ModeEditIcon onClick={handleEdit(item.id)} sx={{ cursor: 'pointer' }} />
                                                <DeleteForeverIcon
                                                    onClick={handleDelete(item.id)}
                                                    sx={{ marginLeft: 2, cursor: 'pointer' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )}
        </>
    );
};

export default ProductsManagment;
