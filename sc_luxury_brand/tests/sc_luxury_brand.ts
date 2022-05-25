import * as anchor from "@project-serum/anchor";
import { Program, AnchorError, Wallet } from "@project-serum/anchor";
import {
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createInitializeMintInstruction,
    MINT_SIZE,
} from "@solana/spl-token";
import chai, { expect } from "chai";

import { ScLuxuryBrand } from "../target/types/sc_luxury_brand";
import {
    baseAcc,
    products,
    addOneProduct,
    addMultiProducts,
    updateOneProduct,
    deleteOneProduct,
    TOKEN_METADATA_PROGRAM_ID,
    getMetadata,
    getMasterEdition,
    nftProps,
} from "./consts";

describe("sc_luxury_brand", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.ScLuxuryBrand as Program<ScLuxuryBrand>;
    const wallet = provider.wallet as Wallet;

    before(async () => {
        await program.methods
            .initialize(products)
            .accounts({
                baseAccount: baseAcc.publicKey,
            })
            .signers([baseAcc])
            .rpc();
    });

    it("Is initialized!", async () => {
        const accState = await program.account.products.fetch(
            baseAcc.publicKey
        );
        expect(accState.listProducts?.length).to.equal(2);

        console.log("length: ", accState.listProducts.length);

        try {
            await program.methods
                .initialize(products)
                .accounts({
                    baseAccount: baseAcc.publicKey,
                })
                .signers([baseAcc])
                .rpc();
            chai.assert(
                false,
                "Should've failed but din't. The products had initial"
            );
        } catch (_err) {
            console.log("_err: ---> ", _err.logs);
        }
    });

    it("Add multi products!", async () => {
        await program.methods
            .addMultiProducts(addMultiProducts)
            .accounts({
                baseAccount: baseAcc.publicKey,
            })
            .rpc();
        const accState = await program.account.products.fetch(
            baseAcc.publicKey
        );
        expect(accState.listProducts.length).to.equal(5);
    });

    it("Add one product!", async () => {
        await program.methods
            .addOneProduct(addOneProduct)
            .accounts({
                baseAccount: baseAcc.publicKey,
            })
            .rpc();
        const accState = await program.account.products.fetch(
            baseAcc.publicKey
        );
        expect(accState.listProducts.length).to.equal(6);

        try {
            await program.methods
                .addOneProduct(addOneProduct)
                .accounts({
                    baseAccount: baseAcc.publicKey,
                })
                .rpc();
            chai.assert(false, "Should've failed but din't.");
        } catch (_err) {
            expect(_err).to.be.instanceOf(AnchorError);
            const err: AnchorError = _err;
            expect(err.error.errorCode.code).to.equal("AlreadyExistProduct");
            expect(err.error.errorCode.number).to.equal(6002);
        }
    });

    it("Update one product!", async () => {
        await program.methods
            .updateOneProduct(updateOneProduct())
            .accounts({
                baseAccount: baseAcc.publicKey,
            })
            .rpc();
        const accState = await program.account.products.fetch(
            baseAcc.publicKey
        );
        expect(accState.listProducts[1].price).to.equal(
            Number(updateOneProduct().price)
        );
        // expect(accState.listProducts[1].imgs.links.length).to.equal(2);

        try {
            await program.methods
                .updateOneProduct(updateOneProduct("edf_error"))
                .accounts({
                    baseAccount: baseAcc.publicKey,
                })
                .rpc();
            chai.assert(false, "Should've failed but din't.");
        } catch (_err) {
            expect(_err).to.be.instanceOf(AnchorError);
            const err: AnchorError = _err;
            expect(err.error.errorCode.code).to.equal("NotFoundProduct");
            expect(err.error.errorCode.number).to.equal(6000);
        }
    });

    it("Delete one product!", async () => {
        await program.methods
            .deleteOneProduct(deleteOneProduct.id)
            .accounts({
                baseAccount: baseAcc.publicKey,
            })
            .rpc();
        const accState = await program.account.products.fetch(
            baseAcc.publicKey
        );
        expect(accState.listProducts.length).to.equal(5);
        // console.log("Delete: ===> ", accState.listProducts);

        try {
            await program.methods
                .deleteOneProduct(deleteOneProduct.id_error)
                .accounts({
                    baseAccount: baseAcc.publicKey,
                })
                .rpc();
            chai.assert(false, "Should've failed but din't.");
        } catch (_err) {
            expect(_err).to.be.instanceOf(AnchorError);
            const err: AnchorError = _err;
            expect(err.error.errorCode.code).to.equal("NotFoundProduct");
            expect(err.error.errorCode.number).to.equal(6000);
        }
    });

    it("Mint Nft!", async () => {
        const lamports: number =
            await program.provider.connection.getMinimumBalanceForRentExemption(
                MINT_SIZE
            );
        const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();
        const NftTokenAccount = await getAssociatedTokenAddress(
            mintKey.publicKey,
            wallet.publicKey
        );
        const mint_tx = new anchor.web3.Transaction().add(
            anchor.web3.SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKey.publicKey,
                space: MINT_SIZE,
                programId: TOKEN_PROGRAM_ID,
                lamports,
            }),
            createInitializeMintInstruction(
                mintKey.publicKey,
                0,
                wallet.publicKey,
                wallet.publicKey
            ),
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                NftTokenAccount,
                wallet.publicKey,
                mintKey.publicKey
            )
        );
        await program.provider.sendAndConfirm(mint_tx, [mintKey]);
        // console.log(
        //     await program.provider.connection.getParsedAccountInfo(
        //         mintKey.publicKey
        //     )
        // );

        const metadataAddress = await getMetadata(mintKey.publicKey);
        const masterEdition = await getMasterEdition(mintKey.publicKey);

        const tx = await program.methods
            .mintNft(
                mintKey.publicKey,
                nftProps.title,
                nftProps.symbol,
                nftProps.uri
            )
            .accounts({
                mintAuthority: wallet.publicKey,
                mint: mintKey.publicKey,
                tokenAccount: NftTokenAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                metadata: metadataAddress,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                payer: wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                masterEdition: masterEdition,
            })
            .rpc();
        console.log("Tx mint nft: ---> ", tx);
    });
});
