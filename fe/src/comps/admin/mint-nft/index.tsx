import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { useWallet } from '@solana/wallet-adapter-react';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';

import ENV, { AirDropAccount, ENUM_envName, getBalance } from '_config';
import LinkRouters from '_routers';
import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

export type T_ListPayers = {
    pubkeyPayer: string;
    label: string;
    amount: string;
    unitPay: String;
    message: string;
    memo: any;
    status: number;
};

const MintNftsToAccounts = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { publicKey } = useWallet();
    const [payers, setPayers] = useState<T_ListPayers[]>([]);

    useEffect(() => {
        const getListPayers = LocalStorageServices.getItemJson(LocalStorageKey().accountsReceiveNft);
        getListPayers?.length && setPayers(getListPayers);
    }, []);

    useEffect(() => {
        (async () => {
            if (publicKey) {
                const getBal = await getBalance(publicKey);
                if (!getBal && ENUM_envName.production === ENV) {
                    AirDropAccount(publicKey); // default (it depend on env)
                    ENUM_envName.local === ENV && AirDropAccount(publicKey, ENUM_envName.dev); // in case local, also airdrop to devnet
                }
            }
        })();
    }, [publicKey]);

    const handleSend = (pubPayer: string) => () => {
        router.push(`${LinkRouters.mintNft}/${pubPayer}`);
    };

    return (
        <>
            {!payers?.length ? (
                <Box sx={{}}>
                    <Typography variant="h6" gutterBottom component="div">
                        There is no buyer to send NFT.
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Number</TableCell>
                                        <TableCell align="left">Buyer</TableCell>
                                        <TableCell align="left">Label</TableCell>
                                        <TableCell align="left">Amount</TableCell>
                                        <TableCell align="left">Message</TableCell>
                                        <TableCell align="center">Quantity</TableCell>
                                        <TableCell align="center" sx={{ width: 30 }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payers.map((item: T_ListPayers, k: number) => {
                                        const memoParse = JSON.parse(decodeURI(item.memo));
                                        const pubPayerSlim = item.pubkeyPayer.slice(0, 4) + '....' + item.pubkeyPayer.slice(-4);

                                        return (
                                            <TableRow key={k} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">
                                                    {++k}
                                                </TableCell>
                                                <TableCell align="left">{pubPayerSlim}</TableCell>
                                                <TableCell align="left">{item.label}</TableCell>
                                                <TableCell align="left">
                                                    {item.amount} ({item.unitPay})
                                                </TableCell>
                                                <TableCell align="left">{item.message}</TableCell>
                                                <TableCell align="center">{memoParse?.quantityProduct || 1}</TableCell>
                                                <TableCell align="center">
                                                    {item.status ? (
                                                        <Alert>Received</Alert>
                                                    ) : (
                                                        <Fab size="small" aria-label="send">
                                                            <SendIcon onClick={handleSend(item.pubkeyPayer)} />
                                                        </Fab>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )}
        </>
    );
};

export default MintNftsToAccounts;
