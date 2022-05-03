import ENV from '_config';

const isWindow = typeof window !== null;

const listCookieStorageName = (detectEnv = ENV) => {
    return {
        access_token: `${detectEnv}_access_token`,
        refresh_token: `${detectEnv}_refresh_token`,
        token_type: `${detectEnv}_token_type`,
    };
};

const setCookie = (cName: string, cValue: string, timeStame: number) => {
    const d = new Date(timeStame * 1000);
    d.setTime(d.getTime());
    const expires = `expires=${d.toUTCString()}`;
    isWindow && (document.cookie = `${cName}=${cValue};${expires};path=/`);
};

const getCookie = (cName: string) => {
    const name = `${cName}=`;
    const ca = isWindow && document.cookie.split(';');
    const getLenthCa = ca && ca.length;
    for (let i = 0; i < getLenthCa; i += 1) {
        let c = ca && ca[i];
        if (c) {
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
    }
    return null;
};

const checkCookie = (cName: string) => {
    const user = getCookie(cName);
    return !!user;
};

const deleteCookie = (cName: string) => {
    isWindow && (document.cookie = `${cName}=; expires = Thu, 01 Jan 1970 00:00:00 GMT`);
};

const deleteCookieFunc = () => {
    Object.values(listCookieStorageName()).forEach(item => {
        deleteCookie(item);
    });
};

export { setCookie, getCookie, deleteCookie, checkCookie, listCookieStorageName, deleteCookieFunc };
