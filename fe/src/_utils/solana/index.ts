import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import * as ipfsClient from 'ipfs-http-client';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import ENV, { AirDropAccount, ENUM_envName, getBalance } from '_config';

export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const SOL_MINT_NFT_PROGRAM_ID = new web3.PublicKey('3t8JWHNXK9Sp7ZWPtBYD8xomhuLgzCmg1hVmLMsqzXyC');

export const getMetadata = async (mint: web3.PublicKey): Promise<web3.PublicKey> => {
    return (
        await web3.PublicKey.findProgramAddress(
            [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            TOKEN_METADATA_PROGRAM_ID,
        )
    )[0];
};

export const getMasterEdition = async (mint: web3.PublicKey): Promise<web3.PublicKey> => {
    return (
        await web3.PublicKey.findProgramAddress(
            [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
            TOKEN_METADATA_PROGRAM_ID,
        )
    )[0];
};

export const ipfs = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
});

export const updloadImgToIpfs = async (imgBuff: Buffer): Promise<string | null> => {
    const imgUpload = await ipfs.add(imgBuff);
    if (!imgUpload) {
        return null;
    }
    return `https://ipfs.infura.io/ipfs/${imgUpload.path}`;
};

type T_MetadataToIpfs = {
    name: string;
    symbol: string;
    description: string;
    imgOnIpfs: string;
};
export const updloaMetadataToIpfs = async ({ name, symbol, description, imgOnIpfs }: T_MetadataToIpfs): Promise<string | null> => {
    const metadata = {
        name,
        symbol,
        description,
        image: imgOnIpfs,
    };
    const metadataUpload = await ipfs.add(JSON.stringify(metadata));
    if (!metadataUpload) {
        return null;
    }
    return `https://ipfs.infura.io/ipfs/${metadataUpload.path}`;
};

export const mintNft = async (): Promise<string | null> => {
    return null;
};

export const AutoAirdrop = async (publicKey: PublicKey, func?: () => void) => {
    const getBal = await getBalance(publicKey);
    const converNumber = Number(getBal) / LAMPORTS_PER_SOL;
    if (converNumber < 2 && ENUM_envName.production !== ENV) {
        const getResult = await AirDropAccount(publicKey); // default (it depend on env)
        ENUM_envName.local === ENV && (await AirDropAccount(publicKey, ENUM_envName.dev)); // in case local, also airdrop to devnet

        const getErr = getResult.value.err;
        if (!getErr) {
            func && func();
        }
    }
};
