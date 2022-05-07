import { PublicKey, Keypair } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

import { getCookie, ListCookieStorageName } from '_utils/cookieStorage';
import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';
import { getProgram, getProvider, getConfig } from '_config';

import idl from '_config/idl.json';
import { T_PRODUCT } from 'comps/01-home/products/type';
import kp from '_keys/keypair.json';

const programID = new PublicKey(idl.metadata.address);

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccountDefault: Keypair = web3.Keypair.fromSecretKey(secret);

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

export const productsInitCallApi = async (productsInit: T_PRODUCT[]): Promise<any> => {
    // const baseAccount = getKeypairDemo() || baseAccountDefault;
    const baseAccount = getKeypairDemo();

    if (!baseAccount) {
        return null;
    }

    const program = getProgram(idl, programID);
    const provider = getProvider(getConfig());

    try {
        const tx = await program.methods
            .initialize(productsInit)
            .accounts({
                baseAccount: baseAccount.publicKey,
                signer: provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            })
            .signers([baseAccount])
            .rpc();

        LocalStorageServices.setItem(LocalStorageKey().tx_lists.initProduct, tx);

        return await program.account.products.fetch(baseAccount.publicKey);
    } catch (_err: any) {
        console.log('productsInitCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};

export const productsCallApi = async (): Promise<any> => {
    // const baseAccount = getKeypairDemo() || baseAccountDefault;
    const baseAccount = getKeypairDemo();

    if (!baseAccount) {
        return null;
    }

    const program = getProgram(idl, programID);

    try {
        return await program.account.products.fetch(baseAccount.publicKey);
    } catch (_err: any) {
        console.log('productsCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};

export const productAddOneProductCallApi = async (productAdd: T_PRODUCT): Promise<any> => {
    // const baseAccount = getKeypairDemo() || baseAccountDefault;
    const baseAccount = getKeypairDemo();

    if (!baseAccount) {
        return null;
    }

    const program = getProgram(idl, programID);

    try {
        const tx = await program.methods
            .addOneProduct(productAdd)
            .accounts({
                baseAccount: baseAccount.publicKey,
            })
            .rpc();

        LocalStorageServices.setItem(LocalStorageKey().tx_lists.addOneProduct, tx);

        return await program.account.products.fetch(baseAccount.publicKey);
    } catch (_err: any) {
        console.log('productAddOneProductCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};

export const productUpdateOneProductCallApi = async (productAdd: T_PRODUCT): Promise<any> => {
    // const baseAccount = getKeypairDemo() || baseAccountDefault;
    const baseAccount = getKeypairDemo();

    if (!baseAccount) {
        return null;
    }

    const program = getProgram(idl, programID);

    try {
        const tx = await program.methods
            .updateOneProduct(productAdd)
            .accounts({
                baseAccount: baseAccount.publicKey,
            })
            .rpc();

        LocalStorageServices.setItem(LocalStorageKey().tx_lists.updateOneProduct, tx);

        return await program.account.products.fetch(baseAccount.publicKey);
    } catch (_err: any) {
        console.log('productUpdateOneProductCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};

export const productDeleteOneProductCallApi = async (id: string): Promise<any> => {
    // const baseAccount = getKeypairDemo() || baseAccountDefault;
    const baseAccount = getKeypairDemo();

    if (!baseAccount) {
        return null;
    }

    const program = getProgram(idl, programID);

    try {
        const tx = await program.methods
            .deleteOneProduct(id)
            .accounts({
                baseAccount: baseAccount.publicKey,
            })
            .rpc();

        LocalStorageServices.setItem(LocalStorageKey().tx_lists.deleteOneProduct, tx);

        return await program.account.products.fetch(baseAccount.publicKey);
    } catch (_err: any) {
        console.log('productDeleteOneProductCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};