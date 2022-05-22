import { useState, useEffect, ChangeEvent } from 'react';
import { debounce } from 'lodash';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

const valRateDefault = 50;
const valMax = 200;
const marks = [
    {
        value: valRateDefault,
        label: '50',
    },
    {
        value: 100,
        label: '100',
    },
    {
        value: 150,
        label: '150',
    },
    {
        value: valMax,
        label: '200',
    },
];

const Setting = () => {
    const [value, setValue] = useState<number>(1);
    const [valRate, setValRate] = useState<number | null>(null);
    const [valControls, setValControls] = useState<number>(1);

    useEffect(() => {
        const getWalletRecipient = Number(LocalStorageServices.getItemJson(LocalStorageKey().WalletReceive)) || 1;
        setValue(getWalletRecipient);

        const hardRate = LocalStorageServices.getItemJson(LocalStorageKey().ExchangeRate) || valRateDefault;
        setValRate(hardRate);

        const getValControls = LocalStorageServices.getItemJson(LocalStorageKey().presentControls) || 1;
        setValControls(getValControls);
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const getVal = Number((event.target as HTMLInputElement).value);
        setValue(getVal);
        LocalStorageServices.setItemJson(LocalStorageKey().WalletReceive, getVal);
    };

    const handleControlsPresentation = (event: ChangeEvent<HTMLInputElement>) => {
        const getVal = Number((event.target as HTMLInputElement).value);
        setValControls(getVal);
        LocalStorageServices.setItemJson(LocalStorageKey().presentControls, getVal);
    };

    const valuetext = (value: number): string => {
        debounce(() => {
            LocalStorageServices.setItemJson(LocalStorageKey().ExchangeRate, value);
        }, 1000)();

        return `Value : ${value}`;
    };

    return (
        <Box>
            <FormControl>
                <FormLabel id="wallet_receive">Wallet Recipient</FormLabel>
                <RadioGroup row aria-labelledby="wallet_receive" name="row-radio-buttons-group" value={value} onChange={handleChange}>
                    <FormControlLabel value={1} control={<Radio />} label="1 (BYaq...SULT)" />
                    &nbsp;&nbsp;
                    <FormControlLabel value={2} control={<Radio />} label="2 (FR7p...yj8i)" />
                </RadioGroup>
            </FormControl>

            {valRate ? (
                <Box sx={{ width: 300, pt: 7 }}>
                    <FormLabel sx={{ display: 'block', pb: 2 }}>Exchange rate SOL to USDC</FormLabel>
                    <Slider
                        aria-label="Exchange rate"
                        defaultValue={valRate}
                        getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks={marks}
                        min={valRateDefault}
                        max={valMax}
                    />
                </Box>
            ) : null}

            <FormControl sx={{ pt: 5 }}>
                <FormLabel id="controls_set">Controls Presentation</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="controls_set"
                    name="row-radio-buttons-group"
                    value={valControls}
                    onChange={handleControlsPresentation}
                >
                    <FormControlLabel value={1} control={<Radio />} label="True" />
                    &nbsp;&nbsp;
                    <FormControlLabel value={0} control={<Radio />} label="False" />
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default Setting;
