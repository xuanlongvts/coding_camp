# Sell Luxury Brand

    1. Account tips
    	struct tips {
    		counts: u8,
    		unit: {
    			sol: f32,
    			usdc: u8
    		}
    	}

    2. Each product

        struct product {
    		title: String,
    		imgs: {
    			links: Vec<String>
    		},
    		price: u8,
    		description: String,
    		tips: {
    			user_pubkey: tips // HashMap, use Pubkey make user_pubkey (for aim index and update)
    		}
        }

    3. List products

        struct products {
    		lists: Vec<product>,
    		owner: Pubkey,
        }

    4. Accounts
    	struct BaseAccount {
    		pub base_account: Account<'info, products>,
    	}
