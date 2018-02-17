RooExchange
===========
Example dApp, build to learn. Include a ERC20 Token Contract and a simplifiyed distributed Exchange.
Based on https://github.com/tomw1808/distributed_exchange_truffle_class_3, contracts upgraded to solidity 0.4.18 and web done with React.

### Commands:
```
  Compile:              truffle compile
  Migrate:              truffle migrate
  Test contracts:       truffle test
  Test dapp:            npm test
  or:                   yarn test
  Run dev server:       npm run start
  or:                   yarn start
  Build for production: npm run build
  or                    yarn build
```
### Tools:

* ganache-cli -> set up a virtual private network, transactions executed immediately (no need to wait for mining)
* geth -> you can also set up private network with geth
* use MetaMask plugin (Chrome or Brave) or Mist to use dApp

### Deploying dev environment (using ganache-cli and MetaMask)

1. run ganache-cli (save your mnemonic to be able to get the same setup later)
    * ganache will generate 10 addresses, write them down (including private keys)
    * private network will be accessable at localhost:8545
2. run truffle migrate -> migrates contracts to your private network
3. run truffle test -> test that contract are still running as expected
4. run yarn start
5. import at least 2 of accounts generated in step no. 1 to MetaMask (account no. 0, will contain RooCoins)
6. you can now test and play with RooExchange

### TODO:

* add validation to forms
* improve UI (leading indicators, add more information)
* add more coins, charts and similar