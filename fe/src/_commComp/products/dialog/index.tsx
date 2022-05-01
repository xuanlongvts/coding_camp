import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

import Dialog from '@mui/material/Dialog';

import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import QRCode from '_commComp/solana/qr_code';

import FrmGenegrate from './frmGenegrate';
import { I_DiglogBox } from './const';

const DialogBox = ({ open, handleClose, products, idProductBuy, unit }: I_DiglogBox) => {
    const [reference, setReference] = useState<PublicKey | null>(null);

    const handleGenerateQrCode = () => {
        const reRefreshKey = web3.Keypair.generate().publicKey;
        setReference(reRefreshKey);
    };

    const handlePreClose = () => {
        setReference(null);
        handleClose();
    };

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
                <DialogContent dividers sx={{ py: 2, px: 3 }}>
                    {!reference ? (
                        <FrmGenegrate
                            products={products}
                            idProductBuy={idProductBuy}
                            unit={unit}
                            handleGenerateQrCode={handleGenerateQrCode}
                        />
                    ) : (
                        <QRCode refPubkey={reference} />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DialogBox;
