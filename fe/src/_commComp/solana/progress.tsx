import { useMemo, useState, useEffect } from 'react';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import NoSsr from '@mui/material/NoSsr';

import { PaymentStatus } from '_config';
import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

const colors = ['#8752f3', '#5497d5', '#43b4ca', '#28e0b9', '#19fb9b'];

const CircularProgressWithLabel = (props: CircularProgressProps & { value: number; statusmess: string; is_continue: string | null }) => {
    const divi = Number(Math.floor(props.value / 20) - 1);
    const colorIndex = divi <= 0 ? 0 : divi;

    let styleChange = {
        color: colors[colorIndex],
    };

    let setColor = null;
    if (props.is_continue) {
        let styleInvSuc = {
            cls_invalid: {
                color: '#ccc',
            },
            cls_success: {
                color: colors[4],
            },
        };

        console.log('props.is_continue: ', props.is_continue);

        setColor = props.is_continue === PaymentStatus.Finalized ? styleInvSuc.cls_success : styleInvSuc.cls_invalid;
    }

    return (
        <NoSsr>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" {...props} size={150} style={setColor || styleChange} />
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
                        {props.is_continue || props.statusmess}
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

const timeConst = 5;
type T_Progress = {
    progress: number;
    status: string;
    handlePreClose: () => void;
};
const Progress = ({ progress, status, handlePreClose }: T_Progress) => {
    const useClasses = useBoxProgress();

    let [timeOutTick, setTimeOutTick] = useState<number | null>(null);
    const [isProgressContinues, setIsProgressContinues] = useState<string | null>(null);

    let intervalTick: any;

    const tick = () => {
        if (typeof timeOutTick === 'number') {
            if (timeOutTick === 1) {
                setTimeOutTick(null);
                handlePreClose();
            }
            timeOutTick > 0 && setTimeOutTick(--timeOutTick);
        }
    };

    useEffect(() => {
        const getInforProgress = LocalStorageServices.getItemJson(LocalStorageKey().ProgressStatus);
        if (getInforProgress && getInforProgress === PaymentStatus.InValid) {
            setIsProgressContinues(getInforProgress);
        }

        return () => {
            LocalStorageServices.removeItem(LocalStorageKey().ProgressStatus);
            clearInterval(intervalTick);
        };
    }, []);

    let [value, statusMess] = useMemo(() => {
        let newStatus: any = PaymentStatus.Pending;
        switch (status) {
            case PaymentStatus.Finalized:
                LocalStorageServices.setItemJson(LocalStorageKey().ProgressStatus, PaymentStatus.Finalized);
                return [100, 'Complete'];
            case PaymentStatus.Confirmed:
            case PaymentStatus.Valid:
                if (progress >= 1) {
                    LocalStorageServices.setItemJson(LocalStorageKey().ProgressStatus, PaymentStatus.Finalized);
                    return [100, 'Complete'];
                } else {
                    const val = Number(progress.toFixed(2)) * 100;
                    return [val, val + ' %'];
                }
            case PaymentStatus.InValid:
                newStatus = PaymentStatus.InValid;
                console.log('status: ===> ', status);
                LocalStorageServices.setItemJson(LocalStorageKey().ProgressStatus, PaymentStatus.InValid);
                return [0, newStatus];
            default:
                return [0, PaymentStatus.Pending];
        }
    }, [status, progress]);

    useEffect(() => {
        !timeOutTick && setTimeOutTick(timeConst);
        if (value === 100 && timeOutTick === timeConst) {
            intervalTick = setInterval(() => tick(), 1000);
        }
    }, [value]);

    return (
        <>
            <Box className={useClasses.box_progress}>
                <CircularProgressWithLabel value={value} statusmess={statusMess} is_continue={isProgressContinues} />
            </Box>
            {value === 100 ? (
                <Typography variant="h5" component="p" align="center">
                    {timeOutTick}
                </Typography>
            ) : null}
        </>
    );
};

export default Progress;
