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

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

import { getMetadata, getMasterEdition, TOKEN_METADATA_PROGRAM_ID, CANDY_MACHINE_PROGRAM } from '_utils/solana';
import { appToastActions } from '_commComp/toast/slice';
import ENV, { Conn, SOLANA_PROTOCOLS, getProgram } from '_config';

const useStyles = makeStyles({
    input: {
        display: 'none',
    },
});

const MintNftComp = () => {
    const { publicKey } = useWallet();
    const dispatch = useDispatch();
    const useClasses = useStyles();

    const [selectedFile, setSelectedFile] = useState<any | null>(null);

    const hanldeMintNft = async () => {};

    const handleUploadClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event) {
            const file: File = event!.target!.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = () => {
                setSelectedFile([reader.result]);
            };
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                '& > :not(style)': {
                    m: 1,
                    width: '100%',
                    height: 500,
                },
            }}
        >
            {/* <Paper variant="outlined" square>
                <input
                    accept="image/*"
                    id="imageFileUpload"
                    className={useClasses.input}
                    multiple
                    type="file"
                    onChange={handleUploadClick}
                />
                <label htmlFor="imageFileUpload">
                    <Fab component="span" aria-label="add">
                        <AddPhotoAlternateIcon />
                    </Fab>
                </label>
                {selectedFile ? <img width="100%" src={selectedFile} /> : null}
            </Paper>
            <Paper variant="outlined" square>
                aaa
            </Paper> */}

            <Grid item xs={12} md={6}>
                <Card sx={{ display: 'flex' }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography component="h2" variant="h5">
                            title
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: '40%', display: { xs: 'none', sm: 'block' } }}
                        image="https://media0.giphy.com/media/3o85xnHXDgKM21daPm/giphy.gif?cid=ecf05e47hysarrfjl2jx4xxbmr91qgkphkobhjn3bzr6ov27&rid=giphy.gif&ct=g"
                        alt="alt "
                    />
                </Card>
            </Grid>
        </Box>
    );
};

export default MintNftComp;
