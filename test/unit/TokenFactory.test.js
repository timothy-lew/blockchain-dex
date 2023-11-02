const { assert, expect } = require('chai');
const { network, deployments, ethers } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('APA', function () {
      let Token;
      let Factory;
      let tokenInstance;
      let factoryInstance;

      beforeEach(async () => {
        // a ContractFactory is used to deploy a Contract to the blockchain.
        Token = await ethers.getContractFactory('Token');
        Factory = await ethers.getContractFactory('TokenFactory');

        tokenInstance = await Token.deploy(
          'MyToken',
          'MTK',
          ethers.parseEther('1000')
        );
        factoryInstance = await Factory.deploy();
      });

      it('should deploy a Token with initial supply', async () => {
        const supply = await tokenInstance.totalSupply();
        assert.equal(supply, ethers.parseEther('1000'));
      });

      it('should deploy a Factory', async () => {
        const count = await factoryInstance.tokenCount();
        assert.equal(count, 0);
      });

      it('should deploy a new Token through the TokenFactory', async () => {
        await factoryInstance.deployToken(
          'NewToken',
          'NTK',
          ethers.parseEther('500')
        );
        const newTokenAddress = await factoryInstance.tokens(0);

        const newToken = await Token.attach(newTokenAddress);
        const name = await newToken.name();
        const ticker = await newToken.symbol();
        const supply = await newToken.totalSupply();

        assert.equal(name, 'NewToken');
        assert.equal(ticker, 'NTK');
        assert.equal(supply, ethers.parseEther('500'));
      });
    });
