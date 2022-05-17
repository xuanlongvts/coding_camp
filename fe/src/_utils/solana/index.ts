import { web3 } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Wallet } from '@project-serum/anchor';
import * as ipfsClient from 'ipfs-http-client';

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
