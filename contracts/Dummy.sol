// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Dummy {
    string public str = "Hello World";

    function getDummy() public view returns (string memory) {
        return str;
    }
}
