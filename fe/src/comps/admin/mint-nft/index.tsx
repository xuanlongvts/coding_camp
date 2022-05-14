import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getConfig from 'next/config';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3, Wallet, Program, BN, AnchorProvider } from '@project-serum/anchor';
import { Commitment, PublicKey, Transaction } from '@solana/web3.js';
import { MintLayout, TOKEN_PROGRAM_ID, createInitializeMintInstruction, createMintToInstruction } from '@solana/spl-token';

import {
    createAssociatedTokenAccountInstruction,
    getTokenWallet,
    getMetadata,
    getMasterEdition,
    TOKEN_METADATA_PROGRAM_ID,
    CANDY_MACHINE_PROGRAM,
} from '_utils/solana';
import { appToastActions } from '_commComp/toast/slice';
import ENV, { Conn, SOLANA_PROTOCOLS, getProgram } from '_config';

const { publicRuntimeConfig } = getConfig();

const MintNftComp = () => {
    const wallet = useWallet();
    const dispatch = useDispatch();

    const anchorWallet = useMemo(() => {
        if (!wallet || !wallet.publicKey || !wallet.signAllTransactions || !wallet.signTransaction) {
            return;
        }

        return {
            publicKey: wallet.publicKey,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction,
        } as Wallet;
    }, [wallet]);

    // const refreshCandyMachineState = useCallback(async (commitment: Commitment = 'confirmed') => {
    //     if (!anchorWallet) {
    //         return;
    //     }

    //     if (publicRuntimeConfig.CANDY_MACHINE_ID) {
    //         try {
    //             const cndy = await getCandyMachineState(anchorWallet, publicRuntimeConfig.CANDY_MACHINE_ID);
    //             console.log('cndy: ', cndy);
    //         } catch (err) {}
    //     }
    // }, []);

    useEffect(() => {
        // refreshCandyMachineState();
    }, []);

    const hanldeMintNft = async () => {
        if (!anchorWallet?.publicKey) {
            dispatch(
                appToastActions.toastOpen({
                    mess: 'Connect wallet first and change network to DevNet!',
                }),
            );
            return;
        }
        try {
            const mint = web3.Keypair.generate();
            const token = await getTokenWallet(anchorWallet?.publicKey, mint.publicKey);
            const metadata = await getMetadata(mint.publicKey);
            const masterEdition = await getMasterEdition(mint.publicKey);
            const connection = Conn(ENV, SOLANA_PROTOCOLS.METAPLEX);
            const rent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
            const accounts = {
                config: new web3.Keypair().publicKey,
                candyMachine: publicRuntimeConfig.CANDY_MACHINE_ID,
                payer: anchorWallet?.publicKey,
                wallet: publicRuntimeConfig.TREASURY_ADDRESS,
                mint: mint.publicKey,
                metadata,
                masterEdition,
                mintAuthority: anchorWallet?.publicKey,
                updateAuthority: anchorWallet?.publicKey,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
                rent: web3.SYSVAR_RENT_PUBKEY,
                clock: web3.SYSVAR_CLOCK_PUBKEY,
            };
            const signers = [mint];
            const instructions = [
                web3.SystemProgram.createAccount({
                    fromPubkey: anchorWallet?.publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: MintLayout.span,
                    lamports: rent,
                    programId: TOKEN_PROGRAM_ID,
                }),
                createInitializeMintInstruction(mint.publicKey, 0, anchorWallet?.publicKey, anchorWallet?.publicKey, TOKEN_PROGRAM_ID),
                createAssociatedTokenAccountInstruction(token, anchorWallet?.publicKey, anchorWallet?.publicKey, mint.publicKey),
                createMintToInstruction(mint.publicKey, token, anchorWallet?.publicKey, 1, [], TOKEN_PROGRAM_ID),
            ];

            const getConn = Conn(ENV, SOLANA_PROTOCOLS.METAPLEX);
            const provider = new AnchorProvider(getConn, anchorWallet, {
                preflightCommitment: 'processed',
            });
            const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
            const program = getProgram(idl!, CANDY_MACHINE_PROGRAM, provider);
            const txn = await program.rpc.mintNft({
                accounts,
                signers,
                instructions,
            });
            console.log('txn:', txn);

            // Setup listener
            connection.onSignatureWithOptions(
                txn,
                async (notification, context) => {
                    if (notification.type === 'status') {
                        console.log('Receievd status event');

                        const { result } = notification;
                        if (!result.err) {
                            console.log('NFT Minted!');

                            // setIsMinting(false);
                            // await getCandyMachineState();
                        }
                    }
                },
                { commitment: 'processed' },
            );
        } catch (error: any) {
            let message = error.msg || 'Minting failed! Please try again!';
            if (!error.msg) {
                if (!error.message) {
                    message = 'Transaction timeout! Please try again.';
                } else if (error.message.indexOf('0x137')) {
                    console.log(error);
                    message = `SOLD OUT!`;
                } else if (error.message.indexOf('0x135')) {
                    message = `Insufficient funds to mint. Please fund your wallet.`;
                }
            } else {
                if (error.code === 311) {
                    console.log(error);
                    message = `SOLD OUT!`;
                    window.location.reload();
                } else if (error.code === 312) {
                    message = `Minting period hasn't started yet.`;
                }
            }
        }
    };

    return (
        <div>
            <button onClick={hanldeMintNft}>Mint NFT to </button>
        </div>
    );
};

export default MintNftComp;
