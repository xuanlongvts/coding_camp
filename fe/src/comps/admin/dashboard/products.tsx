import { useEffect } from 'react';
import type { NextPage } from 'next';

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';

import { getProgram, getProvider, getConfig } from '_config';
import idl from '_config/idl.json';
import { products, addOneProductDataArr, updateOneProductData, deleteOneProductData } from '_config/tmp_data';
import Header from '_commComp/header';

import kp from '_keys/keypair.json';

const programID = new PublicKey(idl.metadata.address);

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = anchor.web3.Keypair.fromSecretKey(secret);

const ProductsManagment = () => {
    const { publicKey } = useWallet();

    useEffect(() => {
        (async () => {
            const program = getProgram(idl, programID);
            try {
                const account = publicKey && (await program.account.products.fetch(baseAccount.publicKey));
            } catch (err) {
                console.log('ProductsManagment: Err: ---> ', err);
            }
        })();
    }, [publicKey]);

    return (
        <>
            <ListItemIcon>
                <AddIcon />
            </ListItemIcon>
            {/* <Paper sx={{ p: 2 }}>product</Paper> */}
        </>
    );
};

export default ProductsManagment;
