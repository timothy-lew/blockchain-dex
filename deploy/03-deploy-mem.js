const { network } = require('hardhat');
const {
  networkConfig,
  developmentChains,
} = require('../helper-hardhat-config');
// const { verify } = require('../utils/verify');
require('dotenv').config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { player } = await getNamedAccounts(); // get from hardhat.config.json

  // const accounts = await ethers.getSigners();
  // const deployer = accounts[1];

  const chainId = network.config.chainId;

  log('----------------------------------------------------');
  log('Deploying MEM and waiting for confirmations...');
  const MEM = await deploy('MEMToken', {
    from: player,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // log(MEM);
  log(`MEMToken deployed at ${MEM.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // verify contract
    // await verify(dummy.address, [ethUsdPriceFeedAddress]);
  }
};

module.exports.tags = ['all', 'mem'];
