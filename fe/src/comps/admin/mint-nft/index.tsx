import { useEffect, useState, useMemo, useCallback, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getConfig from 'next/config';
import * as anchor from '@project-serum/anchor';
import { web3, Wallet, Program, BN, AnchorProvider } from '@project-serum/anchor';
import { Commitment, PublicKey, Transaction, ConfirmOptions } from '@solana/web3.js';

import {
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createInitializeMintInstruction,
    MINT_SIZE,
} from '@solana/spl-token';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import idl from '_config/idl.json';
import { updloadImgToIpfs, updloaMetadataToIpfs } from '_utils/solana';
import ENV, { Conn, SOLANA_PROTOCOLS, getProgram } from '_config';
import { appToastActions } from '_commComp/toast/slice';
import { FIELDS } from '_commComp/toast/types';
import { appLoadingActions } from '_commComp/loadingApp/slice';

import {
    getKeypairDemo,
    programApp,
    providerApp,
    getMetadata,
    getMasterEdition,
    TOKEN_METADATA_PROGRAM_ID,
    programID,
} from '_services/solana';

import SendNftSchema, { ENUM_FIELDS, T_HOOKS_FOMR_NFT_SEND } from './validateSendNft';
import SliceMintNft from './slice';

const useStyles = makeStyles({
    input: {
        display: 'none',
    },
    imgWrap: {
        paddingBottom: '0 !important',
    },
    iconUpload: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
});

const MintNftComp = () => {
    const dispatch = useDispatch();
    const useClasses = useStyles();
    // const { connection } = useConnection();
    const wallet = useWallet();
    const { actions } = SliceMintNft();

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [imageFileBuffer, setImageFileBuffer] = useState<any>(null);

    // const anchorWallet = useMemo(() => {
    //     if (!wallet || !wallet.publicKey || !wallet.signAllTransactions || !wallet.signTransaction) {
    //         return;
    //     }

    //     return {
    //         publicKey: wallet.publicKey,
    //         signAllTransactions: wallet.signAllTransactions,
    //         signTransaction: wallet.signTransaction,
    //     } as anchor.Wallet;
    // }, [wallet]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_HOOKS_FOMR_NFT_SEND>({
        mode: 'onBlur',
        resolver: yupResolver(SendNftSchema),
    });

    const onSubmitForm = async (data: T_HOOKS_FOMR_NFT_SEND) => {
        if (!wallet.publicKey) {
            dispatch(
                appToastActions.toastOpen({
                    [FIELDS.mess]: 'Connect wallet first and change network to DevNet!',
                }),
            );
            return;
        }
        dispatch(appLoadingActions.loadingOpen());
        const uploadedImageUrl = await updloadImgToIpfs(imageFileBuffer);
        if (!uploadedImageUrl) {
            dispatch(
                appToastActions.toastOpen({
                    [FIELDS.typeAlert]: 'error',
                    [FIELDS.mess]: 'Uploading image to IPFS failed due to an error, please try again!',
                }),
            );
            dispatch(appLoadingActions.loadingClose());
            return;
        }
        const uploadedMetatdataUrl = await updloaMetadataToIpfs({
            name: data[ENUM_FIELDS.name],
            symbol: 'symb',
            description: data[ENUM_FIELDS.des],
            imgOnIpfs: uploadedImageUrl,
        });
        if (!uploadedMetatdataUrl) {
            dispatch(
                appToastActions.toastOpen({
                    [FIELDS.typeAlert]: 'error',
                    [FIELDS.mess]: 'Uploading informations to IPFS failed due to an error, please try again!',
                }),
            );
            dispatch(appLoadingActions.loadingClose());
            return;
        }
        dispatch(
            appToastActions.toastOpen({
                [FIELDS.typeAlert]: 'success',
                [FIELDS.mess]: 'Uploading information to IPFS: success!',
            }),
        );
        dispatch(appLoadingActions.loadingClose());
        const dataSend = {
            name: data[ENUM_FIELDS.name],
            symbol: 'symb',
            metadataUrl: uploadedMetatdataUrl,
        };
        // Call mint nft
        dispatch(actions.mintNftCall(dataSend));

        // const program = programApp();
        // const provider = providerApp();

        // const lamports = await program.provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);
        // const mintKey = anchor.web3.Keypair.generate();

        // if (provider?.wallet) {
        //     const nftTokenAccount = await getAssociatedTokenAddress(mintKey.publicKey, provider.wallet.publicKey);

        //     const mint_tx = new anchor.web3.Transaction().add(
        //         anchor.web3.SystemProgram.createAccount({
        //             fromPubkey: provider.wallet.publicKey,
        //             newAccountPubkey: mintKey.publicKey,
        //             space: MINT_SIZE,
        //             programId: TOKEN_PROGRAM_ID,
        //             lamports,
        //         }),
        //         createInitializeMintInstruction(mintKey.publicKey, 0, provider.wallet.publicKey, provider.wallet.publicKey),
        //         createAssociatedTokenAccountInstruction(
        //             provider.wallet.publicKey,
        //             nftTokenAccount,
        //             provider.wallet.publicKey,
        //             mintKey.publicKey,
        //         ),
        //     );
        //     let blockhashObj = await connection.getLatestBlockhash();
        //     // console.log("blockhashObj", blockhashObj);
        //     mint_tx.recentBlockhash = blockhashObj.blockhash;

        //     try {
        //         const signature = await wallet.sendTransaction(mint_tx, connection, {
        //             signers: [mintKey],
        //         });
        //         await connection.confirmTransaction(signature, 'confirmed');
        //     } catch {
        //         return false;
        //     }
        //     const metadataAddress = await getMetadata(mintKey.publicKey);
        //     const masterEdition = await getMasterEdition(mintKey.publicKey);

        //     try {
        //         const sign = await program.methods
        //             .mintNft(mintKey.publicKey, data[ENUM_FIELDS.name], 'symb', uploadedMetatdataUrl)
        //             .accounts({
        //                 mintAuthority: provider.wallet.publicKey,
        //                 mint: mintKey.publicKey,
        //                 tokenAccount: nftTokenAccount,
        //                 tokenProgram: TOKEN_PROGRAM_ID,
        //                 metadata: metadataAddress,
        //                 tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        //                 payer: provider.wallet.publicKey,
        //                 systemProgram: anchor.web3.SystemProgram.programId,
        //                 rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        //                 masterEdition: masterEdition,
        //             })
        //             .rpc();
        //         console.log('Mint Success!', sign);
        //         return true;
        //     } catch {
        //         return false;
        //     }
        // }
    };

    const handleUploadClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event) {
            try {
                const file: File = event!.target!.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onloadend = () => {
                    setSelectedFile([reader.result]);
                };

                const readerBuff = new FileReader();
                readerBuff.readAsArrayBuffer(file);
                readerBuff.onloadend = () => {
                    if (readerBuff?.result) {
                        const buff = Buffer.from(readerBuff!.result);
                        buff && setImageFileBuffer(buff);
                    }
                };
            } catch (error) {
                console.log('Error choose file: ', error);
            }
        }
    };

    const disabledBtn = !!(errors.name || errors.des || !watch().name || !watch().des || !selectedFile || !imageFileBuffer);

    return (
        <Grid item xs={12} sx={{ mt: 1 }}>
            <Card sx={{ display: 'flex', border: 'none' }} variant="outlined" square>
                <CardContent sx={{ flex: 1, p: 0 }} className={useClasses.imgWrap}>
                    <Typography>
                        <span style={{ color: 'red' }}>*</span> Image
                    </Typography>
                    <Box sx={{ border: '1px dotted #ddd', position: 'relative', minHeight: 400 }}>
                        <input
                            accept="image/*"
                            id="imageFileUpload"
                            className={useClasses.input}
                            multiple
                            type="file"
                            onChange={handleUploadClick}
                        />
                        <label htmlFor="imageFileUpload" className={useClasses.iconUpload}>
                            <Fab component="span" aria-label="add">
                                <AddPhotoAlternateIcon />
                            </Fab>
                        </label>
                        {selectedFile ? <img width="100%" src={selectedFile} /> : null}
                    </Box>
                </CardContent>
                <CardContent sx={{ flex: 1, mt: 1 }}>
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        id="name"
                        label="Name"
                        placeholder="NFT name here"
                        type="text"
                        {...register(ENUM_FIELDS.name)}
                        error={!!errors.name}
                        helperText={errors?.name?.message}
                    />
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        id="des"
                        label="Description"
                        placeholder="NFT description here"
                        margin="normal"
                        type="text"
                        multiline
                        rows={5}
                        {...register(ENUM_FIELDS.des)}
                        error={!!errors.des}
                        helperText={errors?.des?.message}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={disabledBtn}
                        onClick={handleSubmit(onSubmitForm)}
                    >
                        Send NFT
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default MintNftComp;
