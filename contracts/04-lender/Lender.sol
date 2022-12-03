//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Lender {
    IERC20 public token;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Insufficient amount");
        token.transferFrom(msg.sender, address(this), amount);
    }

    function borrow(
        uint256 amount,
        address target,
        address borrower,
        bytes calldata data
    ) external {
        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= amount, "Insufficient balance");

        token.transfer(borrower, amount);
        target.call(data);

        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceBefore <= balanceAfter, "Tokens not paid back");
    }
}
