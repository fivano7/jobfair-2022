import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("[Challenge] Receiver", function () {
  let deployer, user: SignerWithAddress;
  let receiver: Contract;

  before(async function () {
    [deployer, user] = await ethers.getSigners();

    const ReceiverFactory = await ethers.getContractFactory(
      "Receiver",
      deployer
    );

    receiver = await ReceiverFactory.deploy();
  });

  it("Transfers 1 ETH to the contract", async function () {
    // Receiver contract should be able to receive 1 ETH
    await expect(
      user.sendTransaction({
        to: receiver.address,
        value: ethers.utils.parseEther("1.0"),
      })
    ).to.not.be.reverted;
  });
});
