import * as anchor from '@project-serum/anchor';

import { T_PRODUCT } from 'comps/01-home/products/type';
import { getKeypairDemo } from '_services/solana';
import { WalletRecipient_1 } from '_config';

const ownerPubkey = new anchor.web3.PublicKey(WalletRecipient_1);

export const productsInit: T_PRODUCT[] = [
    {
        id: 'abc',
        title: 'Magic Keyboard',
        imgs: {
            links: [
                'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MMMR3?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1645719947833',
            ],
        },
        price: 1,
        description: 'Magic Keyboard is available with Touch ID, providing fast, easy, and secure authentication for logins and purchases.',
        tips: [],
        owner: ownerPubkey,
    },
    {
        id: 'def',
        title: 'Apple M1 MacBook Pro',
        imgs: {
            links: ['https://www.apple.com/v/macbook-pro/ac/images/overview/hero_14_16__bux8byft94oi_large_2x.jpg'],
        },
        price: 2,
        description: 'Apple M1 Chip with 8‑Core CPU and 8‑Core GPU 256GB SSD Storage¹',
        tips: [],
        owner: ownerPubkey,
    },
    {
        id: 'ghk',
        title: '24” iMac',
        imgs: {
            links: ['https://www.apple.com/v/imac-24/e/images/overview/routers/environment__em2kqpmluqmq_large_2x.png'],
        },
        price: 3,
        description: '512GB storage¹ 8GB unified memory 24-inch 4.5K Retina display² Two Thunderbolt / USB 4 ports',
        tips: [],
        owner: ownerPubkey,
    },
];

export const productsAddMore: T_PRODUCT[] = [
    {
        id: 'ijk',
        title: 'Mac Pro',
        imgs: {
            links: [
                'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-pro-rack-2021-gallery2?wid=4000&hei=2544&fmt=jpeg&qlt=90&.v=1626378548000',
            ],
        },
        price: 4,
        description: '3.5GHz 8‑core Intel Xeon W processor, Turbo Boost up to 4.0GHz 32GB (4x8GB) of DDR4 ECC memory',
        tips: [],
        owner: ownerPubkey,
    },
    {
        id: 'lmn',
        title: 'Iphone 13 Pro',
        imgs: {
            links: ['https://www.apple.com/v/iphone-13-pro/f/images/overview/design/water_resistant__ddhg6jxs53yq_large_2x.jpg'],
        },
        price: 3,
        description: 'A dramatically more powerful camera system. A display so responsive, every interaction feels new again.',
        tips: [],
        owner: ownerPubkey,
    },
    {
        id: 'ikl',
        title: 'iPad Pro',
        imgs: {
            links: [
                'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-11-select-202104?wid=1090&hei=1100&fmt=jpeg&qlt=90&.v=1617067380000',
            ],
        },
        price: 3,
        description:
            'Two sizes. Two industry-leading displays.The 11-inch display gives you an immersive and portable experience. And the 12.9-inch XDR display is a stunning and expansive way to view HDR content.',
        tips: [],
        owner: ownerPubkey,
    },
];
