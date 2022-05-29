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
import { AutoAirdrop } from '_utils/solana';

import { appToastActions } from '_commComp/toast/slice';
import { FIELDS } from '_commComp/toast/types';

export type T_ListPayers = {
    id: string;
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
                const func = () =>
                    dispatch(
                        appToastActions.toastOpen({
                            [FIELDS.typeAlert]: 'success',
                            [FIELDS.mess]: 'Auto airdrop 2 SOL to your wallet. Success!',
                        }),
                    );
                await AutoAirdrop(publicKey, func);
            }
        })();
    }, [publicKey]);

    const handleSend = (id: string) => () => {
        router.push(`${LinkRouters.mintNft}/${id}`);
    };

    return (
        <>
            {!payers?.length ? (
                <Box>
                    <Typography variant="h6" gutterBottom component="div">
                        There is no buyer to send NFT.
                    </Typography>
                </Box>
            ) : (
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
                                                <Fab size="small" aria-label="send" onClick={handleSend(item.id)}>
                                                    <SendIcon />
                                                </Fab>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};

export default MintNftsToAccounts;
