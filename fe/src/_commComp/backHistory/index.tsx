import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

const useStyles = makeStyles({
    backText: {
        '&:hover': {
            fontWeight: 600,
        },
    },
});

const HistoryBack = () => {
    const classes = useStyles();
    const router = useRouter();

    const handleBack = () => {
        console.log('router', router);
        router.back();
    };

    return (
        <Box sx={{ width: 80, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleBack}>
            <ArrowLeftIcon />{' '}
            <Typography variant="subtitle1" component="div" className={classes.backText}>
                Back
            </Typography>
        </Box>
    );
};

export default HistoryBack;
