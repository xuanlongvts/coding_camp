import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import { createQROptions } from '@solana/pay';
import QRCodeStyling from '@solana/qr-code-styling';
import { PublicKey } from '@solana/web3.js';

import { LocalStorageServices } from '_utils/localStorage';
import { WalletRecipient, DEVNET_DUMMY_MINT } from '_config';
import { ENUM_FIELDS } from '_validate';

import { unitPay as unitPayConst } from '_commComp/products/const';

const QRCode: FC<{ refPubkey: PublicKey }> = ({ refPubkey }) => {
    const matches = useMediaQuery('(max-width:450px)');

    const [url, setUrl] = useState<string>('');
    const [amountSol, setAmountSol] = useState<Number>();
    const [unitPayParse, setUnitPayParse] = useState<string>(unitPayConst.sol);

    useEffect(() => {
        const getAmount = Number(LocalStorageServices.getItemJson(ENUM_FIELDS.amount));
        const getLabel = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.label));

        let url = `solana:${WalletRecipient}?amount=${getAmount}&reference=${refPubkey.toBase58()}`;
        getLabel && (url += `&label=${getLabel}`);

        const getUnitPay = LocalStorageServices.getItemJson(ENUM_FIELDS.unitPay);
        if (getUnitPay === unitPayConst.usdc) {
            url += `&splToken=${DEVNET_DUMMY_MINT}`;
            setUnitPayParse(unitPayConst.usdc);
        }

        const getMessage = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.message));
        getMessage && (url += `&message=${getMessage}`);

        const getMemo = encodeURI(LocalStorageServices.getItemJson(ENUM_FIELDS.memo));
        getMemo && (url += `&memo=${getMemo}`);

        console.log('url genegrate: ', url);

        setUrl(url);
        setAmountSol(getAmount);
    }, []);

    const size = matches ? 320 : 350;
    const options = useMemo(() => createQROptions(url, size, 'transparent', '#2a2a2a'), [url, size]);

    const qr = useMemo(() => new QRCodeStyling(), []);
    useLayoutEffect(() => qr.update(options), [qr, options]);

    const ref = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (ref.current) {
            qr.append(ref.current);
        }
    }, [ref, qr]);

    return (
        <div className="geneQrCode">
            <div>
                <strong className="numSOL">{amountSol} </strong> {unitPayParse}
            </div>

            <div ref={ref} />
        </div>
    );
};

export default QRCode;
