const Orderbook = artifacts.require("Orderbook");
const Token1 = artifacts.require("Token1");
const Token2 = artifacts.require("Token2");
contract("Orderbook", async (accounts) => {
  let orderbook;
  let baseToken;
  let quoteToken;
  const owner = accounts[0];
  const trader1 = accounts[1];
  const trader2 = accounts[2];
  beforeEach(async () => {
    // Deploy the Orderbook smart contract
    orderbook = await Orderbook.deployed();
    // Deploy mock ERC20 tokens for testing
    baseToken = await Token1.deployed();
    quoteToken = await Token2.deployed();
    let bal = await quoteToken.balanceOf(owner);
    console.log(Number(bal));
    await baseToken.transfer(trader1, 1000, {
      from: owner,
    });
    await quoteToken.transfer(trader1, 1000);
    await baseToken.transfer(trader2, 1000);
    await quoteToken.transfer(trader2, 1000);
  });
});