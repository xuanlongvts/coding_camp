import { web3, Wallet, Program, BN, AnchorProvider } from '@project-serum/anchor';
import { Commitment, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { MintLayout, TOKEN_PROGRAM_ID, createInitializeMintInstruction, createMintToInstruction } from '@solana/spl-token';

import ENV, { Conn, Config, SOLANA_PROTOCOLS, getProvider, getConfig, getProgram } from '_config';

// import { sendTransactions, SequenceType } from './connection';

export const CANDY_MACHINE_PROGRAM = new web3.PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');
export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: web3.PublicKey,
    payer: web3.PublicKey,
    walletAddress: web3.PublicKey,
    splTokenMintAddress: web3.PublicKey,
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new web3.TransactionInstruction({
        keys,
        programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        data: Buffer.from([]),
    });
};

export const getAtaForMint = async (mint: web3.PublicKey, buyer: web3.PublicKey): Promise<[web3.PublicKey, number]> => {
    return await web3.PublicKey.findProgramAddress(
        [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    );
};

export const getTokenWallet = async (wallet: web3.PublicKey, mint: web3.PublicKey) => {
    return (
        await web3.PublicKey.findProgramAddress(
            [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
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

export const getMetadata = async (mint: web3.PublicKey): Promise<web3.PublicKey> => {
    return (
        await web3.PublicKey.findProgramAddress(
            [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            TOKEN_METADATA_PROGRAM_ID,
        )
    )[0];
};

export const getCandyMachineId = (): web3.PublicKey | undefined => {
    try {
        const candyMachineId = new web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);

        return candyMachineId;
    } catch (e) {
        console.log('Failed to construct CandyMachineId', e);
        return undefined;
    }
};

interface CandyMachineState {
    authority: web3.PublicKey;
    itemsAvailable: number;
    itemsRedeemed: number;
    itemsRemaining: number;
    treasury: web3.PublicKey;
    tokenMint: null | web3.PublicKey;
    isSoldOut: boolean;
    isActive: boolean;
    isPresale: boolean;
    isWhitelistOnly: boolean;
    goLiveDate: BN;
    price: BN;
    gatekeeper: null | {
        expireOnUse: boolean;
        gatekeeperNetwork: web3.PublicKey;
    };
    endSettings: null | {
        number: BN;
        endSettingType: any;
    };
    whitelistMintSettings: null | {
        mode: any;
        mint: web3.PublicKey;
        presale: boolean;
        discountPrice: null | BN;
    };
    hiddenSettings: null | {
        name: string;
        uri: string;
        hash: Uint8Array;
    };
    retainAuthority: boolean;
}

export interface CandyMachineAccount {
    id: web3.PublicKey;
    program: Program;
    state: CandyMachineState;
}
export const getCandyMachineState = async (
    anchorWallet: Wallet,
    candyMachineId: web3.PublicKey,
    optsParam: Commitment = 'confirmed',
): Promise<CandyMachineAccount> => {
    const getConn = Conn(ENV, SOLANA_PROTOCOLS.METAPLEX, optsParam);
    const provider = new AnchorProvider(getConn, anchorWallet, {
        preflightCommitment: 'processed',
    });
    const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
    const program = getProgram(idl!, CANDY_MACHINE_PROGRAM, provider);

    const state: any = await program.account.candyMachine.fetch(candyMachineId);
    const itemsAvailable = state.data.itemsAvailable.toNumber();
    const itemsRedeemed = state.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;

    return {
        id: candyMachineId,
        program,
        state: {
            authority: state.authority,
            itemsAvailable,
            itemsRedeemed,
            itemsRemaining,
            isSoldOut: itemsRemaining === 0,
            isActive: false,
            isPresale: false,
            isWhitelistOnly: false,
            goLiveDate: state.data.goLiveDate,
            treasury: state.wallet,
            tokenMint: state.tokenMint,
            gatekeeper: state.data.gatekeeper,
            endSettings: state.data.endSettings,
            whitelistMintSettings: state.data.whitelistMintSettings,
            hiddenSettings: state.data.hiddenSettings,
            price: state.data.price,
            retainAuthority: state.data.retainAuthority,
        },
    };
};

// export type SetupState = {
//     mint: web3.Keypair;
//     userTokenAccount: web3.PublicKey;
//     transaction: string;
// };

// export const createAccountsForMint = async (candyMachine: CandyMachineAccount, payer: web3.PublicKey): Promise<SetupState> => {
//     const mint = web3.Keypair.generate();
//     const userTokenAccountAddress = (await getAtaForMint(mint.publicKey, payer))[0];

//     const signers: web3.Keypair[] = [mint];
//     const instructions = [
//         web3.SystemProgram.createAccount({
//             fromPubkey: payer,
//             newAccountPubkey: mint.publicKey,
//             space: MintLayout.span,
//             lamports: await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(MintLayout.span),
//             programId: TOKEN_PROGRAM_ID,
//         }),
//         createInitializeMintInstruction(mint.publicKey, 0, payer, payer, TOKEN_PROGRAM_ID),
//         createAssociatedTokenAccountInstruction(userTokenAccountAddress, payer, payer, mint.publicKey),
//         createMintToInstruction(mint.publicKey, userTokenAccountAddress, payer, 1, [], TOKEN_PROGRAM_ID),
//     ];

//     return {
//         mint: mint,
//         userTokenAccount: userTokenAccountAddress,
//         transaction: (
//             await sendTransactions(
//                 candyMachine.program.provider.connection,
//                 candyMachine.program.provider.wallet,
//                 [instructions],
//                 [signers],
//                 SequenceType.StopOnFailure,
//                 'singleGossip',
//                 () => {},
//                 () => false,
//                 undefined,
//                 [],
//                 [],
//             )
//         ).txs[0].txid,
//     };
// };
