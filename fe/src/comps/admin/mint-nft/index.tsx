import { useEffect, useState, useMemo, useCallback, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getConfig from 'next/config';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3, Wallet, Program, BN, AnchorProvider } from '@project-serum/anchor';
import { Commitment, PublicKey, Transaction } from '@solana/web3.js';
import {
    MintLayout,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    createMintToInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    MINT_SIZE,
} from '@solana/spl-token';

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

import { getMetadata, getMasterEdition, TOKEN_METADATA_PROGRAM_ID, CANDY_MACHINE_PROGRAM } from '_utils/solana';
import { appToastActions } from '_commComp/toast/slice';
import ENV, { Conn, SOLANA_PROTOCOLS, getProgram } from '_config';

import SendNftSchema, { ENUM_FIELDS, T_HOOKS_FOMR_NFT_SEND } from './validateSendNft';

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
    const { publicKey } = useWallet();
    const dispatch = useDispatch();
    const useClasses = useStyles();

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [imageFileBuffer, setImageFileBuffer] = useState<any>(null);

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
        if (!publicKey) {
            dispatch(
                appToastActions.toastOpen({
                    mess: 'Connect wallet first and change network to DevNet!',
                }),
            );
            return;
        }
    };

    const hanldeMintNft = async () => {};

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
        <Grid item xs={12} sx={{ mt: 2 }}>
            <Card sx={{ display: 'flex', border: 'none' }} variant="outlined" square>
                <CardContent sx={{ flex: 1, p: 0 }} className={useClasses.imgWrap}>
                    <Typography>
                        <span style={{ color: 'red' }}>*</span> Image
                    </Typography>
                    <Box sx={{ border: '1px dotted #ddd', position: 'relative', minHeight: 500 }}>
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
                        {...register('name')}
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
                        {...register('des')}
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
