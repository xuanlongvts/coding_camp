import { forwardRef } from 'react';
import Link from 'next/link';
import { makeStyles } from '@mui/styles';

import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import useAppToastSlice from './slice';
import { selectToast } from './selector';

const useStyles = makeStyles({
    linkA: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: 18,

        '&:hover': {
            color: '#333',
        },
    },
});

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = () => {
    const classes = useStyles();
    const { actions } = useAppToastSlice();
    const dispatch = useDispatch();

    const toastState = useSelector(selectToast);

    const handleClose = () => {
        dispatch(actions.toastClose());
    };

    const action = (
        <Link href={toastState.linkRef!.link}>
            <a target={toastState.linkRef?.target || '_blank'} rel="noopener" className={classes.linkA}>
                {toastState.linkRef?.mess || 'Link'}
            </a>
        </Link>
    );

    return (
        <Snackbar
            autoHideDuration={15000}
            anchorOrigin={toastState.newPosition}
            open={toastState.open}
            onClose={handleClose}
            key={Math.random()}
        >
            <Alert severity={toastState.typeAlert}>
                {toastState.mess} &nbsp; {toastState.linkRef?.link && action}
            </Alert>
        </Snackbar>
    );
};

export default Toast;
