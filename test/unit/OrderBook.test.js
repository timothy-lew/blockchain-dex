const { assert, expect } = require('chai');
const { network, deployments, ethers, getNamedAccounts } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');
const provider = ethers.provider;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('OrderBook', function () {
      let trader1, trader2;
      let orderbook; // orderbook contract
      let deployer; // contract creator address

      let baseToken; // APA
      let quoteToken; // MEM
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        trader1 = (await getNamedAccounts()).trader1;
        trader2 = (await getNamedAccounts()).trader2;

        await deployments.fixture(['all']);
        baseToken = await ethers.getContract('APAToken', deployer);
        quoteToken = await ethers.getContract('MEMToken', deployer);
        orderbook = await ethers.getContract('OrderBook', deployer);

        // let bal = await quoteToken.balanceOf(deployer);
        // console.log(ethers.formatEther(bal));

        await baseToken.transfer(trader1, ethers.parseEther('100'), {
          from: deployer,
        });
        await baseToken.transfer(trader2, ethers.parseEther('100'), {
          from: deployer,
        });
        await quoteToken.transfer(trader1, ethers.parseEther('100'), {
          from: deployer,
        });
        await quoteToken.transfer(trader2, ethers.parseEther('100'), {
          from: deployer,
        });

        // balance of deployer after sending to trader1 and trader2
        // bal = await quoteToken.balanceOf(deployer);
        // console.log(ethers.formatEther(bal));
      });

      it('log addresses', async () => {
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
        // send from deployer to MEM
        let x = await quoteToken.approve(orderbook.target, 10000);

        // send from deployer to APA
        let y = await baseToken.approve(orderbook.target, 10000);

        // send from deployer to orderbook
        const sellOrder = await orderbook.placeSellOrder(
          10,
          50,
          baseToken.target,
          quoteToken.target
        );
        // send from deployer to orderbook
        const buyOrder = await orderbook.placeBuyOrder(
          10,
          50,
          baseToken.target,
          quoteToken.target
        );

        const receipt = await provider.getTransactionReceipt(buyOrder.hash);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
        );

        let log = orderbook.interface.parseLog({
          data: tradeEvent.data,
          topics: tradeEvent.topics,
        });
        // console.log(log);

        assert(log.name, 'TradeExecuted');
        assert(log.args[2], deployer.target);
        assert(log.args[3], deployer.target);
      });

      // Test case: Placing a sell order
      it('should place a sell order and match with existing buy orders', async () => {
        // send from deployer to APA
        let x = await baseToken.approve(orderbook.target, 100);

        // send from deployer to MEM
        let y = await quoteToken.approve(orderbook.target, 100);

        // send from deployer to orderbook
        const buyOrder = await orderbook.placeBuyOrder(
          10,
          10,
          baseToken.target,
          quoteToken.target
        );
        // send from deployer to orderbook
        const sellOrder = await orderbook.placeSellOrder(
          10,
          10,
          baseToken.target,
          quoteToken.target
        );

        const receipt = await provider.getTransactionReceipt(sellOrder.hash);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
        );

        let log = orderbook.interface.parseLog({
          data: tradeEvent.data,
          topics: tradeEvent.topics,
        });

        assert(log.name, 'TradeExecuted');
        assert(log.args[2], deployer.target);
        assert(log.args[3], deployer.target);
      });

      // Test case: Fulfill partial order
      it('should handle partial order fulfillment', async () => {
        // send from deployer to MEM
        let x = await quoteToken.approve(orderbook.target, 200);

        // send from deployer to APA
        let y = await baseToken.approve(orderbook.target, 200);

        // send from deployer to orderbook
        const buyOrder = await orderbook.placeBuyOrder(
          15,
          10,
          baseToken.target,
          quoteToken.target
        );

        // send from deployer to orderbook
        const sellOrder = await orderbook.placeSellOrder(
          10,
          5,
          baseToken.target,
          quoteToken.target
        );

        const receipt = await provider.getTransactionReceipt(sellOrder.hash);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
        );

        let log = orderbook.interface.parseLog({
          data: tradeEvent.data,
          topics: tradeEvent.topics,
        });
        // console.log(log);

        assert(log.name, 'TradeExecuted');
        assert(log.args[2], deployer.target);
        assert(log.args[3], deployer.target);
      });

      // Test case: Cancel an order
      it('should allow trader to cancel order', async () => {
        // send from deployer to MEM
        let x = await quoteToken.approve(orderbook.target, 100);

        // send from deployer to orderbook
        const buyOrder = await orderbook.placeBuyOrder(
          10,
          10,
          baseToken.target,
          quoteToken.target
        );

        const result = await orderbook.cancelOrder(0, true);

        const receipt = await provider.getTransactionReceipt(result.hash);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
        );

        let log = orderbook.interface.parseLog({
          data: tradeEvent.data,
          topics: tradeEvent.topics,
        });

        assert(log.name, 'OrderCanceled');
        assert(log.args[1], deployer.target);
        assert(log.args[2], true);
      });

      // Test case: Placing a buy order
      it('get buy and sell orders', async () => {
        // send from deployer to MEM
        await quoteToken.approve(orderbook.target, 10000);

        // send from deployer to APA
        await baseToken.approve(orderbook.target, 10000);

        // send from deployer to orderbook
        await orderbook.placeSellOrder(
          10,
          50,
          baseToken.target,
          quoteToken.target
        );

        await orderbook.placeSellOrder(
          10,
          50,
          baseToken.target,
          quoteToken.target
        );

        // send from deployer to orderbook
        await orderbook.placeBuyOrder(
          10,
          50,
          baseToken.target,
          quoteToken.target
        );

        await orderbook.placeBuyOrder(
          10,
          50,
          baseToken.target,
          quoteToken.target
        );

        let a = await orderbook.getBuyOrders();
        assert.equal(a.length, 2);

        let b = await orderbook.getSellOrders();
        assert.equal(b.length, 2);
      });
    });
