//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Bank {
    mapping(address => uint256) balances;

    constructor() {}

    function deposit() external payable {
        require(msg.value > 0, "Insufficient amount");

        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Insufficient amount");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        msg.sender.call{value: amount}("");
        unchecked {
            balances[msg.sender] -= amount;   
        }
    }
}
