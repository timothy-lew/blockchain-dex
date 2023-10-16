// SPDX-License-Identifier: GPL-3.0

// pragma solidity ^0.8.20;
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MEMToken is ERC20 {
    string public str = "MEM";
    address public creator;

    constructor() ERC20("MEMToken", "MEM") {
        // mint 1000 coins to creator of contract
        _mint(msg.sender, 1000 * 10 ** 18);
        creator = msg.sender;
    }

    function getString() public view returns (string memory) {
        return str;
    }

    function getCreator() public view returns (address) {
        return creator;
    }

    function transferTokens(address to, uint256 amount) public {
        _transfer(msg.sender, to, amount);
        emit Transfer(msg.sender, to, amount);
    }
}
