const fs = require('fs');
const anchor = require('@project-serum/anchor');

const account = anchor.web3.Keypair.generate();

fs.writeFileSync('./keypair__.json', JSON.stringify(account));
