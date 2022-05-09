import { useState, useEffect, ChangeEvent } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

const Setting = () => {
    const [value, setValue] = useState<number>(1);

    useEffect(() => {
        const getWalletRecipient = Number(LocalStorageServices.getItemJson(LocalStorageKey().WalletReceive)) || 1;
        setValue(getWalletRecipient);
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const getVal = Number((event.target as HTMLInputElement).value);
        setValue(getVal);
        LocalStorageServices.setItemJson(LocalStorageKey().WalletReceive, getVal);
    };

    return (
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Wallet Recipient</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                <FormControlLabel value={1} control={<Radio />} label="1 (BYaq...SULT)" />
                &nbsp;&nbsp;
                <FormControlLabel value={2} control={<Radio />} label="2 (FR7p...yj8i)" />
            </RadioGroup>
        </FormControl>
    );
};

export default Setting;
