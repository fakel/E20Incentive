const E20 = artifacts.require("E20");
const E20Incentive = artifacts.require("E20Incentive");
const config = require("../test.config.json");
const BN = require("bn.js");
const truffleAssert = require("truffle-assertions");

contract("E20Incentive", accounts => {
  const testAmount = new BN(config._maxToken);
  const testAccount = accounts[0];
  let tokenInstance;
  let testInstance;

  before(async () => {
    tokenInstance = await E20.deployed();
    testInstance = await E20Incentive.deployed();
    await tokenInstance.approve(testInstance.address, "1000000000000000", {
      from: testAccount
    });
    await tokenInstance.transfer(testInstance.address, "1000000000000000", {
      from: testAccount
    });
  });

  it("should set platformWallet on deployment", async () => {
    let expectedPlatformWallet = accounts[0];
    let platformWallet = await testInstance.platformWallet.call();

    assert.strictEqual(
      platformWallet.toString(),
      expectedPlatformWallet.toString(),
      "Wrong Platform Wallet"
    );
  });

  it("should open an account on contract", async () => {
    await testInstance.deposit(testAmount, {
      from: testAccount,
      value: config._ethFee
    });

    let userAccount = await testInstance.userAccounts.call(testAccount);

    assert.strictEqual(
      userAccount.userBalance.toString(),
      testAmount.toString(),
      "Tokens were not transfered"
    );
  });

  it("should receive bonus on first claim", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);

    let bonusRate = await testInstance.bonusRate.call();

    let interest = testAmount.mul(bonusRate).div(new BN(1000));

    await testInstance.claim({ from: testAccount });

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      interest.toString(),
      difference.toString(),
      "Bonus not claimed"
    );
  });

  it("should receive basic interest on second claim", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);

    let intRate = await testInstance.intRate.call();

    let interest = testAmount.mul(intRate).div(new BN(1000));

    await testInstance.claim({ from: testAccount });

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      interest.toString(),
      difference.toString(),
      "Interest not claimed"
    );
  });

  it("should receive basic interest on third claim through a fallback call", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);

    let intRate = await testInstance.intRate.call();

    let interest = testAmount.mul(intRate).div(new BN(1000));

    await testInstance.send(0, { from: testAccount });

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      interest.toString(),
      difference.toString(),
      "Interest not claimed"
    );
  });

  it("should receive basic interest and retrieve funds on fourth claim", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);

    let intRate = await testInstance.intRate.call();

    let interest = testAmount.mul(intRate).div(new BN(1000));

    await testInstance.claim({ from: testAccount });

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      testAmount.add(interest).toString(),
      difference.toString(),
      "Retrieve unsuccessful"
    );
  });

  /*
  Second round
  */

  it("should re-open an account on contract", async () => {
    await testInstance.deposit(testAmount, {
      from: testAccount,
      value: config._ethFee
    });

    let userAccount = await testInstance.userAccounts.call(testAccount);

    assert.strictEqual(
      userAccount.userBalance.toString(),
      testAmount.toString(),
      "Tokens were not transfered"
    );
  });

  it("should receive basic interest on second-round first claim", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);

    let intRate = await testInstance.intRate.call();

    let interest = testAmount.mul(intRate).div(new BN(1000));

    await testInstance.claim({ from: testAccount });

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      interest.toString(),
      difference.toString(),
      "Interest not claimed"
    );
  });

  it("should receive basic interest on second-round second claim", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);

    let intRate = await testInstance.intRate.call();

    let interest = testAmount.mul(intRate).div(new BN(1000));

    await testInstance.claim({ from: testAccount });

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      interest.toString(),
      difference.toString(),
      "Interest not claimed"
    );
  });

  it("should receive basic interest on second-round third claim through a fallback call", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);

    let intRate = await testInstance.intRate.call();

    let interest = testAmount.mul(intRate).div(new BN(1000));

    await testInstance.send(0, { from: testAccount });

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      interest.toString(),
      difference.toString(),
      "Interest not claimed"
    );
  });

  it("should receive basic interest and retrieve funds on second-round fourth claim", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);

    let intRate = await testInstance.intRate.call();

    let interest = testAmount.mul(intRate).div(new BN(1000));

    await testInstance.claim({ from: testAccount });

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      testAmount.add(interest).toString(),
      difference.toString(),
      "Retrieve unsuccessful"
    );
  });

  it("should revert on third attempt to account creation on contract", async () => {
    await truffleAssert.reverts(
      testInstance.deposit(testAmount, {
        from: testAccount,
        value: config._ethFee
      }),
      "You cannot renew your suscription"
    );
  });

  it("should retrieve remaining tokens from contract", async () => {
    let starting_token_balance = await tokenInstance.balanceOf(testAccount);
    let contractTokenBalance = await tokenInstance.balanceOf(
      testInstance.address
    );

    await testInstance.ERC20Recovery(
      tokenInstance.address,
      contractTokenBalance,
      testAccount,
      { from: testAccount }
    );

    let ending_token_balance = await tokenInstance.balanceOf(testAccount);

    let difference = ending_token_balance.sub(starting_token_balance);

    assert.strictEqual(
      contractTokenBalance.toString(),
      difference.toString(),
      "Retrieve unsuccessful"
    );
  });
});
