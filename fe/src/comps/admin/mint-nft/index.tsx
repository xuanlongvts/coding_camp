import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getConfig from 'next/config';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3, Wallet, Program, BN, AnchorProvider } from '@project-serum/anchor';
import { Commitment, PublicKey, Transaction } from '@solana/web3.js';
import {
    MintLayout,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    createMintToInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    MINT_SIZE,
} from '@solana/spl-token';

import { getMetadata, getMasterEdition, TOKEN_METADATA_PROGRAM_ID, CANDY_MACHINE_PROGRAM } from '_utils/solana';
import { appToastActions } from '_commComp/toast/slice';
import ENV, { Conn, SOLANA_PROTOCOLS, getProgram } from '_config';

const MintNftComp = () => {
    const wallet = useWallet();
    const dispatch = useDispatch();

    const anchorWallet = useMemo(() => {
        if (!wallet || !wallet.publicKey || !wallet.signAllTransactions || !wallet.signTransaction) {
            return;
        }

        return {
            publicKey: wallet.publicKey,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction,
        } as Wallet;
    }, [wallet]);

    const hanldeMintNft = async () => {};

    return (
        <div>
            <button onClick={hanldeMintNft}>Mint NFT to </button>
        </div>
    );
};

export default MintNftComp;
