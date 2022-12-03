import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { Bank, BankAttacker } from "../../typechain";

describe("[Challenge] Receiver", function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let bank: Bank;
  let bankAttacker: BankAttacker;

  const provider = waffle.provider;

  before(async function () {
    [deployer, user] = await ethers.getSigners();

    const tokenFactory = await ethers.getContractFactory("Token");
    const token = await tokenFactory.deploy();

    const BankFactory = await ethers.getContractFactory("Bank");
    bank = await BankFactory.deploy();
    await bank.connect(user).deposit({ value: ethers.utils.parseEther("5") });

    const BankAttackerFactory = await ethers.getContractFactory(
      "BankAttacker",
      deployer
    );
    bankAttacker = await BankAttackerFactory.deploy(bank.address);
  });

  it("Runs the solution", async function () {
    // Bank attacker should not be reverted
    await expect(bankAttacker.attack({ value: ethers.utils.parseEther("2") }))
      .to.not.be.reverted;

    // Bank balance should be less than 1 after the attack
    const bankBalance = await provider.getBalance(bank.address);
    expect(
      Number(ethers.utils.formatEther(bankBalance))
    ).to.be.lessThanOrEqual(1);
  });
});
