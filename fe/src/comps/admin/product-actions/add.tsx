import Box from '@mui/material/Box';

import HistoryBack from '_commComp/backHistory';
import FrmProduct, { E_TYPES } from './frm';

const AddProduct = () => {
    return (
        <>
            <Box sx={{ width: '100%', marginBottom: 0 }}>
                <HistoryBack />
            </Box>
            <FrmProduct type={E_TYPES.Add} />
        </>
    );
};

export default AddProduct;
