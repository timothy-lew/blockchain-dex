// const { assert } = require('chai');
// const { network, deployments, ethers } = require('hardhat');
// const { developmentChains } = require('../../helper-hardhat-config');

// !developmentChains.includes(network.name)
//   ? describe.skip
//   : describe('Dummy', function () {
//       let dummy;
//       let deployer;
//       beforeEach(async () => {
//         deployer = (await getNamedAccounts()).deployer;
//         await deployments.fixture(['all']);
//         dummy = await ethers.getContract('Dummy', deployer);
//       });

//       describe('constructor', function () {
//         it('check Dummy contract deployed correctly', async () => {
//           const response = await dummy.getDummy();

//           assert.equal(response, 'Hello World');
//         });
//       });
//     });
