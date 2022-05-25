import { Keypair } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';
import { getKeypairDemo, programApp } from '_services/solana';
import { getProvider, getConfig } from '_config';

import { T_PRODUCT } from 'comps/01-home/products/type';
import kp from '_keys/keypair.json';

import { productsAddMore } from '_data';

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccountDefault: Keypair = web3.Keypair.fromSecretKey(secret);

export const productsInitCallApi = async (productsInit: T_PRODUCT[]): Promise<any> => {
    // const baseAccount = getKeypairDemo() || baseAccountDefault;
    const baseAccount = getKeypairDemo();

    if (!baseAccount) {
        return {
            errMess: 'baseAccount Not found',
        };
    }

    const program = programApp();
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

        const txAddMore = await program.methods
            .addMultiProducts(productsAddMore)
            .accounts({
                baseAccount: baseAccount.publicKey,
                signer: provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            })
            .rpc();
        LocalStorageServices.setItem(LocalStorageKey().tx_lists.addMultiProducts, txAddMore);

        return await productsCallApi();
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
        return {
            errMess: 'baseAccount Not found',
        };
    }

    const program = programApp();

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
        return {
            errMess: 'baseAccount Not found',
        };
    }

    const program = programApp();

    try {
        const tx = await program.methods
            .addOneProduct(productAdd)
            .accounts({
                baseAccount: baseAccount.publicKey,
            })
            .rpc();

        LocalStorageServices.setItem(LocalStorageKey().tx_lists.addOneProduct, tx);

        return await productsCallApi();
    } catch (_err: any) {
        console.log('productAddOneProductCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};

export const productUpdateOneProductCallApi = async (productUpdate: T_PRODUCT): Promise<any> => {
    // const baseAccount = getKeypairDemo() || baseAccountDefault;
    const baseAccount = getKeypairDemo();

    if (!baseAccount) {
        return {
            errMess: 'baseAccount Not found',
        };
    }

    const program = programApp();

    try {
        const tx = await program.methods
            .updateOneProduct(productUpdate)
            .accounts({
                baseAccount: baseAccount.publicKey,
            })
            .rpc();

        LocalStorageServices.setItem(LocalStorageKey().tx_lists.updateOneProduct, tx);

        return await productsCallApi();
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
        return {
            errMess: 'baseAccount Not found',
        };
    }

    const program = programApp();

    try {
        const tx = await program.methods
            .deleteOneProduct(id)
            .accounts({
                baseAccount: baseAccount.publicKey,
            })
            .rpc();

        LocalStorageServices.setItem(LocalStorageKey().tx_lists.deleteOneProduct, tx);

        return await productsCallApi();
    } catch (_err: any) {
        console.log('productDeleteOneProductCallApi _err ---> ', _err);

        return {
            errMess: _err,
        };
    }
};
