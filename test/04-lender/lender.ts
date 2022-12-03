import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Lender, LenderAttacker, Token } from "../../typechain";

describe("[Challenge] Lender", function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let lender: Lender;
  let lenderAttacker: LenderAttacker;

  let token: Token;

  before(async function () {
    [deployer, user] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("Token");
    token = await TokenFactory.deploy();

    const LenderFactory = await ethers.getContractFactory("Lender");
    lender = await LenderFactory.deploy(token.address);

    const LenderAttackerFactory = await ethers.getContractFactory(
      "LenderAttacker"
    );
    lenderAttacker = await LenderAttackerFactory.deploy(
      token.address,
      lender.address
    );

    const tokenBalance = await token.balanceOf(deployer.address);
    token.transfer(lender.address, ethers.constants.MaxUint256);
  });

  it("Runs the solution", async function () {
    await expect(lenderAttacker.attack()).to.not.be.reverted;
  });

  after(async function () {
    expect(await token.balanceOf(lenderAttacker.address)).to.equal(
      ethers.constants.MaxUint256
    );
  });
});
