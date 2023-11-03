const { network } = require('hardhat');
const {
  networkConfig,
  developmentChains,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
require('dotenv').config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts(); // get from hardhat.config.json

  // const accounts = await ethers.getSigners();
  // const deployer = accounts[1];

  const chainId = network.config.chainId;

  log('----------------------------------------------------');
  log('Deploying OrderBook and waiting for confirmations...');
  const OrderBook = await deploy('OrderBook', {
    from: deployer,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // log(MEM);
  log(`OrderBook deployed at ${OrderBook.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // verify contract
    await verify(OrderBook.address, [], 'contracts/OrderBook.sol:OrderBook');
  }
};

module.exports.tags = ['all', 'OrderBook'];
