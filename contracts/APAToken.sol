// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract APAToken is ERC20 {
    address public creator;

    constructor() ERC20("APAToken", "APA") {
        // mint 1000 coins to creator of contract
        _mint(msg.sender, 1000 * 10 ** 18);
        creator = msg.sender;
    }

    function getCreator() public view returns (address) {
        return creator;
    }
}
