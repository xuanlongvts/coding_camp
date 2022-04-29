import { useEffect } from 'react';
import type { NextPage } from 'next';

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

import { getProgram, getProvider, getConfig } from '_config';
import idl from '_config/idl.json';
import { products, addOneProductData, updateOneProductData, deleteOneProductData } from '_config/tmp_data';

import Header from '_commComp/header';

const programID = new PublicKey(idl.metadata.address);

const baseAcc = anchor.web3.Keypair.generate();
const Home: NextPage = () => {
    const { publicKey } = useWallet();

    useEffect(() => {
        (async () => {
            const program = getProgram(idl, programID);
            const account = publicKey && (await program.account.products.fetch(publicKey));
            console.log('Query: data', account);
        })();
    }, []);

    const initProducts = async () => {
        const program = getProgram(idl, programID);
        publicKey &&
            (await program.methods
                .initialize(products)
                .accounts({
                    baseAccount: publicKey,
                    signer: publicKey.toString(),
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc());

        const account = publicKey && (await program.account.products.fetch(publicKey));
        console.log('account: init', account);
    };

    const handleAddOneProduct = async () => {
        const program = getProgram(idl, programID);
        publicKey &&
            (await program.methods
                .addOneProduct(addOneProductData)
                .accounts({
                    baseAccount: baseAcc.publicKey,
                    signer: publicKey.toString(),
                })
                .rpc());
        const account = await program.account.products.fetch(baseAcc.publicKey);
        console.log('account: Add ---> ', account);
    };
    const handleUpdateOneProduct = async () => {
        const program = getProgram(idl, programID);
        publicKey &&
            (await program.methods
                .updateOneProduct(updateOneProductData)
                .accounts({
                    baseAccount: baseAcc.publicKey,
                    signer: publicKey.toString(),
                })
                .rpc());
        const account = await program.account.products.fetch(baseAcc.publicKey);
        console.log('account: Update ---> ', account);
    };
    const handleDeleteOneProduct = async () => {
        const program = getProgram(idl, programID);
        publicKey &&
            (await program.methods
                .deleteOneProduct(deleteOneProductData.id)
                .accounts({
                    baseAccount: baseAcc.publicKey,
                    signer: publicKey.toString(),
                })
                .rpc());
        const account = await program.account.products.fetch(baseAcc.publicKey);
        console.log('account: Update ---> ', account);
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
