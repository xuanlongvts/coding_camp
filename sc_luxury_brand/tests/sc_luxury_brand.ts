import * as anchor from "@project-serum/anchor";
import { Program, AnchorError } from "@project-serum/anchor";
import chai, { expect } from "chai";

import { ScLuxuryBrand } from "../target/types/sc_luxury_brand";
import {
    baseAcc,
    products,
    addOneProduct,
    updateOneProduct,
    deleteOneProduct,
} from "./consts";

describe("sc_luxury_brand", () => {
    const provider = anchor.AnchorProvider.env();

    anchor.setProvider(provider);

    const program = anchor.workspace.ScLuxuryBrand as Program<ScLuxuryBrand>;

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
        expect(accState.listProducts.length).to.equal(2);

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
        expect(accState.listProducts.length).to.equal(3);

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
        expect(accState.listProducts.length).to.equal(2);
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
});
