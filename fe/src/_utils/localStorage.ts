import ENV from '_config';

type T_LocalStorageKey = {
    ProgressStatus: string;
    WalletReceive: string;
    ExchangeRate: string;
    tx_lists: {
        initProduct: string;
        addMultiProducts: string;
        addOneProduct: string;
        updateOneProduct: string;
        deleteOneProduct: string;
    };
    tx_mint_nft: string;
    accountsReceiveNft: string;
    darkMode: string;
    drawer: string;
    presentControls: string;
};
const LocalStorageKey = (detectEnv = ENV): T_LocalStorageKey => {
    return {
        ProgressStatus: `${detectEnv}_ProgressStatus`,
        WalletReceive: `${detectEnv}_WalletReceive`,
        ExchangeRate: `${detectEnv}_ExchangeRate`,
        presentControls: `${detectEnv}_presentControls`,
        tx_lists: {
            initProduct: `${detectEnv}_initProduct`,
            addMultiProducts: `${detectEnv}_addMultiProducts`,
            addOneProduct: `${detectEnv}_addOneProduct`,
            updateOneProduct: `${detectEnv}_updateOneProduct`,
            deleteOneProduct: `${detectEnv}_deleteOneProduct`,
        },
        tx_mint_nft: `${detectEnv}_tx_mint_nft`,
        accountsReceiveNft: `${detectEnv}_accountsReceiveNft`,
        darkMode: `${detectEnv}_darkMode`,
        drawer: `${detectEnv}_drawer`,
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
