import ENV from '_config';

type T_LocalStorageKey = {
    ProgressStatus: string;
    WalletReceive: string;
    tx_lists: {
        initProduct: string;
        addOneProduct: string;
        updateOneProduct: string;
        deleteOneProduct: string;
    };
    tx_mint_nft: string;
    darkMode: string;
};
const LocalStorageKey = (detectEnv = ENV): T_LocalStorageKey => {
    return {
        ProgressStatus: `${detectEnv}_ProgressStatus`,
        WalletReceive: `${detectEnv}_WalletReceive`,
        tx_lists: {
            initProduct: `${detectEnv}_initProduct`,
            addOneProduct: `${detectEnv}_addOneProduct`,
            updateOneProduct: `${detectEnv}_updateOneProduct`,
            deleteOneProduct: `${detectEnv}_deleteOneProduct`,
        },
        tx_mint_nft: `${detectEnv}_tx_mint_nft`,
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
