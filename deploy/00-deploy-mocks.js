const { network } = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // If we are on a local development network, we need to deploy mocks!
  /*
    Mocking allows you to simulate smart contracts' behavior and interactions without deploying them on the blockchain network. 
    This can be particularly useful for unit testing or when testing interactions between different application components.
  */
  if (chainId == 31337) {
    log('Local network detected! Deploying mocks...');
    // await deploy('VRFCoordinatorV2Mock', {
    //   from: deployer,
    //   log: true,
    // });

    log('Mocks Deployed!');
    log('----------------------------------------------------------');
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    );
    log(
      'Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!'
    );
    log('----------------------------------------------------------');
  }
};
module.exports.tags = ['all', 'mocks'];
