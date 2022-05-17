import * as anchor from '@project-serum/anchor';
import { web3, Program } from '@project-serum/anchor';
import { ConfirmOptions } from '@solana/web3.js';

import {
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createInitializeMintInstruction,
    MINT_SIZE,
} from '@solana/spl-token';

import idl from '_config/idl.json';

import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';
import {
    getKeypairDemo,
    programApp,
    providerApp,
    getMetadata,
    getMasterEdition,
    TOKEN_METADATA_PROGRAM_ID,
    programID,
} from '_services/solana';

import { T_DATA_PREPARE, T_RESULT_MINT_NFT } from './types';

const SOL_MINT_NFT_PROGRAM_ID = new anchor.web3.PublicKey('3t8JWHNXK9Sp7ZWPtBYD8xomhuLgzCmg1hVmLMsqzXyC');

export const mintNftlApi = async (data: T_DATA_PREPARE): Promise<T_RESULT_MINT_NFT | { errMess: any }> => {
    const baseAccount = getKeypairDemo();

    const { connection, wallet, name, symbol, metadataUrl } = data;

    if (!baseAccount) {
        return {
            errMess: 'baseAccount Not found',
        };
    }

    // const opts: ConfirmOptions = {
    //     preflightCommitment: 'confirmed', // confirmed, processed
    // };
    // const provider = new anchor.AnchorProvider(connection, wallet, opts);
    // anchor.setProvider(provider);
    // const program = new Program(idl, SOL_MINT_NFT_PROGRAM_ID, provider);

    const program = programApp();
    const provider = providerApp();

    try {
        const lamports = await program.provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);
        const mintKey = web3.Keypair.generate();
        const nftTokenAccount = await getAssociatedTokenAddress(mintKey.publicKey, provider.wallet.publicKey);

        const mint_tx = new web3.Transaction().add(
            web3.SystemProgram.createAccount({
                fromPubkey: provider.wallet.publicKey,
                newAccountPubkey: mintKey.publicKey,
                space: MINT_SIZE,
                programId: TOKEN_PROGRAM_ID,
                lamports,
            }),
            createInitializeMintInstruction(mintKey.publicKey, 0, provider.wallet.publicKey, provider.wallet.publicKey),
            createAssociatedTokenAccountInstruction(
                provider.wallet.publicKey,
                nftTokenAccount,
                provider.wallet.publicKey,
                mintKey.publicKey,
            ),
        );
        const { blockhash } = await connection.getLatestBlockhash();
        mint_tx.recentBlockhash = blockhash;
        const signatureMintTx = await wallet.sendTransaction(mint_tx, connection, {
            signers: [mintKey],
        });
        await connection.confirmTransaction(signatureMintTx, 'confirmed');

        const metadataAddress = await getMetadata(mintKey.publicKey);
        // const masterEdition = await getMasterEdition(mintKey.publicKey);

        // const tx =
        //     wallet?.publicKey &&
        //     (await program.methods
        //         .mintNft(mintKey.publicKey, name, symbol, metadataUrl)
        //         .accounts({
        //             mintAuthority: wallet!.publicKey,
        //             mint: mintKey.publicKey,
        //             tokenAccount: nftTokenAccount,
        //             tokenProgram: TOKEN_PROGRAM_ID,
        //             metadata: metadataAddress,
        //             tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        //             payer: wallet.publicKey,
        //             systemProgram: web3.SystemProgram.programId,
        //             rent: web3.SYSVAR_RENT_PUBKEY,
        //             // masterEdition: masterEdition,
        //         })
        //         .rpc());
        // console.log('tx: ', tx);
        // LocalStorageServices.setItem(LocalStorageKey().tx_mint_nft, tx);

        const tx = program.transaction.mintNft(mintKey.publicKey, name, symbol, metadataUrl, {
            accounts: {
                mintAuthority: wallet!.publicKey,
                mint: mintKey.publicKey,
                tokenAccount: nftTokenAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                metadata: metadataAddress,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                payer: wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
                rent: web3.SYSVAR_RENT_PUBKEY,
                // masterEdition: masterEdition,
            },
        });
        await wallet.sendTransaction(tx, connection);
        const confirmTx = await connection.confirmTransaction(tx, 'confirmed');

        // console.log('confirmTx: ', confirmTx);
        // LocalStorageServices.setItem(LocalStorageKey().tx_mint_nft, confirmTx);

        return {
            tx: confirmTx,
        };
    } catch (_err: any) {
        console.log('mintNftlApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};
