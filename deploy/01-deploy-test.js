const { network } = require('hardhat');
const {
  networkConfig,
  developmentChains,
} = require('../helper-hardhat-config');
// const { verify } = require('../utils/verify');
require('dotenv').config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  log('----------------------------------------------------');
  log('Deploying Dummy and waiting for confirmations...');
  const dummy = await deploy('Dummy', {
    from: deployer,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`Dummy deployed at ${dummy.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // verify contract
    // await verify(dummy.address, [ethUsdPriceFeedAddress]);
  }
};

module.exports.tags = ['all', 'dummy'];
