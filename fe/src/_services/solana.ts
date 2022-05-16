import { PublicKey, Keypair } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

import { getCookie, ListCookieStorageName } from '_utils/cookieStorage';
import { getProgram, getProvider, getConfig } from '_config';

import idl from '_config/idl.json';

const programID = new PublicKey(idl.metadata.address);

export const getKeypairDemo = (): Keypair | null => {
    let getKeypairDemo = getCookie(ListCookieStorageName().KeyPairDemo);
    getKeypairDemo = getKeypairDemo && JSON.parse(getKeypairDemo)._keypair.secretKey;
    let baseAccountDemo: Keypair | null = null;
    if (getKeypairDemo) {
        const arr = Object.values(getKeypairDemo);
        const secret = new Uint8Array(arr as any);
        baseAccountDemo = web3.Keypair.fromSecretKey(secret);
    }

    return baseAccountDemo;
};

export const programApp = () => getProgram(idl, programID);
export const providerApp = () => getProvider(getConfig());
