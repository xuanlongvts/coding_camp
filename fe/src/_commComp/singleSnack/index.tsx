import { forwardRef } from 'react';
import { SyntheticEvent, useState } from 'react';
import Link from 'next/link';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

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

export type T_SingleSnackBar = {
    href: string;
    messLink: string;
    message: string;
    open: boolean;
    typeAlert: AlertColor;
};
const SingleSnackbar = ({ href, messLink, message, open, typeAlert }: T_SingleSnackBar) => {
    const classes = useStyles();
    const [isOpen, setOpen] = useState(open);

    const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <Link href={href}>
            <a target="_blank" rel="noopener" className={classes.linkA}>
                {messLink || 'Link'}
            </a>
        </Link>
    );

    return (
        <Snackbar open={isOpen} autoHideDuration={15000} onClose={handleClose} key={Math.random()}>
            <Alert severity={typeAlert}>
                {message} &nbsp; {href && action}
            </Alert>
        </Snackbar>
    );
};

export default SingleSnackbar;
