use anchor_lang::prelude::*;

declare_id!("3t8JWHNXK9Sp7ZWPtBYD8xomhuLgzCmg1hVmLMsqzXyC");

#[program]
pub mod sc_luxury_brand {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, products: Vec<Product>) -> Result<()> {
        let base_acc = &mut ctx.accounts.base_account;

        // let item = Product {
        //         id: products[0].id.to_string(),
        //         title: products[0].title.to_string(),
        //         imgs: Imgs {
        //             links: products[0].imgs.links.to_vec()
        //         },
        //         price: products[0].price,
        //         description: products[0].description.to_string(),
        //         tips: Vec::new(),
        //         owner: products[0].owner,
        //     };

        // base_acc.list_products = products;
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
            // let item = Product {
            //     id: product.id.to_string(),
            //     title: product.title.to_string(),
            //     imgs: Imgs {
            //         links: Vec::from(product.imgs.links)
            //     },
            //     price: product.price,
            //     description: product.description.to_string(),
            //     tips: Vec::new(),
            //     owner: product.owner,
            // };
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
            base_acc.list_products[get_id] = product;
        } else  {
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
        } else  {
            return Err(ErrorMess::NotFoundProduct.into());
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
    #[msg("The product not exist")]
    NotFoundProduct,
    #[msg("The products already initial")]
    AlreadyInitProducts,
    #[msg("The product already exist")]
    AlreadyExistProduct
}
