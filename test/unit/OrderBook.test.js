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

        let signers = await ethers.getSigners();
        trader1 = signers[1];
        trader2 = signers[2];

        await deployments.fixture(['all']);
        baseToken = await ethers.getContract('APAToken', deployer);
        quoteToken = await ethers.getContract('MEMToken', deployer);
        orderbook = await ethers.getContract('OrderBook', deployer);

        // let bal = await quoteToken.balanceOf(trader1);
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

        // balance of trader1
        // bal = await quoteToken.balanceOf(trader1);
        // console.log(ethers.formatEther(bal));
      });

      it('log addresses', async () => {
        console.log({
          deployer: deployer,
          trader1: trader1.address,
          trader2: trader2.address,
          baseToken: baseToken.target,
          quoteToken: quoteToken.target,
          orderbook: orderbook.target,
        });
      });

      // Test case: Placing a buy order
      it('should place a buy order and match with existing sell orders', async () => {
        // send from trader1 to MEM
        let x = await quoteToken
          .connect(trader1)
          .approve(orderbook.target, 10000);

        // send from trader2 to APA
        let y = await baseToken
          .connect(trader2)
          .approve(orderbook.target, 10000);

        // send from trader2 to orderbook
        const sellOrder = await orderbook
          .connect(trader2)
          .placeSellOrder(10, 50, baseToken.target, quoteToken.target);

        // send from trader1 to orderbook
        const buyOrder = await orderbook
          .connect(trader1)
          .placeBuyOrder(10, 50, baseToken.target, quoteToken.target);

        const receipt = await provider.getTransactionReceipt(buyOrder.hash);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
        );

        let log = orderbook.interface.parseLog({
          data: tradeEvent.data,
          topics: tradeEvent.topics,
        });

        assert.equal(log.name, 'TradeExecuted');
        assert.equal(log.args[2], trader1.address);
        assert.equal(log.args[3], trader2.address);
      });

      // Test case: Placing a sell order
      it('should place a sell order and match with existing buy orders', async () => {
        // send from trader1 to APA
        let x = await baseToken.connect(trader1).approve(orderbook.target, 100);

        // send from trader2 to MEM
        let y = await quoteToken
          .connect(trader2)
          .approve(orderbook.target, 100);

        // send from trader2 to orderbook
        const buyOrder = await orderbook
          .connect(trader2)
          .placeBuyOrder(10, 10, baseToken.target, quoteToken.target);

        // send from trader1 to orderbook
        const sellOrder = await orderbook
          .connect(trader1)
          .placeSellOrder(10, 10, baseToken.target, quoteToken.target);

        const receipt = await provider.getTransactionReceipt(sellOrder.hash);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
        );

        let log = orderbook.interface.parseLog({
          data: tradeEvent.data,
          topics: tradeEvent.topics,
        });

        assert.equal(log.name, 'TradeExecuted');
        assert.equal(log.args[2], trader2.address);
        assert.equal(log.args[3], trader1.address);
      });

      // Test case: Fulfill partial order
      it('should handle partial order fulfillment', async () => {
        // send from trader1 to MEM
        let x = await quoteToken
          .connect(trader1)
          .approve(orderbook.target, 200);

        // send from trader2 to APA
        let y = await baseToken.connect(trader2).approve(orderbook.target, 200);

        // send from trader1 to orderbook
        const buyOrder = await orderbook
          .connect(trader1)
          .placeBuyOrder(15, 10, baseToken.target, quoteToken.target);

        // send from trader2 to orderbook
        const sellOrder = await orderbook
          .connect(trader2)
          .placeSellOrder(10, 5, baseToken.target, quoteToken.target);

        const receipt = await provider.getTransactionReceipt(sellOrder.hash);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
        );

        let log = orderbook.interface.parseLog({
          data: tradeEvent.data,
          topics: tradeEvent.topics,
        });

        assert.equal(log.name, 'TradeExecuted');
        assert.equal(log.args[2], trader1.address);
        assert.equal(log.args[3], trader2.address);
        assert.equal(log.args[5], 5);
      });

      // Test case: Cancel an order
      it('should allow trader to cancel order', async () => {
        // send from trader1 to MEM
        let x = await quoteToken
          .connect(trader1)
          .approve(orderbook.target, 100);

        // send from deployer to orderbook
        const buyOrder = await orderbook
          .connect(trader1)
          .placeBuyOrder(10, 10, baseToken.target, quoteToken.target);

        const result = await orderbook.connect(trader1).cancelOrder(0, true);

        const receipt = await provider.getTransactionReceipt(result.hash);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
        );

        let log = orderbook.interface.parseLog({
          data: tradeEvent.data,
          topics: tradeEvent.topics,
        });

        assert.equal(log.name, 'OrderCanceled');
        assert.equal(log.args[1], trader1.address);
        assert.equal(log.args[2], true);
      });

      // Test case: Get buy and sell arrays
      it('get buy and sell orders', async () => {
        // send from trader2 to MEM
        await quoteToken.connect(trader2).approve(orderbook.target, 10000);

        // send from trader1 to APA
        await baseToken.connect(trader1).approve(orderbook.target, 10000);

        // send from trader1 to orderbook
        await orderbook
          .connect(trader1)
          .placeSellOrder(10, 50, baseToken.target, quoteToken.target);

        await orderbook
          .connect(trader1)
          .placeSellOrder(10, 50, baseToken.target, quoteToken.target);

        // send from trader2 to orderbook
        await orderbook
          .connect(trader2)
          .placeBuyOrder(10, 50, baseToken.target, quoteToken.target);

        await orderbook
          .connect(trader2)
          .placeBuyOrder(10, 50, baseToken.target, quoteToken.target);

        let a = await orderbook.getBuyOrders();
        assert.equal(a.length, 2);

        let b = await orderbook.getSellOrders();
        assert.equal(b.length, 2);
      });
    });
