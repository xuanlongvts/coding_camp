import Skeleton from '@mui/material/Skeleton';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    box: {
        width: 300,
    },
});

export default () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Box className={classes.box} m={10}>
                <Skeleton />
                <Skeleton animation={false} />
                <Skeleton animation="wave" />
            </Box>
        </div>
    );
};
