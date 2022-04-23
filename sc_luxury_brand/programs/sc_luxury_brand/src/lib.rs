use std::collections::HashMap;

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod sc_luxury_brand {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Unit {
    sol: f32,
    usdc: u8,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Tips {
    pub counts: u8,
    pub unit: Unit,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Product {
    pub title: String,
    pub imgs: {
        links: Vec<String>
    },
    pub price: u8,
    pub description: String,
    // pub tips: {
    //     user_pubkey: Tips // HashMap, use Pubkey make user_pubkey (for aim index and update)
    // }
    pub tips: HashMap<Pubkey, Tips>
}

#[account]
pub struct Products {
    pub lists: Vec<Product>,
    pub owner: Pubkey,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 9000)]
    pub base_account: Account<'info, Products>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
