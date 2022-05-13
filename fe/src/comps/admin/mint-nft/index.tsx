import { useEffect, useMemo, useCallback } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';
import { web3, Wallet, Program, BN, AnchorProvider } from '@project-serum/anchor';
import { Commitment, PublicKey, Transaction } from '@solana/web3.js';
import getConfig from 'next/config';

import { getCandyMachineState } from '_utils/solana';

const { publicRuntimeConfig } = getConfig();

const MintNftComp = () => {
    const wallet = useWallet();

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

    const refreshCandyMachineState = useCallback(async (commitment: Commitment = 'confirmed') => {
        if (!anchorWallet) {
            return;
        }

        if (publicRuntimeConfig.CANDY_MACHINE_ID) {
            try {
                const cndy = await getCandyMachineState(anchorWallet, publicRuntimeConfig.CANDY_MACHINE_ID);
            } catch (err) {}
        }
    }, []);

    useEffect(() => {
        (function loop() {
            setTimeout(() => {
                refreshCandyMachineState();
                loop();
            }, 20000);
        })();
    }, [refreshCandyMachineState]);

    const hanldeMintNft = () => {
        console.log('hanldeMintNft', publicRuntimeConfig.CANDY_MACHINE_ID);
    };

    return (
        <div>
            <button onClick={hanldeMintNft}>Mint NFT to </button>
        </div>
    );
};

export default MintNftComp;
