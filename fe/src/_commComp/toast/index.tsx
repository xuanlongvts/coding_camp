import { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import useAppToastSlice from './slice';
import { selectToast } from './selector';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = () => {
    const { actions } = useAppToastSlice();
    const dispatch = useDispatch();

    const toastState = useSelector(selectToast);

    const handleClose = () => {
        dispatch(actions.toastClose());
    };

    useEffect(() => {
        const timeOutClose = setTimeout(() => {
            handleClose();
        }, 15000);

        return () => {
            clearTimeout(timeOutClose);
        };
    }, [toastState.open]);

    return (
        <Snackbar anchorOrigin={toastState.newPosition} open={toastState.open} onClose={handleClose} key={Math.random()}>
            <Alert severity={toastState.typeAlert}>{toastState.mess}</Alert>
        </Snackbar>
    );
};

export default Toast;
