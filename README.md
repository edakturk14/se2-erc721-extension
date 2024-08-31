# ERC-721 Token Extension for Scaffold-ETH 2

This extension introduces an ERC-721 token contract and demonstrates how to interact with it, including minting new tokens and viewing NFTs owned by a specific address.

The ERC-721 Token Standard defines a standard for Non-Fungible Tokens (NFTs), where each token is unique and can represent a wide range of digital assets, including art, collectibles, and more.

The ERC-721 token contract is implemented using the ERC-721 token implementation from OpenZeppelin.

## Installation

You can install any of the extensions in this repository by running the following command:

```bash
npx create-eth@latest -e edakturk14/se2-erc721-extension
```

## 🚀 Setup extension

Deploy your contracts by running `yarn deploy`

## Interact with the contract

Start the front-end with `yarn start` and go to the _/nft page to interact with your deployed ERC-721 contract.

You can check the code for the UI at `packages/nextjs/app/nft/page.tsx`.
