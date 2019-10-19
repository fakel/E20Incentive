const E20 = artifacts.require("E20");
const E20Incentive = artifacts.require("E20Incentive");

contract("E20Incentive", (accounts) => {
  const testAmount = 100;
  const testAccount = accounts[0];
  let tokenInstance;
  let testInstance;

  before(async () => {
    tokenInstance = await E20.deployed();
    testInstance = await E20Incentive.deployed();
    await tokenInstance.approve(testInstance.address,testAmount,{from: testAccount});
    await tokenInstance.transfer(testInstance.address,1000,{from: testAccount});
  })

  it("should open an account on contract", async () => {
    
    await testInstance.deposit(testAmount,{from: testAccount, value: 1});
    
    let userAccount = await testInstance.userAccounts.call(testAccount);

    assert.strictEqual(userAccount.userBalance.toNumber(),testAmount,"Tokens were not transfered");

  });

  it("should receive bonus on first claim", async () => {

    let starting_token_balance = await tokenInstance.balanceOf(testAccount);
    
    let bonusRate = await testInstance.bonusRate.call();

    let interest = testAmount * bonusRate.toNumber() / 1000;

    await testInstance.claim({from: testAccount});

    let ending_token_balance = await tokenInstance.balanceOf(testAccount); 

    let difference = ending_token_balance - starting_token_balance;

    assert.strictEqual(interest,difference,"Bonus not claimed");

  });

  it("should receive basic interest on second claim", async () => {

    let starting_token_balance = await tokenInstance.balanceOf(testAccount);
    
    let intRate = await testInstance.intRate.call();

    let interest = testAmount * intRate.toNumber() / 1000;
    
    await testInstance.claim({from: testAccount});
    
    let ending_token_balance = await tokenInstance.balanceOf(testAccount); 
    
    let difference = ending_token_balance - starting_token_balance;
    
    assert.strictEqual(interest,difference,"Interest not claimed");

  });

  it("should receive basic interest on third claim through a fallback call", async () => {

    let starting_token_balance = await tokenInstance.balanceOf(testAccount);
    
    let intRate = await testInstance.intRate.call();

    let interest = testAmount * intRate.toNumber() / 1000;
    
    await testInstance.send(0,{from: testAccount});
    
    let ending_token_balance = await tokenInstance.balanceOf(testAccount); 
    
    let difference = ending_token_balance - starting_token_balance;
    
    assert.strictEqual(interest,difference,"Interest not claimed");

  });
  
  
  it("should receive basic interest and retrieve funds on third claim", async () => {

    let starting_token_balance = await tokenInstance.balanceOf(testAccount);
    
    let intRate = await testInstance.intRate.call();

    let interest = testAmount * intRate.toNumber() / 1000;
    
    await testInstance.claim({from: testAccount});
    
    let ending_token_balance = await tokenInstance.balanceOf(testAccount); 
    
    let difference = ending_token_balance - starting_token_balance;
    
    assert.strictEqual(interest+testAmount,difference,"Retrieve unsuccessful");

  });
  
  it("should retrieve remaining tokens from contract", async () => {

    let starting_token_balance = await tokenInstance.balanceOf(testAccount);
    let contractTokenBalance = await tokenInstance.balanceOf(testInstance.address);

    await testInstance.ERC20Recovery(tokenInstance.address,contractTokenBalance,testAccount,{from: testAccount});
    
    let ending_token_balance = await tokenInstance.balanceOf(testAccount); 
    
    let difference = ending_token_balance - starting_token_balance;
    
    assert.strictEqual(contractTokenBalance.toNumber(),difference,"Retrieve unsuccessful");

  });
  

});
