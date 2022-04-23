import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ScLuxuryBrand } from "../target/types/sc_luxury_brand";

describe("sc_luxury_brand", () => {
    const provider = anchor.AnchorProvider.env();

    anchor.setProvider(provider);

    const program = anchor.workspace.ScLuxuryBrand as Program<ScLuxuryBrand>;

    it("Is initialized!", async () => {
        // Add your test here.
        const tx = await program.methods.initialize().rpc();
        console.log("Your transaction signature", tx);
    });
});
