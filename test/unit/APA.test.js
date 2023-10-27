const { assert, expect } = require('chai');
const { network, deployments, ethers } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('APA', function () {
      let apa; // apa smart contract
      let deployer; // contract creator address
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);
        apa = await ethers.getContract('APAToken', deployer);
      });

      describe('constructor', function () {
        it('check APA contract deployed correctly', async () => {
          const response = await apa.symbol();

          assert.equal(response, 'APA');
        });

        it('get creator', async () => {
          // default creator is 1st account of hardhat
          const creatorAddress = await apa.getCreator();

          console.log(creatorAddress);
          assert.equal(deployer, creatorAddress);
        });

        it('send APA tokens to another address', async () => {
          const [deployer, secondAccount] = await ethers.getSigners();
          console.log(`deployer: ${deployer.address}`);
          console.log(`secondAccount: ${secondAccount.address}`);

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
    });
