// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public creator;

    constructor(
        string memory _name,
        string memory _ticker,
        uint256 _supply
    ) ERC20(_name, _ticker) {
        _mint(msg.sender, _supply);
    }

    // function to allow users to request tokens from creator
    function requestTokens(uint256 amount) public {
        // faucet is only available to non-creator address
        require(msg.sender != creator, "Faucet is not available to creator");

        // ensure creator has enough coins before transferring
        require(
            balanceOf(creator) >= amount,
            "Insufficient balance for requested amount"
        );
        require(amount < 100 * 10 ** 18, "Can only request less than 100");

        // transfer 'amount' of tokens from creator to the requester
        _transfer(creator, msg.sender, amount);
    }
}

contract TokenFactory {
    address[] public tokens;
    uint256 public tokenCount;
    event TokenDeployed(address tokenAddress);

    function deployToken(
        string calldata _name,
        string calldata _ticker,
        uint256 _supply
    ) public returns (address) {
        Token token = new Token(_name, _ticker, _supply);
        token.transfer(msg.sender, _supply);
        tokens.push(address(token));
        tokenCount += 1;
        emit TokenDeployed(address(token));
        return address(token);
    }
}
