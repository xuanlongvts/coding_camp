import { SnackbarOrigin } from '@mui/material/Snackbar';
import { AlertProps, AlertColor } from '@mui/material/Alert';

import { NSP_TOAST } from '_types/root_state_type';

export enum FIELDS {
    open = 'open',
    typeAlert = 'typeAlert',
    mess = 'mess',
    newPosition = 'newPosition',
    linkRef = 'linkRef',
}
export interface I_APP_TOAST {
    [FIELDS.open]?: boolean;
    [FIELDS.typeAlert]?: AlertColor;
    [FIELDS.mess]: string;
    [FIELDS.newPosition]?: SnackbarOrigin;
    [FIELDS.linkRef]?: {
        link: string;
        target?: string;
        mess?: string;
    };
}
