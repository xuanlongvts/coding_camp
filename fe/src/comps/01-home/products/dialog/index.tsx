import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

import {
    createTransfer,
    encodeURL,
    fetchTransaction,
    findReference,
    FindReferenceError,
    parseURL,
    validateTransfer,
    ValidateTransferError,
} from '@solana/pay';

import { ConfirmedSignatureInfo, PublicKey, TransactionSignature } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import BigNumber from 'bignumber.js';

import Dialog from '@mui/material/Dialog';

import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { web3 } from '@project-serum/anchor';

import QRCode from '_commComp/solana/qr_code';
import Progress from '_commComp/solana/progress';

import { PubkeyRecipient, WalletRecipient, PaymentStatus, requiredConfirmations, Confirmations, DEVNET_DUMMY_MINT } from '_config';
import { LocalStorageServices } from '_utils/localStorage';
import { ENUM_FIELDS } from '_validate';
import { unitPay as unitPayConst } from 'comps/01-home/products/const';

import FrmGenegrate from './frmGenegrate';
import { I_DiglogBox } from './const';

const DialogBox = ({ open, handleClose, products, idProductBuy, unit }: I_DiglogBox) => {
    const [reference, setReference] = useState<PublicKey | null>(null);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [signature, setSignature] = useState<TransactionSignature>();
    const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.Pending);
    const [confirmations, setConfirmations] = useState<Confirmations>(0);
    const [qrCodeValid, setQrCodeValid] = useState<boolean>(false);

    const progress = useMemo(() => confirmations / requiredConfirmations, [confirmations]);

    // 0. Wallet Pay on Browser
    useEffect(() => {
        if (publicKey && status === PaymentStatus.Pending) {
            const run = async () => {
                try {
                    const getAmount = new BigNumber(LocalStorageServices.getItemJson(ENUM_FIELDS.amount));
                    const getLabel = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.label));
                    const getMemo = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.memo));

                    if (!getAmount || !getLabel) {
                        return;
                    }

                    const getUnitPay = LocalStorageServices.getItemJson(ENUM_FIELDS.unitPay);
                    let isSplToken = undefined;
                    if (getUnitPay === unitPayConst.usdc) {
                        isSplToken = DEVNET_DUMMY_MINT;
                    }
                    const transaction =
                        reference &&
                        PubkeyRecipient &&
                        (await createTransfer(connection, publicKey, {
                            recipient: PubkeyRecipient,
                            amount: getAmount,
                            splToken: isSplToken,
                            reference,
                            memo: getMemo,
                        }));

                    if (qrCodeValid) {
                        console.log('qrCodeValid true: --> ', qrCodeValid);
                        transaction && (await sendTransaction(transaction, connection));
                    }
                } catch (err) {
                    console.log('0. Wallet on Broswer Pay --->: ', err);
                    timeout = setTimeout(run, 3000);
                }
            };
            let timeout = setTimeout(run, 0);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [status, publicKey, sendTransaction, qrCodeValid]);

    // 1. Status pending
    useEffect(() => {
        if (signature || status !== PaymentStatus.Pending || !reference) {
            return;
        }

        let changed = false;
        const interval = setInterval(async () => {
            let signature: ConfirmedSignatureInfo;
            try {
                signature = await findReference(connection, reference);

                console.log('signature: ---> ', signature);

                if (!changed) {
                    clearInterval(interval);
                    setSignature(signature.signature);
                    setStatus(PaymentStatus.Confirmed);
                }
            } catch (err: any) {
                // If the RPC node doesn't have the transaction signature yet, try again
                if (!(err instanceof FindReferenceError)) {
                    console.log('1. Error: ', err);
                }
            }
        }, 300);

        return () => {
            changed = true;
            clearInterval(interval);
        };
    }, [status, signature, reference, connection]);

    // 2. Status confirmed, check valid informations again
    useEffect(() => {
        const getAmount = new BigNumber(LocalStorageServices.getItemJson(ENUM_FIELDS.amount));
        if (!signature || status !== PaymentStatus.Confirmed || !getAmount) {
            return;
        }
        let changed = false;
        let timeout: any;

        const run = async () => {
            try {
                const getUnitPay = LocalStorageServices.getItemJson(ENUM_FIELDS.unitPay);
                const getMemo = LocalStorageServices.getItemJson(ENUM_FIELDS.memo) || undefined;

                console.log('getUnitPay: ', getUnitPay);
                let isSplToken = undefined;
                if (getUnitPay === unitPayConst.usdc) {
                    isSplToken = DEVNET_DUMMY_MINT;
                }

                reference &&
                    PubkeyRecipient &&
                    (await validateTransfer(
                        connection,
                        signature,
                        {
                            recipient: PubkeyRecipient,
                            amount: getAmount,
                            splToken: isSplToken,
                            reference,
                            memo: getMemo,
                        },
                        {
                            commitment: 'confirmed',
                        },
                    ));

                if (!changed) {
                    // console.log('status: ', status);
                    setStatus(PaymentStatus.Valid);
                }
            } catch (err: any) {
                if (err instanceof ValidateTransferError && (err.message === 'not found' || err.message === 'missing meta')) {
                    console.warn('2.0 Error validate: ', err);
                    timeout = setTimeout(run, 50);
                    return;
                }

                console.warn('2.1 Validate --->>> Error: ', err);
                setStatus(PaymentStatus.InValid);
            }
        };
        timeout = setTimeout(run, 0);

        return () => {
            clearTimeout(timeout);
            changed = true;
        };
    }, [status, signature, reference, connection]);

    // 3. Status valid, poll for confirmations until the transaction is finalized
    useEffect(() => {
        if (!signature || status !== PaymentStatus.Valid) {
            return;
        }
        let changed = false;

        const interval = setInterval(async () => {
            try {
                const response = await connection.getSignatureStatus(signature);

                const status = response.value;
                // console.log('status: ---> ', status);
                if (!status) {
                    return;
                }
                if (status.err) {
                    throw status.err;
                }

                if (!changed) {
                    const confirmations = (status.confirmations || 0) as Confirmations;
                    setConfirmations(confirmations);

                    if (confirmations >= requiredConfirmations || status.confirmationStatus === 'finalized') {
                        clearInterval(interval);
                        setStatus(PaymentStatus.Finalized);

                        changed = true;
                        LocalStorageServices.removeManyItems([
                            ENUM_FIELDS.amount,
                            ENUM_FIELDS.label,
                            ENUM_FIELDS.message,
                            ENUM_FIELDS.memo,
                            ENUM_FIELDS.unitPay,
                        ]);
                    }
                }
            } catch (err: any) {
                console.warn('3. Consensus --->>> Error: ', err);
            }
        }, 100);

        return () => {
            changed = true;
            clearInterval(interval);
        };
    }, [status, signature, connection]);

    // ---- Start this pop
    const handleGenerateQrCode = () => {
        const reRefreshKey = web3.Keypair.generate().publicKey;
        setReference(reRefreshKey);
        setQrCodeValid(true);
    };

    const handlePreClose = () => {
        setReference(null);
        setQrCodeValid(false);
        setStatus(PaymentStatus.Pending);
        setSignature(undefined);
        setConfirmations(0);

        handleClose();
    };
    // ---- End this pop

    return (
        <>
            <Dialog
                open={open}
                onClose={handlePreClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title" style={{ textAlign: 'center', padding: 10 }}>
                    <Image src="/imgs/SolanaPayLogo.svg" alt="Solana Pay" width={50} height={25} />
                </DialogTitle>
                <DialogContent dividers sx={{ py: 2, px: 3, minWidth: 390, minHeight: 430 }}>
                    {!reference ? (
                        <FrmGenegrate
                            products={products}
                            idProductBuy={idProductBuy}
                            unit={unit}
                            handleGenerateQrCode={handleGenerateQrCode}
                        />
                    ) : status === PaymentStatus.Pending && qrCodeValid ? (
                        <QRCode refPubkey={reference} />
                    ) : (
                        <Progress status={status} progress={progress} handlePreClose={handlePreClose} />
                    )}
                    {/* <Progress status={status} progress={progress} handlePreClose={handlePreClose} /> */}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DialogBox;
