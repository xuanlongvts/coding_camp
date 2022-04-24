import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { expect } from "chai";

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
        // console.log("Add: ===> ", accState.listProducts);
        expect(accState.listProducts.length).to.equal(3);
    });

    it("Update one product!", async () => {
        await program.methods
            .updateOneProduct(updateOneProduct)
            .accounts({
                baseAccount: baseAcc.publicKey,
            })
            .rpc();
        const accState = await program.account.products.fetch(
            baseAcc.publicKey
        );
        // console.log("Update: ===> ", accState.listProducts);
        expect(accState.listProducts[1].price).to.equal(
            Number(updateOneProduct.price)
        );
        expect(accState.listProducts[1].imgs.links.length).to.equal(2);
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
        console.log("Delete: ===> ", accState.listProducts);
    });
});
