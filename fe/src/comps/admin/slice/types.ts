export const KEY_ERR_MESS = 'errMess';
export const KEY_DATA_USER = 'dataUser';
export const KEY_ROUTER_LIST = 'routerList';
export const KEY_JWT_PROFILE = 'jwtProfile';
export const KEY_INFOR_USER_SUBMIT = 'infor_user_submit';
export const KEY_LOGOUT_SUBMIT = 'logout';

export interface T_SIGN_UP {
    [KEY_ERR_MESS]: string | null;
    [KEY_DATA_USER]: any;
    [KEY_ROUTER_LIST]: any;
    [KEY_JWT_PROFILE]: string | null;
    [KEY_INFOR_USER_SUBMIT]: T_PAYLOAD_INFOR_USER_SUBMIT | null;
    [KEY_LOGOUT_SUBMIT]: boolean;
}

export interface T_DATA_USER {
    access_token: string;
    isUpdatedPass: boolean;
}

export interface T_ROUTER_LIST {
    [KEY_ROUTER_LIST]: any;
}

export interface T_JWT_PROFILE {
    [KEY_JWT_PROFILE]: string;
}

export interface T_PAYLOAD_INFOR_USER_SUBMIT {
    username: string;
    password: string;
    google_recaptcha_token: string;
}
