import { PublicKey } from '@solana/web3.js';

type T_Unit = {
    sol: number;
    usdc: number;
};

type T_CustomerTips = {
    user_pubkey: string;
    counts: number;
    unit: T_Unit;
};

export type T_PRODUCT = {
    id: string;
    title: string;
    imgs: {
        links: string[];
    };
    price: number;
    description: string;
    tips?: T_CustomerTips[];
    owner: PublicKey;
};
