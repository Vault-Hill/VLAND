# VLAND

VLAND is the native ERC-721 token that represent virtual plots of land within the Vault Hill metaverse.

## Installation

```bash
npm install
```

## Usage

Run the following `ganache-cli` command to generate deterministic addresses based on a pre-defined mnemonic. This will allow you to connect to a locally running blockchain and deploy the contracts onto it.

```bash
npx ganache-cli --deterministic
```
Copy the local blockchains address and add it to your `truffle-config.js` file. It should be `127.0.0.1:8545` by default

To run the migrations run the following command, replacing the admin address with an address printed out from running the  previous command (ideally the first address, or deployers).

```
npx truffle migrate --admin "<ADMIN_ADDRESS"> --network development`
```
From there you can interact with the contract via the truffle console.

```
npx truffle console --network development
```

See https://www.trufflesuite.com/docs/truffle/reference/truffle-commands

## Testing

Spin up a local blockchain using ganache-cli - `npx ganache-cli --deterministic`.

Run the following command, replacing the admin address with the first account address logged out from the ganache-cli - `npx truffle test --admin "<ADMIN_ADDRESS>"`.

## License
[MIT](https://choosealicense.com/licenses/mit/)