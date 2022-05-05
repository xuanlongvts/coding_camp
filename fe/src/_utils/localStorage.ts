import ENV from '_config';

type T_LocalStorageKey = {
    tx_lists: string;
    darkMode: string;
};
const LocalStorageKey = (detectEnv = ENV): T_LocalStorageKey => {
    return {
        tx_lists: `${detectEnv}_tx_lists`,
        darkMode: `${detectEnv}_darkMode`,
    };
};

const LocalStorageServices = {
    setItem(key: string, value: any) {
        localStorage.setItem(key, value);
    },

    getItem(key: string): any {
        return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    },

    getItemJson(key: string): any {
        const get = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        return get ? JSON.parse(get) : null;
    },

    setItemJson(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    removeItem(key: string) {
        localStorage.removeItem(key);
    },

    removeManyItems(keys: Array<string>) {
        Object.values(keys).forEach(item => {
            window.localStorage.removeItem(item);
        });
    },

    removeAll() {
        localStorage.clear();
    },
};

export { LocalStorageServices, LocalStorageKey };
