import { PublicKey, Keypair } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

import { getCookie } from '_utils/cookieStorage';
import { getProgram, getProvider, getConfig } from '_config';
import { KeyPairDemo } from 'comps/admin/const';

import idl from '_config/idl.json';
import { T_PRODUCT } from 'comps/01-home/products/type';
import kp from '_keys/keypair.json';

const programID = new PublicKey(idl.metadata.address);

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccountDefault: Keypair = web3.Keypair.fromSecretKey(secret);

const program = getProgram(idl, programID);
const provider = getProvider(getConfig());

const getKeypairDemo = (): Keypair | null => {
    let getKeypairDemo = getCookie(KeyPairDemo);
    getKeypairDemo = getKeypairDemo && JSON.parse(getKeypairDemo)._keypair.secretKey;
    let baseAccountDemo: Keypair | null = null;
    if (getKeypairDemo) {
        const arr = Object.values(getKeypairDemo);
        const secret = new Uint8Array(arr as any);
        baseAccountDemo = web3.Keypair.fromSecretKey(secret);
    }

    return baseAccountDemo;
};

export const productsInitCallApi = async (productsInit: T_PRODUCT[]): Promise<any> => {
    const baseAccount = getKeypairDemo() || baseAccountDefault;

    try {
        await program.methods
            .initialize(productsInit)
            .accounts({
                baseAccount: baseAccount.publicKey,
                signer: provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            })
            .signers([baseAccount])
            .rpc();

        return await program.account.products.fetch(baseAccount.publicKey);
    } catch (_err: any) {
        console.log('productsInitCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};

export const productsCallApi = async (): Promise<any> => {
    const baseAccount = getKeypairDemo() || baseAccountDefault;

    try {
        return await program.account.products.fetch(baseAccount.publicKey);
    } catch (_err: any) {
        console.log('productsCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};
