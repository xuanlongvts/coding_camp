import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import clsx from 'clsx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { getProgram } from '_config';
import { T_PRODUCT } from '_commComp/products/type';

import idl from '_config/idl.json';
import kp from '_keys/keypair.json';

import { LocalStorageServices } from '_utils/localStorage';
import FundAccSchema, { T_HOOKS_FOMR_GENE_QR_CODE, ENUM_FIELDS } from '_validate';
import { appLoadingActions } from '_commComp/loadingApp/slice';

import BasicMasonry from './masory';
import { unitPay as unitPayConst, changeRate } from './const';

// import List from './list';

const programID = new PublicKey(idl.metadata.address);

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const ListProduct = () => {
    const dispatch = useDispatch();

    const [products, setProducts] = useState<T_PRODUCT[]>([]);
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');

    const [unitPay, setUnitPay] = useState<string>(unitPayConst.sol);
    const [priceProduct, setPriceProduct] = useState<number>(1);
    const [quantityProduct, setQuantityProduct] = useState<number>(1);
    const [lastTotalMoney, setLastTotalMoney] = useState<number>(1);

    useEffect(() => {
        (async () => {
            const program = getProgram(idl, programID);
            try {
                const account = await program.account.products.fetch(baseAccount.publicKey);
                console.log('Query: data', account.listProducts);
                setProducts(account.listProducts);
            } catch (err) {
                console.log('err: ', err);
            }
        })();
    }, []);

    const handleClose = () => {
        setOpen(false);
        resetField(ENUM_FIELDS.amount);
        resetField(ENUM_FIELDS.quantityProduct);
        setPriceProduct(1);
        setLastTotalMoney(1);
    };

    const handleQuickBuy = (unit: string, price: number) => {
        if (unit !== unitPay) {
            setUnitPay(unit);
        }
        setPriceProduct(price);
        setLastTotalMoney(price);
        setOpen(true);
        setScroll('paper');

        // console.log('unitPay: ', unitPay);
        // console.log('lastTotalMoney: ', lastTotalMoney);
    };

    const handleUnitPay = (unit: string) => {
        if (unit !== unitPay) {
            console.log('unitPay: ', unitPay);
            const newRateExchange = changeRate(lastTotalMoney, unitPay);
            console.log('newRateExchange: ', newRateExchange);
            setLastTotalMoney(newRateExchange);

            setUnitPay(unit);
        }
    };

    const {
        register,
        handleSubmit,
        watch,
        resetField,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<T_HOOKS_FOMR_GENE_QR_CODE>({
        mode: 'onChange',
        resolver: yupResolver(FundAccSchema(unitPay)),
    });

    const onSubmitForm = (data: T_HOOKS_FOMR_GENE_QR_CODE) => {
        dispatch(appLoadingActions.loadingOpen());

        LocalStorageServices.setItemJson(ENUM_FIELDS.label, data[ENUM_FIELDS.label]);
        LocalStorageServices.setItemJson(ENUM_FIELDS.amount, data[ENUM_FIELDS.amount]);
        LocalStorageServices.setItemJson(ENUM_FIELDS.unitPay, unitPay);

        data[ENUM_FIELDS.message] && LocalStorageServices.setItemJson(ENUM_FIELDS.message, data[ENUM_FIELDS.message]);
        data[ENUM_FIELDS.memo] && LocalStorageServices.setItemJson(ENUM_FIELDS.memo, data[ENUM_FIELDS.memo]);
    };

    const disabledBtn = !!(
        errors[ENUM_FIELDS.label] ||
        errors[ENUM_FIELDS.quantityProduct] ||
        errors[ENUM_FIELDS.amount] ||
        !watch()[ENUM_FIELDS.label] ||
        !watch()[ENUM_FIELDS.amount]
    );

    useEffect(() => {
        const getQuantity = Number(watch(ENUM_FIELDS.quantityProduct));
        if (getQuantity < 1) {
            setValue(ENUM_FIELDS.quantityProduct, 1);
        }

        const newPrice = getQuantity * lastTotalMoney;
        if (getQuantity && getQuantity !== quantityProduct && Number(newPrice) !== lastTotalMoney) {
            console.log('vao day');
            setLastTotalMoney(newPrice);
            // setQuantityProduct(getQuantity);
        }
    }, [watch(ENUM_FIELDS.quantityProduct)]);

    if (!products.length) {
        return null;
    }

    return (
        <>
            {products.length && <BasicMasonry products={products} handleQuickBuy={handleQuickBuy} />}

            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title" style={{ textAlign: 'center', padding: 10 }}>
                    <Image src="/imgs/SolanaPayLogo.svg" alt="Solana Pay" width={50} height={25} />
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'} sx={{ py: 2, px: 3 }}>
                    <Box sx={{ minWidth: 300, maxWidth: 350 }}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.label}
                            label="Lable"
                            placeholder="xxx"
                            type="text"
                            margin="normal"
                            {...register(ENUM_FIELDS.label)}
                            error={!!errors[ENUM_FIELDS.label]}
                            helperText={errors[ENUM_FIELDS.label]?.message}
                        />
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.quantityProduct}
                            label="Quantity Products"
                            placeholder="10"
                            min={1}
                            defaultValue={1}
                            type="number"
                            margin="normal"
                            {...register(ENUM_FIELDS.quantityProduct)}
                            error={!!errors[ENUM_FIELDS.quantityProduct]}
                            helperText={errors[ENUM_FIELDS.quantityProduct]?.message}
                        />
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.amount}
                            label={`Amount ${unitPay.toUpperCase()}`}
                            placeholder="1"
                            value={lastTotalMoney}
                            type="text"
                            margin="normal"
                            disabled
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className={clsx('sol-usdc', `${unitPay}`)}>
                                        <Image
                                            src="/imgs/sol.svg"
                                            alt="Solana"
                                            width={32}
                                            height={32}
                                            onClick={() => handleUnitPay(unitPayConst.sol)}
                                            className="img_sol"
                                        />
                                        <Image
                                            src="/imgs/usdc.svg"
                                            alt="USDC"
                                            width={32}
                                            height={32}
                                            onClick={() => handleUnitPay(unitPayConst.usdc)}
                                            className="img_usdc"
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            {...register(ENUM_FIELDS.amount)}
                            error={!!errors[ENUM_FIELDS.amount]}
                            helperText={errors[ENUM_FIELDS.amount]?.message}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.message}
                            label="Mesage"
                            placeholder="Abc"
                            type="text"
                            margin="normal"
                            {...register(ENUM_FIELDS.message)}
                            error={!!errors[ENUM_FIELDS.message]}
                            helperText={errors[ENUM_FIELDS.message]?.message}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.memo}
                            label="Memo"
                            placeholder="Memo"
                            type="text"
                            margin="normal"
                            {...register(ENUM_FIELDS.memo)}
                            error={!!errors[ENUM_FIELDS.memo]}
                            helperText={errors[ENUM_FIELDS.memo]?.message}
                        />
                    </Box>
                    <Box sx={{ py: 2, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            style={{ textTransform: 'initial' }}
                            disabled={disabledBtn}
                            onClick={handleSubmit(onSubmitForm)}
                        >
                            Generate Payment Code
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ListProduct;
