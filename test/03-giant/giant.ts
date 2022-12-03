import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Giant, GiantAttacker } from "../../typechain";

describe("[Challenge] Giant", function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let giant: Giant;
  let giantAttacker: GiantAttacker;

  before(async function () {
    [deployer, user] = await ethers.getSigners();

    const GiantFactory = await ethers.getContractFactory("Giant");
    giant = await GiantFactory.deploy();

    const GiantAttackerFactory = await ethers.getContractFactory(
      "GiantAttacker",
      deployer
    );
    giantAttacker = await GiantAttackerFactory.deploy(giant.address);
    await giant.toggleWhitelist(giantAttacker.address);

    await deployer.sendTransaction({
      from: deployer.address,
      to: giantAttacker.address,
      value: ethers.utils.parseEther("0.3"),
    });
  });

  it("Runs the solution", async function () {
    await expect(giantAttacker.attack()).to.not.be.reverted;
  });

  after(async function () {
    expect(await giant.balanceOf(giantAttacker.address)).to.equal(55);
  });
});
