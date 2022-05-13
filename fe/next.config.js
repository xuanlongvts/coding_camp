/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        CANDY_MACHINE_ID: process.env.REACT_APP_CANDY_MACHINE_ID,
        TREASURY_ADDRESS: process.env.REACT_APP_TREASURY_ADDRESS,
    },
    images: {
        domains: ['www.arweave.net'],
    },
};

module.exports = nextConfig;
