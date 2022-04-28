export type ScLuxuryBrand = {
    version: '0.1.0';
    name: 'sc_luxury_brand';
    instructions: [
        {
            name: 'initialize';
            accounts: [
                {
                    name: 'baseAccount';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
            ];
            args: [
                {
                    name: 'products';
                    type: {
                        vec: {
                            defined: 'Product';
                        };
                    };
                },
            ];
            returns: null;
        },
        {
            name: 'addOneProduct';
            accounts: [
                {
                    name: 'baseAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
            ];
            args: [
                {
                    name: 'product';
                    type: {
                        defined: 'Product';
                    };
                },
            ];
            returns: null;
        },
        {
            name: 'updateOneProduct';
            accounts: [
                {
                    name: 'baseAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
            ];
            args: [
                {
                    name: 'product';
                    type: {
                        defined: 'Product';
                    };
                },
            ];
            returns: null;
        },
        {
            name: 'deleteOneProduct';
            accounts: [
                {
                    name: 'baseAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'signer';
                    isMut: true;
                    isSigner: true;
                },
            ];
            args: [
                {
                    name: 'id';
                    type: 'string';
                },
            ];
            returns: null;
        },
    ];
    accounts: [
        {
            name: 'products';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'listProducts';
                        type: {
                            vec: {
                                defined: 'Product';
                            };
                        };
                    },
                ];
            };
        },
    ];
    types: [
        {
            name: 'Unit';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'sol';
                        type: 'f32';
                    },
                    {
                        name: 'usdc';
                        type: 'u8';
                    },
                ];
            };
        },
        {
            name: 'CustomerTips';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'userPubkey';
                        type: 'publicKey';
                    },
                    {
                        name: 'counts';
                        type: 'u8';
                    },
                    {
                        name: 'unit';
                        type: {
                            defined: 'Unit';
                        };
                    },
                ];
            };
        },
        {
            name: 'Imgs';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'links';
                        type: {
                            vec: 'string';
                        };
                    },
                ];
            };
        },
        {
            name: 'Product';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'id';
                        type: 'string';
                    },
                    {
                        name: 'title';
                        type: 'string';
                    },
                    {
                        name: 'imgs';
                        type: {
                            defined: 'Imgs';
                        };
                    },
                    {
                        name: 'price';
                        type: 'u8';
                    },
                    {
                        name: 'description';
                        type: 'string';
                    },
                    {
                        name: 'tips';
                        type: {
                            vec: {
                                defined: 'CustomerTips';
                            };
                        };
                    },
                    {
                        name: 'owner';
                        type: 'publicKey';
                    },
                ];
            };
        },
    ];
};

export const IDL: ScLuxuryBrand = {
    version: '0.1.0',
    name: 'sc_luxury_brand',
    instructions: [
        {
            name: 'initialize',
            accounts: [
                {
                    name: 'baseAccount',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'products',
                    type: {
                        vec: {
                            defined: 'Product',
                        },
                    },
                },
            ],
            returns: null,
        },
        {
            name: 'addOneProduct',
            accounts: [
                {
                    name: 'baseAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: 'product',
                    type: {
                        defined: 'Product',
                    },
                },
            ],
            returns: null,
        },
        {
            name: 'updateOneProduct',
            accounts: [
                {
                    name: 'baseAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: 'product',
                    type: {
                        defined: 'Product',
                    },
                },
            ],
            returns: null,
        },
        {
            name: 'deleteOneProduct',
            accounts: [
                {
                    name: 'baseAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'signer',
                    isMut: true,
                    isSigner: true,
                },
            ],
            args: [
                {
                    name: 'id',
                    type: 'string',
                },
            ],
            returns: null,
        },
    ],
    accounts: [
        {
            name: 'products',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'listProducts',
                        type: {
                            vec: {
                                defined: 'Product',
                            },
                        },
                    },
                ],
            },
        },
    ],
    types: [
        {
            name: 'Unit',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'sol',
                        type: 'f32',
                    },
                    {
                        name: 'usdc',
                        type: 'u8',
                    },
                ],
            },
        },
        {
            name: 'CustomerTips',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'userPubkey',
                        type: 'publicKey',
                    },
                    {
                        name: 'counts',
                        type: 'u8',
                    },
                    {
                        name: 'unit',
                        type: {
                            defined: 'Unit',
                        },
                    },
                ],
            },
        },
        {
            name: 'Imgs',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'links',
                        type: {
                            vec: 'string',
                        },
                    },
                ],
            },
        },
        {
            name: 'Product',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'id',
                        type: 'string',
                    },
                    {
                        name: 'title',
                        type: 'string',
                    },
                    {
                        name: 'imgs',
                        type: {
                            defined: 'Imgs',
                        },
                    },
                    {
                        name: 'price',
                        type: 'u8',
                    },
                    {
                        name: 'description',
                        type: 'string',
                    },
                    {
                        name: 'tips',
                        type: {
                            vec: {
                                defined: 'CustomerTips',
                            },
                        },
                    },
                    {
                        name: 'owner',
                        type: 'publicKey',
                    },
                ],
            },
        },
    ],
};
