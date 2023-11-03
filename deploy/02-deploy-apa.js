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

  log('----------------------------------------------------');
  log('Deploying APA and waiting for confirmations...');
  const APA = await deploy('APAToken', {
    from: deployer,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // log(APA);
  log(`APAToken deployed at ${APA.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // verify contract
    await verify(APA.address, [], 'contracts/APAToken.sol:APAToken');
  }
};

module.exports.tags = ['all', 'apa'];
