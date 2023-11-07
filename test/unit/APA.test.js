const { assert, expect } = require('chai');
const { network, deployments, ethers } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('APA', function () {
      let apa; // apa smart contract
      let deployer; // contract creator address
      let trader1;
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        trader1 = (await getNamedAccounts()).trader1;
        await deployments.fixture(['all']);
        apa = await ethers.getContract('APAToken', deployer);
        apaTrader = await ethers.getContract('APAToken', trader1);
      });

      describe('constructor', function () {
        it('check APA contract deployed correctly', async () => {
          const response = await apa.symbol();

          assert.equal(response, 'APA');
        });

        it('get creator', async () => {
          // default creator is 1st account of hardhat
          const creatorAddress = await apa.getCreator();

          assert.equal(deployer, creatorAddress);
        });

        it('send APA tokens to another address', async () => {
          const [deployer, secondAccount] = await ethers.getSigners();

          const amountToSend = ethers.parseUnits('20', 18); // Send 10 APA tokens

          const initialBalanceDeployer = await apa.balanceOf(deployer.address);
          const initialBalanceSecondAccount = await apa.balanceOf(
            secondAccount.address
          );

          const tx = await apa
            .connect(deployer)
            .transfer(secondAccount.address, amountToSend);
          // console.log(tx);
          await tx.wait();

          // Check the balances after the transfer
          const finalBalanceDeployer = await apa.balanceOf(deployer.address);
          const finalBalanceSecondAccount = await apa.balanceOf(
            secondAccount.address
          );

          // console.log(finalBalanceDeployer);
          // console.log(finalBalanceSecondAccount);

          assert.equal(
            finalBalanceDeployer,
            initialBalanceDeployer - amountToSend
          );
          assert.equal(
            finalBalanceSecondAccount,
            initialBalanceSecondAccount + amountToSend
          );
        });
      });

      it('should allow a user to request tokens from faucet', async function () {
        // convert to big int (read ethers v6 docs)
        const initialBalance = ethers.getBigInt(await apa.balanceOf(trader1));
        const amountToRequest = ethers.parseEther('70');

        await apaTrader.requestTokens(amountToRequest);
        const finalBalance = await apa.balanceOf(trader1);

        const expectedFinalBalance = initialBalance + amountToRequest;

        assert.equal(
          finalBalance.toString(),
          expectedFinalBalance.toString(),
          'trader1 did not receive the requested tokens'
        );
      });

      it('request too much from faucet', async function () {
        const amountToRequest = ethers.parseEther('200');

        try {
          await apaTrader.requestTokens(amountToRequest);
        } catch (error) {
          assert.include(error.message, 'Can only request less than 100');
        }
      });

      it('not enough balance', async function () {
        const amountToRequest = ethers.parseEther('20000');

        try {
          await apaTrader.requestTokens(amountToRequest);
        } catch (error) {
          assert.include(
            error.message,
            'Insufficient balance for requested amount'
          );
        }
      });
    });
