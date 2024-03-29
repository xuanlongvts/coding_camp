import { PublicKey, Keypair } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';
import { Base64 } from 'js-base64';

import { getCookie, ListCookieStorageName } from '_utils/cookieStorage';
import { getProgram } from '_config';

import idl from '_config/idl.json';

// export const programID = new PublicKey(idl.metadata.address);
export const programID = new PublicKey('4XT394t9UT1VC56MzDgFN2nqdNTxLTSzZQVwCeoQkUSj');

export const getKeypairDemo = (): Keypair | null => {
    let getKeypairDemo = getCookie(ListCookieStorageName().KeyPairDemo);
    getKeypairDemo = getKeypairDemo && JSON.parse(Base64.decode(getKeypairDemo))._keypair.secretKey;
    let baseAccountDemo: Keypair | null = null;
    if (getKeypairDemo) {
        const arr = Object.values(getKeypairDemo);
        const secret = new Uint8Array(arr as any);
        baseAccountDemo = web3.Keypair.fromSecretKey(secret);
    }

    return baseAccountDemo;
};

export const programApp = () => getProgram(idl, programID);

export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

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
