import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';

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

import { updloadImgToIpfs, updloaMetadataToIpfs } from '_utils/solana';
import { appToastActions } from '_commComp/toast/slice';
import { FIELDS } from '_commComp/toast/types';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import HistoryBack from '_commComp/backHistory';

import SendNftSchema, { ENUM_FIELDS, T_HOOKS_FOMR_NFT_SEND } from './validateSendNft';
import SliceMintNft from './slice';
import { selectMintNftSuccess } from './slice/selector';

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
    labelWrapImg: {
        display: 'block',
        width: '100%',
        minHeight: '100%',
        cursor: 'pointer',
    },
});

const MintNftComp = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const useClasses = useStyles();
    const wallet = useWallet();
    const { actions } = SliceMintNft();

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [imageFileBuffer, setImageFileBuffer] = useState<any>(null);

    const statusMintNft = useSelector(selectMintNftSuccess);

    useEffect(() => {
        if (statusMintNft) {
            resetField(ENUM_FIELDS.name);
            resetField(ENUM_FIELDS.des);

            setSelectedFile(null);
        }
    }, [statusMintNft]);

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
        resetField,
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
            idPubkey: router.query.id as string,
            name: data[ENUM_FIELDS.name],
            symbol: 'symb',
            metadataUrl: uploadedMetatdataUrl,
        };
        // Call mint nft
        dispatch(actions.mintNftCall(dataSend));
    };

    const handleUploadClick = (event: any) => {
        if (event) {
            try {
                const file: File = event?.target?.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onloadend = () => {
                    setSelectedFile([reader.result]);
                };

                const readerBuff = new FileReader();
                readerBuff.readAsArrayBuffer(file);
                readerBuff.onloadend = () => {
                    const getRes = readerBuff?.result;
                    if (getRes) {
                        const buff = Buffer.from(getRes as any);
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
        <>
            <Box sx={{ width: '100%', marginBottom: 0 }}>
                <HistoryBack />
            </Box>
            <Grid item xs={12} sx={{ mt: 1 }}>
                <Card sx={{ display: 'flex', border: 'none' }} variant="outlined" square>
                    <CardContent sx={{ flex: 1, p: 0 }} className={useClasses.imgWrap}>
                        <Typography>
                            <span style={{ color: 'red' }}>*</span> Image
                        </Typography>
                        <Box sx={{ border: '1px dotted #ddd', position: 'relative', minHeight: 400 }}>
                            <label htmlFor="imageFileUpload" className={useClasses.labelWrapImg}>
                                <input
                                    accept="image/*"
                                    id="imageFileUpload"
                                    className={useClasses.input}
                                    multiple
                                    type="file"
                                    onChange={handleUploadClick}
                                />
                                <span className={useClasses.iconUpload}>
                                    <Fab size="large" component="span" aria-label="add">
                                        <AddPhotoAlternateIcon />
                                    </Fab>
                                </span>
                                {selectedFile ? <img width="100%" src={selectedFile} /> : null}
                            </label>
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
        </>
    );
};

export default MintNftComp;
