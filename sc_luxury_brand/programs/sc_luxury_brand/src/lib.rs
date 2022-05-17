use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token;
use anchor_spl::token::{MintTo, Token};
use mpl_token_metadata::instruction::{create_master_edition_v3, create_metadata_accounts_v2};
use mpl_token_metadata::state::Creator;

declare_id!("3t8JWHNXK9Sp7ZWPtBYD8xomhuLgzCmg1hVmLMsqzXyC");

#[program]
pub mod sc_luxury_brand {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, products: Vec<Product>) -> Result<()> {
        let base_acc = &mut ctx.accounts.base_account;

        base_acc.list_products = products;
        Ok(())
    }

    pub fn add_one_product(ctx: Context<CrudOneProduct>, product: Product) -> Result<()> {
        let base_acc = &mut ctx.accounts.base_account;

        let find_index_prod = base_acc
            .list_products
            .iter()
            .position(|item| item.id == product.id); // Make sure not the same id product

        if find_index_prod == None {
            base_acc.list_products.push(product);
        } else {
            return Err(ErrorMess::AlreadyExistProduct.into());
        }

        Ok(())
    }

    pub fn update_one_product(ctx: Context<CrudOneProduct>, product: Product) -> Result<()> {
        let base_acc = &mut ctx.accounts.base_account;

        let find_index_prod = base_acc
            .list_products
            .iter()
            .position(|item| item.id == product.id); // Make sure exist the id product and can update information

        if find_index_prod != None {
            let get_id = find_index_prod.unwrap();
            // base_acc.list_products[get_id] = product;
            base_acc.list_products[get_id].title = product.title;
            base_acc.list_products[get_id].imgs = product.imgs;
            base_acc.list_products[get_id].price = product.price;
            base_acc.list_products[get_id].description = product.description;
            base_acc.list_products[get_id].owner = product.owner;
        } else {
            return Err(ErrorMess::NotFoundProduct.into());
        }

        Ok(())
    }

    pub fn delete_one_product(ctx: Context<CrudOneProduct>, id: String) -> Result<()> {
        let base_acc = &mut ctx.accounts.base_account;

        let find_index_prod = base_acc.list_products.iter().position(|item| item.id == id);
        if find_index_prod != None {
            let get_id = find_index_prod.unwrap();
            base_acc.list_products.remove(get_id);
        } else {
            return Err(ErrorMess::NotFoundProduct.into());
        }

        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNft>,
        creator_key: Pubkey,
        title: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        let result_mint_token = token::mint_to(cpi_ctx, 1);
        if let Err(_) = result_mint_token {
            return Err(ErrorMess::MintFailed.into());
        }

        let account_info = vec![
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ]; // Account Info Assigned
        let creators = vec![
            Creator {
                address: creator_key,
                verified: false,
                share: 100,
            },
            Creator {
                address: ctx.accounts.mint_authority.key(),
                verified: false,
                share: 0,
            },
        ]; // Creator Assigned
        let instruction = create_metadata_accounts_v2(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            title,
            symbol,
            uri,
            Some(creators),
            1,
            true,
            false,
            None,
            None,
        );
        let result_meta_acc_create = invoke(&instruction, &account_info);
        if let Err(_) = result_meta_acc_create {
            return Err(ErrorMess::MetadataCreateFailed.into());
        }

        let master_edition_infos = vec![
            ctx.accounts.master_edition.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ]; // Master Edition Account Infos Assigned
        let instruction = create_master_edition_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.master_edition.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.payer.key(),
            Some(0),
        );
        let result_master_edition_mint = invoke(&instruction, &master_edition_infos);
        if let Err(_) = result_master_edition_mint {
            return Err(ErrorMess::MasterEditinNftMintFailed.into());
        }

        Ok(())
    }
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Unit {
    sol: f32,
    usdc: u8,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct CustomerTips {
    pub user_pubkey: Pubkey,
    pub counts: u8,
    pub unit: Unit,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Imgs {
    links: Vec<String>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Product {
    pub id: String,
    pub title: String,
    pub imgs: Imgs, // Imgs
    pub price: u8,
    pub description: String,
    pub tips: Vec<CustomerTips>,
    pub owner: Pubkey, // Account receive tip from customer on itself product
}

#[account]
pub struct Products {
    pub list_products: Vec<Product>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 5000)]
    pub base_account: Account<'info, Products>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CrudOneProduct<'info> {
    #[account(mut)]
    pub base_account: Account<'info, Products>,
}

#[error_code]
pub enum ErrorMess {
    // Products Errors
    #[msg("The product not exist")]
    NotFoundProduct,
    #[msg("The products already initial")]
    AlreadyInitProducts,
    #[msg("The product already exist")]
    AlreadyExistProduct,

    // NFT Errors
    #[msg("Mint failed!")]
    MintFailed,
    #[msg("Metadata account create failed!")]
    MetadataCreateFailed,
    #[msg("Master edition nft mint failed!")]
    MasterEditinNftMintFailed,
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub mint_authority: Signer<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_metadata_program: UncheckedAccount<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub payer: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub rent: AccountInfo<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
}
