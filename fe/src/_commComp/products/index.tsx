import { useEffect, useState } from 'react';
import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { getProgram } from '_config';
import { T_PRODUCT } from '_commComp/products/type';

import idl from '_config/idl.json';
import kp from '_keys/keypair.json';

import BasicMasonry from './masory';
import List from './list';

const programID = new PublicKey(idl.metadata.address);

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const ListProduct = () => {
    const [products, setProducts] = useState<T_PRODUCT[]>([]);
    useEffect(() => {
        (async () => {
            const program = getProgram(idl, programID);
            try {
                const account = await program.account.products.fetch(baseAccount.publicKey);
                console.log('Query: data', account.listProducts);
                setProducts(account.listProducts);
            } catch (err) {
                console.log('err: ', err);
            }
        })();
    }, []);

    if (!products.length) {
        return null;
    }

    return <>{products.length && <BasicMasonry products={products} />}</>;
};

export default ListProduct;
