import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { PublicKey } from '@solana/web3.js';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormHelperText from '@mui/material/FormHelperText';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import LinkRouters from '_routers';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import Footer from '_commComp/footer';
import { setCookie, getCookie, ListCookieStorageName } from '_utils/cookieStorage';

import ProductSchema from './validateProduct';

type T_HOOK_FORM = {
    id: string;
    title: string;
    imgs: string;
    price: number;
    description: string;
    // owner?: PublicKey;
};

type T_TypeAction = {
    type: string;
};
const FrmProduct = ({ type }: T_TypeAction) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_HOOK_FORM>({
        mode: 'onBlur',
        resolver: yupResolver(ProductSchema),
    });

    const onSubmitForm = async (data: T_HOOK_FORM) => {};

    const disabledBtn = !!(
        errors.title ||
        errors.imgs ||
        errors.price ||
        errors.description ||
        !watch().title ||
        !watch().imgs ||
        !watch().price ||
        !watch().description
    );

    return (
        <Box sx={{ mx: 1, width: '90%' }}>
            <TextField
                required
                fullWidth
                variant="outlined"
                id="title"
                label="Title"
                placeholder="abc@gmail.com"
                type="text"
                margin="normal"
                {...register('title')}
                error={!!errors.title}
                helperText={errors?.title?.message}
            />
            <TextField
                required
                fullWidth
                variant="outlined"
                id="imgs"
                label="Images"
                margin="normal"
                type="text"
                {...register('imgs')}
                error={!!errors.imgs}
                helperText={errors?.imgs?.message}
            />
            <TextField
                required
                fullWidth
                variant="outlined"
                id="price"
                label="Prices (SOL)"
                margin="normal"
                type="text"
                {...register('price')}
                error={!!errors.price}
                helperText={errors?.price?.message}
            />
            <TextField
                required
                fullWidth
                variant="outlined"
                id="description"
                label="Description"
                margin="normal"
                multiline
                rows={5}
                maxRows={10}
                type="text"
                {...register('description')}
                error={!!errors.description}
                helperText={errors?.description?.message}
            />
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={disabledBtn} onClick={handleSubmit(onSubmitForm)}>
                {type}
            </Button>
        </Box>
    );
};

export default FrmProduct;
