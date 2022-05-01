import { useMemo, useState, useEffect } from 'react';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import NoSsr from '@mui/material/NoSsr';

import { PaymentStatus, PROGRESS_STATUS } from '_config';
import { LocalStorageServices } from '_utils/localStorage';

const colors = ['#8752f3', '#5497d5', '#43b4ca', '#28e0b9', '#19fb9b'];

const CircularProgressWithLabel = (props: CircularProgressProps & { value: number; statusmess: string }) => {
    const divi = Number(Math.floor(props.value / 20) - 1);
    const colorIndex = divi <= 0 ? 0 : divi;

    let styleChange = {
        color: colors[colorIndex],
    };

    return (
        <NoSsr>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" {...props} size={150} style={styleChange} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h6" component="div" color="text.secondary">
                        {props.statusmess}
                    </Typography>
                </Box>
            </Box>
        </NoSsr>
    );
};

const useBoxProgress = makeStyles({
    box_progress: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 50,
    },
});

type T_Progress = {
    progress: number;
    status: string;
};
const Progress = ({ progress, status }: T_Progress) => {
    const useClasses = useBoxProgress();

    useEffect(() => {
        return () => {
            LocalStorageServices.removeAll();
        };
    }, []);

    let [value, statusMess] = useMemo(() => {
        let newStatus: any = PaymentStatus.Pending;
        switch (status) {
            case PaymentStatus.Finalized:
                LocalStorageServices.setItemJson(PROGRESS_STATUS.ProgressStatus, PaymentStatus.Finalized);
                return [100, 'Complete'];
            case PaymentStatus.Confirmed:
            case PaymentStatus.Valid:
                if (progress >= 1) {
                    LocalStorageServices.setItemJson(PROGRESS_STATUS.ProgressStatus, PaymentStatus.Finalized);
                    return [100, 'Complete'];
                } else {
                    const val = Number(progress.toFixed(2)) * 100;
                    return [val, val + ' %'];
                }
            case PaymentStatus.InValid:
                newStatus = PaymentStatus.InValid;
                LocalStorageServices.setItemJson(PROGRESS_STATUS.ProgressStatus, PaymentStatus.InValid);
                return [0, newStatus];
            default:
                return [0, PaymentStatus.Pending];
        }
    }, [status, progress]);

    return (
        <div className={useClasses.box_progress}>
            <CircularProgressWithLabel value={value} statusmess={statusMess} />
        </div>
    );
};

export default Progress;
