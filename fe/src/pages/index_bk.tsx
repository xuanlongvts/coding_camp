import { useEffect } from 'react';
import type { NextPage } from 'next';

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

import { getProgram, getProvider, getConfig } from '_config';
import idl from '_config/idl.json';
import { products, addOneProductData, addOneProductDataOther, updateOneProductData, deleteOneProductData } from '_config/tmp_data';
import Header from '_commComp/header';

import kp from '_keys/keypair.json';

const programID = new PublicKey(idl.metadata.address);

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = anchor.web3.Keypair.fromSecretKey(secret);

const Home: NextPage = () => {
    const { publicKey } = useWallet();

    useEffect(() => {
        (async () => {
            const program = getProgram(idl, programID);
            // console.log('programId', program.programId);
            try {
                const account = publicKey && (await program.account.products.fetch(baseAccount.publicKey));
                console.log('Query: data', account);
            } catch (err) {
                console.log('err: ', err);
            }
        })();
    }, [publicKey]);

    const initProducts = async () => {
        const program = getProgram(idl, programID);
        const provider = getProvider(getConfig());
        try {
            publicKey &&
                (await program.methods
                    .initialize(products)
                    .accounts({
                        baseAccount: baseAccount.publicKey,
                        signer: provider.wallet.publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .signers([baseAccount])
                    .rpc());
        } catch (_err) {
            console.log('_err: ', _err);
        }

        const account = publicKey && (await program.account.products.fetch(baseAccount.publicKey));
        console.log('account: init', account);
    };

    const handleAddOneProduct = async () => {
        const program = getProgram(idl, programID);
        try {
            publicKey &&
                (await program.methods
                    .addOneProduct(addOneProductDataOther)
                    .accounts({
                        baseAccount: baseAccount.publicKey,
                    })
                    .rpc());
            const account = publicKey && (await program.account.products.fetch(baseAccount.publicKey));
            console.log('account: Add ---> ', account);
        } catch (_err) {
            console.log('_err: ', _err);
        }
    };
    const handleUpdateOneProduct = async () => {
        const program = getProgram(idl, programID);

        try {
            publicKey &&
                (await program.methods
                    .updateOneProduct(updateOneProductData)
                    .accounts({
                        baseAccount: baseAccount.publicKey,
                    })
                    .rpc());
            const account = publicKey && (await program.account.products.fetch(baseAccount.publicKey));
            console.log('account: Update ---> ', account);
        } catch (_err) {
            console.log('_err: ', _err);
        }
    };
    const handleDeleteOneProduct = async () => {
        const program = getProgram(idl, programID);
        try {
            publicKey &&
                (await program.methods
                    .deleteOneProduct(deleteOneProductData.id_1)
                    .accounts({
                        baseAccount: baseAccount.publicKey,
                    })
                    .rpc());
            const account = publicKey && (await program.account.products.fetch(baseAccount.publicKey));
            console.log('account: Update ---> ', account);
        } catch (_err) {
            console.log('_err: ', _err);
        }
    };

    return (
        <>
            <Header noBack />
            <button onClick={initProducts}>Init Products</button>
            <br />
            <br />
            <button onClick={handleAddOneProduct}>Add One Product</button>
            <br />
            <br />
            <button onClick={handleUpdateOneProduct}>Update One Product</button>
            <br />
            <br />
            <button onClick={handleDeleteOneProduct}>Delete One Product</button>
        </>
    );
};

export default Home;