import { PublicKey, Connection, ConfirmOptions, Commitment, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';

import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

const ENV = require('../../env.json').ENV;

export default ENV;

export const isWindow = typeof window !== null;

export enum ENUM_envName {
    local = 'local',
    dev = 'dev',
    test = 'test',
    production = 'production',
}
export const ConstEnvName = {
    [ENUM_envName.local]: 'local',
    [ENUM_envName.dev]: 'dev',
    [ENUM_envName.test]: 'test',
    [ENUM_envName.production]: 'production',
};

export enum SOLANA_PROTOCOLS {
    API_SERVER = 'API_SERVER',
    HUB_WS = 'HUB_WS',
}

type T_envName = {
    local: string;
    dev: string;
    test: string;
    production: string;
};
export const envName: T_envName = {
    [ENUM_envName.local]: 'local',
    [ENUM_envName.dev]: 'devnet',
    [ENUM_envName.test]: 'testnet',
    [ENUM_envName.production]: 'mainnet-beta',
};

export const Config = {
    [ConstEnvName.local]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'http://127.0.0.1:8899',
        [SOLANA_PROTOCOLS.HUB_WS]: 'ws://127.0.0.1:8900',
    },
    [ConstEnvName.dev]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.devnet.solana.com',
        [SOLANA_PROTOCOLS.HUB_WS]: 'ws://api.devnet.solana.com',
    },
    [ConstEnvName.test]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.testnet.solana.com',
        [SOLANA_PROTOCOLS.HUB_WS]: 'ws://api.testnet.solana.com',
    },
    [ConstEnvName.production]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.mainnet-beta.solana.com', // https://solana-api.projectserum.com
        [SOLANA_PROTOCOLS.HUB_WS]: 'ws://api.mainnet-beta.solana.com',
    },
};

export const getConfig = (envParams = ENV, protocol = SOLANA_PROTOCOLS.API_SERVER) => {
    return Config[envParams as string][protocol];
};

const optsConn: Commitment = 'confirmed';
const opts: ConfirmOptions = {
    preflightCommitment: 'confirmed', // confirmed, processed
};

export const Conn = (envParams?: string) => {
    return new Connection(getConfig(envParams), optsConn);
};

export const AirDropAccount = async (pubkey: PublicKey, envParams = ENV): Promise<any> => {
    try {
        const airdropAdminAcc = await Conn(envParams).requestAirdrop(pubkey, LAMPORTS_PER_SOL);
        return await Conn().confirmTransaction(airdropAdminAcc);
    } catch (err) {
        return err;
    }
};

export const getBalance = async (pubkey: PublicKey): Promise<number | string> => {
    try {
        const getAmounts = await Conn().getBalance(pubkey);
        return Number(getAmounts);
    } catch (err) {
        console.log('err: getBalance ---> ', err);
        return 'Something went wrong';
    }
};

export const getProvider = (cluster: string) => {
    const conn = new Connection(cluster, optsConn);
    const provider = new AnchorProvider(conn, (window as any)?.solana, opts);

    return provider;
};

export const getProgram = (idl: any, pubkey: PublicKey) => {
    return new Program(idl, pubkey, getProvider(getConfig()));
};

export const accountExplorer = (address: string) => {
    let cluster = envName.dev;
    ENV === ENUM_envName.test && (cluster = envName.test);
    ENV === ENUM_envName.production && (cluster = envName.production);
    return `https://explorer.solana.com/address/${address}?cluster=${cluster}`;
};

export const transactionExplorer = (signature: string) => {
    let cluster = envName.dev;
    ENV === ENUM_envName.test && (cluster = envName.test);
    ENV === ENUM_envName.production && (cluster = envName.production);
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
};

export const blockExplorer = (block: string) => {
    let cluster = envName.dev;
    ENV === ENUM_envName.test && (cluster = envName.test);
    ENV === ENUM_envName.production && (cluster = envName.production);
    return `https://explorer.solana.com/block/${block}?cluster=${cluster}`;
};

// SOL Pay Section
// wallet 1 = BYaqcY4KvRkcjXTK8REEyWvs5FVajjdTRcoADAqVSULT
// wallet 2 = FR7pzZogRmdcwZ3ZcCpjFCeQA7fEB6ndQpfgvJewyj8i
export const WalletRecipient_1 = 'BYaqcY4KvRkcjXTK8REEyWvs5FVajjdTRcoADAqVSULT';
export const WalletRecipient_2 = 'FR7pzZogRmdcwZ3ZcCpjFCeQA7fEB6ndQpfgvJewyj8i';

export const PubkeyRecipient = () => {
    const getWalletRecipient = isWindow ? Number(LocalStorageServices.getItemJson(LocalStorageKey().WalletReceive)) : 1;
    const determineWallet = getWalletRecipient === 1 ? WalletRecipient_1 : WalletRecipient_2;
    return new PublicKey(determineWallet);
}; // transform to Pubkey

export const requiredConfirmations = 5;

export enum PaymentStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Valid = 'Valid',
    InValid = 'InValid',
    Finalized = 'Finalized',
}

// Mint DUMMY tokens on devnet @ https://spl-token-faucet.com
export const DEVNET_DUMMY_MINT = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');
export const MAINNET_USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

export type Digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Confirmations =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32;
// SOL Pay Section
