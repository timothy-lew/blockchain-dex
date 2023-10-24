const { assert, expect } = require('chai');
const { network, deployments, ethers, getNamedAccounts } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');
const { QuickNodeProvider } = require('ethers');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('OrderBook', function () {
      let trader1, trader2;
      let orderbook; // orderbook contract
      let deployer; // contract creator address

      let baseToken; // APA
      let quoteToken; // MEM
      beforeEach(async () => {
        console.log(await getNamedAccounts());

        deployer = (await getNamedAccounts()).deployer;
        trader1 = (await getNamedAccounts()).trader1;
        trader2 = (await getNamedAccounts()).trader2;

        await deployments.fixture(['all']);
        baseToken = await ethers.getContract('APAToken', deployer);
        quoteToken = await ethers.getContract('MEMToken', deployer);
        orderbook = await ethers.getContract('OrderBook', deployer);

        let bal = await quoteToken.balanceOf(deployer);
        console.log(Number(bal));

        await baseToken.transfer(trader1, 500, {
          from: deployer,
        });
        await baseToken.transfer(trader2, 500, {
          from: deployer,
        });
        await quoteToken.transfer(trader1, 500, {
          from: deployer,
        });
        await quoteToken.transfer(trader2, 500, {
          from: deployer,
        });

        bal = await quoteToken.balanceOf(deployer);
        console.log(Number(bal));

        console.log({
          deployer: deployer,
          trader1: trader1,
          trader2: trader2,
          baseToken: baseToken.target,
          quoteToken: quoteToken.target,
          orderbook: orderbook.target,
        });
      });

      // Test case: Placing a buy order
      it('should place a buy order and match with existing sell orders', async () => {
        // Approve the Orderbook to spend quote tokens for trader1
        await quoteToken.approve(orderbook.target, 100, {
          from: trader1,
        });
        // Place a sell order from trader2
        // await baseToken.approve(orderbook.target, 100, {
        //   // from: trader2,
        // });
        // const sellOrder = await orderbook.placeSellOrder(
        //   10,
        //   10,
        //   baseToken.target,
        //   quoteToken.target,
        //   {
        //     // from: trader2,
        //   }
        // );
        // console.log(sellOrder);
        // Place a buy order from trader1
        // const result = await orderbook.placeBuyOrder(
        //   10,
        //   10,
        //   baseToken.target,
        //   quoteToken.target
        //   // { from: trader1 }
        // );
        // console.log(result);

        // Verify that the buy order is matched and executed
        // assert.equal(result.logs[0].event, 'TradeExecuted');
        // assert.equal(result.logs[0].args.buyer, trader2);
        // assert.equal(result.logs[0].args.seller, trader1);
      });
    });
