//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Giant is ERC721, Ownable {
    uint8 public tokenId;
    uint8 public maxTokenId;
    uint256 mintPrice = 0.005 ether;

    mapping(address => bool) public whitelist;

    constructor() ERC721("Giant", "GIANT") {
        maxTokenId = 55;
    }

    function mint() external payable {
        require(whitelist[msg.sender], "Sender is not whitelisted");
        require(tokenId < maxTokenId, "All tokens are already minted");
        require(msg.value >= mintPrice);

        _safeMint(msg.sender, tokenId++);
        whitelist[msg.sender] = false;
    }

    function toggleWhitelist(address _address) external onlyOwner {
        whitelist[_address] = !whitelist[_address];
    }
}
