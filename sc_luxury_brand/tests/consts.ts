import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export const baseAcc = anchor.web3.Keypair.generate();

type T_Unit = {
    sol: number;
    usdc: number;
};

type T_CustomerTips = {
    user_pubkey: string;
    counts: number;
    unit: T_Unit;
};

export type T_PRODUCT = {
    id: string;
    title: string;
    imgs: {
        links: string[];
    };
    price: number;
    description: string;
    tips?: T_CustomerTips[];
    owner: PublicKey;
};

export const products: T_PRODUCT[] = [
    {
        id: "abc",
        title: "Iphone 15",
        imgs: {
            links: [
                "https://media0.giphy.com/media/3o85xnHXDgKM21daPm/giphy.gif?cid=ecf05e47hysarrfjl2jx4xxbmr91qgkphkobhjn3bzr6ov27&rid=giphy.gif&ct=g",
            ],
        },
        // imgs: "https://media0.giphy.com/media/3o85xnHXDgKM21daPm/giphy.gif?cid=ecf05e47hysarrfjl2jx4xxbmr91qgkphkobhjn3bzr6ov27&rid=giphy.gif&ct=g",
        price: 3,
        description: "Iphone 15 will release at 2024",
        tips: [],
        owner: baseAcc.publicKey,
    },
    {
        id: "edf",
        title: "Macbook Pro M2",
        imgs: {
            links: [
                "https://media4.giphy.com/media/l2JhBGQsSk3JnG1vW/giphy.gif?cid=ecf05e475elwxakg045lmax1mzz1bsi6izt0pwrgrywzd9t1&rid=giphy.gif&ct=g",
            ],
        },
        // imgs: "https://media4.giphy.com/media/l2JhBGQsSk3JnG1vW/giphy.gif?cid=ecf05e475elwxakg045lmax1mzz1bsi6izt0pwrgrywzd9t1&rid=giphy.gif&ct=g",
        price: 5,
        description: "Macbook Pro M2 will release at 2024",
        tips: [],
        owner: baseAcc.publicKey,
    },
];

export const addOneProduct: T_PRODUCT = {
    id: "ikl", // ikl
    title: "Mouse magic",
    imgs: {
        links: [
            "https://media1.giphy.com/media/SeEFlR2ixjeUjqcc1N/giphy.gif?cid=ecf05e47y3etf4fir080z47cvrcqvxb1jjwy1pccfqnet9z6&rid=giphy.gif&ct=g",
        ],
    },
    // imgs: "https://media1.giphy.com/media/SeEFlR2ixjeUjqcc1N/giphy.gif?cid=ecf05e47y3etf4fir080z47cvrcqvxb1jjwy1pccfqnet9z6&rid=giphy.gif&ct=g",
    price: 1,
    description: "Mouse magic will release at 2024",
    tips: [],
    owner: baseAcc.publicKey,
};

export const updateOneProduct = (id?: string) => ({
    id: id || products[1].id, // "edf"
    title: "Macbook Pro M2",
    imgs: {
        links: [
            "https://media0.giphy.com/media/3o6ZsY8LmkA0CDQv1S/giphy.gif?cid=790b7611aef8181bae0cf2fa4e11efcfa882af40b8c85fe0&rid=giphy.gif&ct=g",
            "https://media3.giphy.com/media/3o7TKRiAXqGIJFtdfy/giphy.gif?cid=ecf05e47vq37hnywwxqg3w37yog1krznkgip9leycplvad5x&rid=giphy.gif&ct=g",
        ],
    },
    // imgs: "https://media3.giphy.com/media/3o7TKRiAXqGIJFtdfy/giphy.gif?cid=ecf05e47vq37hnywwxqg3w37yog1krznkgip9leycplvad5x&rid=giphy.gif&ct=g",
    price: 99,
    description: "Macbook Pro M2 will release at 2025",
    tips: [],
    owner: baseAcc.publicKey,
});

export const deleteOneProduct = {
    id: "edf",
    id_error: "edf_error",
};
