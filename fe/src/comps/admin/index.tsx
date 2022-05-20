import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

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
import { web3 } from '@project-serum/anchor';
import { Base64 } from 'js-base64';

import LinkRouters from '_routers';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import Footer from '_commComp/footer';
import { setCookie, getCookie, ListCookieStorageName } from '_utils/cookieStorage';

import LoginSchemaValidate from './validateLogin';
import { adminHardcode } from './const';

interface T_HOOKS_FOMR {
    username: string;
    password: string;
}
const LoginPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_HOOKS_FOMR>({
        mode: 'onBlur',
        resolver: yupResolver(LoginSchemaValidate),
    });

    const [errorMess, setErrorMess] = useState<string | undefined>();

    const onSubmitForm = async (data: T_HOOKS_FOMR) => {
        const { username, password } = data;

        if (Base64.encode(username.trim()) !== adminHardcode.user || Base64.encode(password.trim()) !== adminHardcode.pass) {
            setErrorMess('Wrong username or password');
        } else {
            setErrorMess(undefined);
            dispatch(appLoadingActions.loadingOpen());

            const getDate = Date.now() + 1000 * 60 * 60 * 24 * 30 * 3; // 3 months

            setCookie(ListCookieStorageName().user, Base64.encode(username), getDate);
            setCookie(ListCookieStorageName().pass, Base64.encode(password), getDate);

            const neweKey = web3.Keypair.generate();
            const getCookiesKeypairDemo = getCookie(ListCookieStorageName().KeyPairDemo);
            !getCookiesKeypairDemo && setCookie(ListCookieStorageName().KeyPairDemo, JSON.stringify(neweKey), getDate);

            await new Promise(res => setTimeout(res, 1000));

            router.push(LinkRouters.adminDashboard);
        }
    };

    const disabledBtn = !!(errors.username || errors.password || !watch().username || !watch().password);
    useEffect(() => {
        if (disabledBtn && errorMess) {
            setErrorMess(undefined);
        }
    }, [disabledBtn, errorMess]);

    useEffect(() => {
        const getUser = getCookie(ListCookieStorageName().user);
        const getPass = getCookie(ListCookieStorageName().pass);
        if (getUser === adminHardcode.user && getPass === adminHardcode.pass) {
            router.push(LinkRouters.adminDashboard);
        }
    }, []);

    return (
        <Grid container component="div" sx={{ height: '100vh' }}>
            <Grid
                item
                xs={false}
                sm={7}
                md={8}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: t => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={5} md={4} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 0,
                        mx: 0,
                        display: 'flex',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            my: 0,
                            mx: 0,
                            display: 'flex',
                            height: '70px',
                            justifyContent: 'center',
                        }}
                    >
                        <Link href="/">
                            <a>
                                <Image src="/imgs/SolanaPayLogo.svg" alt="Solana Pay" width={100} height={50} />
                            </a>
                        </Link>
                    </Box>
                    <Box
                        sx={{
                            mx: 1,
                            minHeight: '500px',
                            // width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <div style={{ width: '24px', height: '24px' }}>
                                <LockOutlinedIcon />
                            </div>
                        </Avatar>

                        <Box sx={{ mt: 3, mx: 1, width: '88%' }}>
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                id="username"
                                label="Username"
                                placeholder="abc@gmail.com"
                                type="text"
                                margin="normal"
                                {...register('username')}
                                error={!!errors.username}
                                helperText={errors?.username?.message}
                            />
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                id="password"
                                label="Password"
                                margin="normal"
                                type="password"
                                autoComplete="current-password"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors?.password?.message}
                            />
                            {errorMess && <FormHelperText error={!!errorMess}>{errorMess}</FormHelperText>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={disabledBtn}
                                onClick={handleSubmit(onSubmitForm)}
                            >
                                Login
                            </Button>

                            {/* <Box sx={{ mt: 5, textAlign: 'center' }} className="hintPass">
                                {adminHardcode.user} - {adminHardcode.pass}
                            </Box> */}
                        </Box>
                    </Box>
                    <div className="footer-admin">
                        <Footer />
                    </div>
                </Box>
            </Grid>
        </Grid>
    );
};

export default LoginPage;
