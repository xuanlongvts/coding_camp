import * as anchor from "@project-serum/anchor";

export const baseAcc = anchor.web3.Keypair.generate();

export const products = [
    {
        id: "abc",
        title: "Iphone 15",
        imgs: {
            links: ["http://abc.com/abc.png"],
        },
        price: new anchor.BN(3),
        description: "Iphone 15 will release at 2024",
        tips: [],
        owner: baseAcc.publicKey,
    },
    {
        id: "edf",
        title: "Macbook Pro M2",
        imgs: {
            links: ["http://abc.com/edf.png"],
        },
        price: new anchor.BN(5),
        description: "Macbook Pro M2 will release at 2024",
        tips: [],
        owner: baseAcc.publicKey,
    },
];

export const addOneProduct = {
    id: "ikl",
    title: "Mouse magic",
    imgs: {
        links: ["http://abc.com/ikl.png"],
    },
    price: new anchor.BN(1),
    description: "Mouse magic will release at 2024",
    tips: [],
    owner: baseAcc.publicKey,
};

export const updateOneProduct = {
    id: "edf",
    title: "Macbook Pro M2",
    imgs: {
        links: ["http://abc.com/edf.png", "http://abc.com/edf_new.png"],
    },
    price: new anchor.BN(99),
    description: "Macbook Pro M2 will release at 2025",
    tips: [],
    owner: baseAcc.publicKey,
};

export const deleteOneProduct = {
    id: "edf",
};
