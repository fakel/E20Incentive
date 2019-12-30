# E20Incentive
Generic smart contract to incentive token transactions

Node Version used v12.13.1

## To use this package, inside the root folder
```
npm install -g truffle ganache-cli && npm install
```

## To compile contracts
```
truffle compile
```

## To make migrations (deployment)

### Configure config.json

* Set the following variables on config.json:
```
{
    "_tokenAddress": "0x0000000000000000000000000000000000000000", //Addres of the token to be used (mainnet only)
    "_ethFee": "2500000000000000", //eth in WEI
    "_minToken": "20000000000", //minimum amount of tokens with all decimals
    "_maxToken": "100000000000",
    "_intRate": 5,//permille interest rate
    "_intRounds": 4,//number of rounds, set to 4 to make test
    "_bonusRate": 50,//permille bonus rate
    "_claimTime": 0,//time in seconds to wait for a claim
}
```

* Set your environment variables (this way for safety)
```
//This is a testing wallet private key, change for yours in main-net
export PRIVKEY="2A741AA7C77146CE5E722EBD8F34AB95D2602D83B0A48B89614F7D99626163FA"

//This key is temporal, suscribe for a free key at Infura
export INFURAKEY="b39b0ffa2e32449488cf70e05b03484a"
```

### After you configure your config.json you can execute
```
# For local environment (--reset to force fresh deployment)
truffle migrate

# For goerli
truffle migrate --network goerli

# For mainnet
truffle migrate --network main
```

## To execute tests
```
npm run test
```