import { PublicKey, Keypair } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';

import { getCookie, ListCookieStorageName } from '_utils/cookieStorage';
import { getProgram, getProvider, getConfig } from '_config';

import idl from '_config/idl.json';

export const programID = new PublicKey(idl.metadata.address);

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

export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const CANDY_MACHINE_PROGRAM = new web3.PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');

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
