# Blockchain DEX

# Install nodejs

1. Install nodenv

```console
brew install nodenv
```

2. Set up nodenv in your shell by adding this to ~/.zshrc

```console
which nodenv > /dev/null && eval "$(nodenv init -)"
```

3. Restart your terminal so your changes take effect.

4. Verify that nodenv is properly set up using this nodenv-doctor script:

```console
$ curl -fsSL https://github.com/nodenv/nodenv-installer/raw/master/bin/nodenv-doctor | bash
Checking for `nodenv' in PATH: /usr/local/bin/nodenv
Checking for nodenv shims in PATH: OK
Checking `nodenv install' support: /usr/local/bin/nodenv-install (node-build 3.0.22-4-g49c4cb9)
Counting installed Node versions: none
  There aren't any Node versions installed under `~/.nodenv/versions'.
  You can install Node versions like so: nodenv install 2.2.4
Auditing installed plugins: OK
```

5. Install node 16.14.2

```console
nodenv install 16.14.2
```

6. Installs shims for all Node executables known to nodenv

```console
nodenv rehash
```

7. Set node version locally

```console
nodenv local 16.14.2
```

8. Verify node version

```console
node --version
```

# Solidity

1. Copy .env.example into .env file
2. Compile contracts

```console
yarn hardhat compile
```

3. Run local blockchain on hardhat

```console
yarn hardhat node
```

4. Deploy locally

```
yarn hardhat deploy --network hardhat/localhost
```

5.0. Import local hardhat network to metamask. (https://docs.metamask.io/wallet/how-to/get-started-building/run-devnet/)  
5.1. Import coin to metamask by specifying the contract address.  
5.2. If you get a nonce error in metamask, reset the metamask nonce settings for both wallets

6. Run tests

```
yarn test
```

# Staging deployment

1. Get Alchemy API key: https://www.alchemy.com/
2. Get Etherscan API key: https://etherscan.io/
3. Update .env file
4. Deploy to Sepolia testnet

```
yarn hardhat deploy --network sepolia
```

# Frontend

1. Go into the frontend folder

```
cd frontend
```

2. Run this to install the required dependencies

```
yarn
```

3. Run this to start the frontend application

```
yarn start
```

4. Paste this link in Chrome Browser to view the application

```
http://localhost:5173/
```
