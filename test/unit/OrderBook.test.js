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
        console.log(await getNamedAccounts());

        deployer = (await getNamedAccounts()).deployer;
        trader1 = (await getNamedAccounts()).trader1;
        trader2 = (await getNamedAccounts()).trader2;

        await deployments.fixture(['all']);
        baseToken = await ethers.getContract('APAToken', deployer);
        quoteToken = await ethers.getContract('MEMToken', deployer);
        orderbook = await ethers.getContract('OrderBook', deployer);

        let bal = await quoteToken.balanceOf(deployer);
        // console.log(Number(bal));

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
        // console.log(Number(bal));

        console.log({
          deployer: deployer,
          trader1: trader1,
          trader2: trader2,
          baseToken: baseToken.target,
          quoteToken: quoteToken.target,
          orderbook: orderbook.target,
        });

        // console.log(orderbook);
      });

      // Test case: Placing a buy order
      it('should place a buy order and match with existing sell orders', async () => {
        // Approve the Orderbook to spend quote tokens for trader1
        // send from deployer to MEM
        let x = await quoteToken.approve(orderbook.target, 100, {
          // from: trader1,
        });
        // let x = await quoteToken.connect(trader1).approve(orderbook.address, 100); // does not work

        // console.log(x);
        // Place a sell order from trader2
        // send from deployer to APA
        let y = await baseToken.approve(orderbook.target, 100, {
          // from: trader2,
        });
        // console.log(y);

        // send from deployer to orderbook
        const sellOrder = await orderbook.placeSellOrder(
          10,
          10,
          baseToken.target,
          quoteToken.target
          // {
          //   from: trader2,
          // }
        );
        // console.log(sellOrder);
        // Place a buy order from trader1
        // send from deployer to orderbook
        const buyOrder = await orderbook.placeBuyOrder(
          10,
          10,
          baseToken.target,
          quoteToken.target
          // { from: trader1 }
        );
        // console.log(buyOrder);

        const receipt = await provider.getTransactionReceipt(buyOrder.hash);
        // console.log(receipt);
        // console.log(receipt.logs);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
          // log.topics[0] === ethers.id('TradeExecuted')
        );
        // console.log(tradeEvent);
        const args = orderbook.interface.decodeEventLog(
          // event trade executed
          'TradeExecuted(uint256 indexed buyOrderId, uint256 indexed sellOrderId, address indexed buyer, address seller, uint256 price, uint256 quantity)',
          tradeEvent.data,
          tradeEvent.topics
        );
        // console.log(args);

        // console.log('Buyer:', args[2]);
        // console.log('Seller:', args[3]);
        assert(args[2], deployer.target);
        assert(args[3], deployer.target);
        // Verify that the buy order is matched and executed
        // assert.equal(result.logs[0].event, 'TradeExecuted');
        // assert.equal(result.logs[0].args.buyer, trader2);
        // assert.equal(result.logs[0].args.seller, trader1);
      });

      // Test case: Placing a sell order
      it('should place a sell order and match with existing buy orders', async () => {
        // Approve the Orderbook to spend quote tokens for trader1
        // send from deployer to APA
        let x = await baseToken.approve(orderbook.target, 100, {
          // from: trader1,
        });
        // let x = await quoteToken.connect(trader1).approve(orderbook.address, 100); // does not work

        // console.log(x);
        // Place a sell order from trader2
        // send from deployer to MEM
        let y = await quoteToken.approve(orderbook.target, 100, {
          // from: trader2,
        });
        // console.log(y);

        // send from deployer to orderbook
        const buyOrder = await orderbook.placeBuyOrder(
          10,
          10,
          baseToken.target,
          quoteToken.target
          // {
          //   from: trader2,
          // }
        );
        // console.log(buyOrder);
        // Place a buy order from trader1
        // send from deployer to orderbook
        const sellOrder = await orderbook.placeSellOrder(
          10,
          10,
          baseToken.target,
          quoteToken.target
          // { from: trader1 }
        );
        // console.log(sellOrder);

        const receipt = await provider.getTransactionReceipt(sellOrder.hash);
        // console.log(receipt);
        // console.log(receipt.logs);
        const tradeEvent = receipt.logs.find(
          (log) => log.address === orderbook.target
          // log.topics[0] === ethers.id('TradeExecuted')
        );
        // console.log(tradeEvent);
        const args = orderbook.interface.decodeEventLog(
          // event trade executed
          'TradeExecuted(uint256 indexed buyOrderId, uint256 indexed sellOrderId, address indexed buyer, address seller, uint256 price, uint256 quantity)',
          tradeEvent.data,
          tradeEvent.topics
        );
        // console.log(args);

        // console.log('Buyer:', args[2]);
        // console.log('Seller:', args[3]);
        assert(args[2], deployer.target);
        assert(args[3], deployer.target);
        // Verify that the buy order is matched and executed
        // assert.equal(result.logs[0].event, 'TradeExecuted');
        // assert.equal(result.logs[0].args.buyer, trader2);
        // assert.equal(result.logs[0].args.seller, trader1);
      });
    });
