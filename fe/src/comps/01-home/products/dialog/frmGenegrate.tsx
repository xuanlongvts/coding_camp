import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import clsx from 'clsx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import FundAccSchema, { T_HOOKS_FOMR_GENE_QR_CODE, ENUM_FIELDS, QUANTITY_PRODUCT_FILED } from '_validate';
import { LocalStorageServices } from '_utils/localStorage';
import { T_PRODUCT } from 'comps/01-home/products/type';

import { unitPay as unitPayConst, changeRate } from 'comps/01-home/products/const';

import { I_FrmGenegrate } from './const';

const FrmGenegrate = ({ products, idProductBuy, unit, handleGenerateQrCode }: I_FrmGenegrate) => {
    const [unitPay, setUnitPay] = useState<string>(unit);
    const [lastTotalMoney, setLastTotalMoney] = useState<number>(1);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<T_HOOKS_FOMR_GENE_QR_CODE>({
        mode: 'onChange',
        resolver: yupResolver(FundAccSchema(unitPay)),
    });

    useEffect(() => {
        const getProductBuy: T_PRODUCT = products.filter(item => item.id === idProductBuy)[0];
        const newPrice = unitPay === unitPayConst.sol ? getProductBuy.price : changeRate(getProductBuy.price, unitPayConst.usdc);
        setLastTotalMoney(newPrice);

        setValue(ENUM_FIELDS.amount, newPrice);
        setValue(ENUM_FIELDS.memo, idProductBuy);
    }, [idProductBuy]);

    const handleUnitPay = (unit: string) => {
        if (unit !== unitPay) {
            const newRateExchange = changeRate(lastTotalMoney, unitPay === unitPayConst.sol ? unitPayConst.usdc : unitPayConst.sol);
            // console.log('newRateExchange: ', newRateExchange);
            setLastTotalMoney(newRateExchange);
            setValue(ENUM_FIELDS.amount, newRateExchange);

            setUnitPay(unit);
        }
    };

    const onSubmitForm = (data: T_HOOKS_FOMR_GENE_QR_CODE) => {
        LocalStorageServices.setItemJson(ENUM_FIELDS.label, data[ENUM_FIELDS.label]);
        LocalStorageServices.setItemJson(ENUM_FIELDS.amount, data[ENUM_FIELDS.amount]);
        LocalStorageServices.setItemJson(ENUM_FIELDS.unitPay, unitPay);

        data[ENUM_FIELDS.message] && LocalStorageServices.setItemJson(ENUM_FIELDS.message, data[ENUM_FIELDS.message]);
        data[ENUM_FIELDS.memo] && LocalStorageServices.setItemJson(ENUM_FIELDS.memo, data[ENUM_FIELDS.memo]);

        handleGenerateQrCode();
    };

    useEffect(() => {
        const getQuantity = Number(watch(ENUM_FIELDS.quantityProduct));
        if (getQuantity && getQuantity >= QUANTITY_PRODUCT_FILED.min && getQuantity <= QUANTITY_PRODUCT_FILED.max) {
            const getProductBuy: T_PRODUCT = products.filter(item => item.id === idProductBuy)[0];

            const newPrice =
                getQuantity * (unitPay === unitPayConst.sol ? getProductBuy.price : changeRate(getProductBuy.price, unitPayConst.usdc));
            // console.log('newPrice: ', newPrice);

            if (getQuantity && Number(newPrice) !== lastTotalMoney) {
                setLastTotalMoney(newPrice);
                setValue(ENUM_FIELDS.amount, newPrice);

                const newMemo = {
                    id: idProductBuy,
                    quantityProduct: getQuantity,
                };
                const stringifyMemo = encodeURI(JSON.stringify(newMemo));
                setValue(ENUM_FIELDS.memo, stringifyMemo);
            }
        }
    }, [watch(ENUM_FIELDS.quantityProduct)]);

    const disabledBtn = !!(
        errors[ENUM_FIELDS.label] ||
        errors[ENUM_FIELDS.quantityProduct] ||
        errors[ENUM_FIELDS.amount] ||
        !watch()[ENUM_FIELDS.label] ||
        !watch()[ENUM_FIELDS.amount]
    );

    return (
        <>
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
                    disabled
                    style={{ display: 'none' }}
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
        </>
    );
};

export default FrmGenegrate;
