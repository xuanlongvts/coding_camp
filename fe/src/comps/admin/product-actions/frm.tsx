import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { nanoid } from 'nanoid';
import { useWallet } from '@solana/wallet-adapter-react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { T_PRODUCT } from 'comps/01-home/products/type';
import { appToastActions } from '_commComp/toast/slice';

import SliceProduct from 'comps/admin/dashboard/slice';
import { selectProductAddSuccess } from 'comps/admin/dashboard/slice/selector';

import ProductSchema from './validateProduct';

type T_HOOK_FORM = {
    title: string;
    imgs: string;
    price: number;
    description: string;
};

export enum E_TYPES {
    Add = 'Add',
    Update = 'Update',
}
type T_TypeAction = {
    type: E_TYPES.Add | E_TYPES.Update;
    productUpdating?: T_PRODUCT;
};
const FrmProduct = ({ type, productUpdating }: T_TypeAction) => {
    const { actions } = SliceProduct();
    const dispatch = useDispatch();
    const router = useRouter();
    const { publicKey } = useWallet();
    const statusAddOneProduct = useSelector(selectProductAddSuccess);

    const {
        register,
        handleSubmit,
        watch,
        resetField,
        formState: { errors },
    } = useForm<T_HOOK_FORM>({
        mode: 'onBlur',
        resolver: yupResolver(ProductSchema),
    });

    useEffect(() => {
        if (statusAddOneProduct && type === E_TYPES.Add) {
            resetField('title');
            resetField('imgs');
            resetField('price');
            resetField('description');
        }
    }, [statusAddOneProduct]);

    const onSubmitForm = async (data: T_HOOK_FORM) => {
        if (!publicKey) {
            dispatch(
                appToastActions.toastOpen({
                    mess: 'Connect wallet first and change network to DevNet!',
                }),
            );
            return;
        }

        if (type === E_TYPES.Add) {
            const dataSend: T_PRODUCT = {
                id: nanoid(),
                title: data.title,
                imgs: {
                    links: [data.imgs],
                },
                tips: [],
                price: Number(data.price),
                description: data.description,
                owner: publicKey,
            };
            dispatch(actions.productAddOneCall(dataSend));
        }
        if (type === E_TYPES.Update) {
            const dataSend: T_PRODUCT = {
                id: productUpdating!.id,
                title: data.title,
                imgs: {
                    links: [data.imgs],
                },
                tips: [],
                price: Number(data.price),
                description: data.description,
                owner: productUpdating!.owner,
            };
            dispatch(actions.productUpdateOneCall(dataSend));
        }
    };

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
                type="text"
                defaultValue={productUpdating?.title}
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
                defaultValue={productUpdating?.imgs?.links[0]}
                multiline
                rows={5}
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
                defaultValue={productUpdating?.price}
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
                type="text"
                defaultValue={productUpdating?.description}
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
