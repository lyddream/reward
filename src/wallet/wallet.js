const exchange = require('../crypto/exchange');
const config = require("../config")
const ethSig = require("../ethereum/crypto/crypto")
const fm = require("../common/formatter")

module.exports =  class Wallet {
  constructor(address, accountId = -1, keyPair = null,ecdsaKey = null) {
    this.address = address;
    this.accountId = accountId;
    this.keyPair = keyPair;
    this.ecdsaKey = ecdsaKey
  }

  signTransfer(transfer) {
    return exchange.signTransfer(
      transfer,
      this.keyPair
    );
  }

  sign36Transfer(transfer){
    return exchange.sign36Transfer(
        transfer,
        this.keyPair
    );
  }

  // 3.6
  async ammJoin(data) {
    data['chainId'] = config.getChainId();
    return  this.ammJoinWithoutDataStructure(data);
  }

  async  ammJoinWithoutDataStructure(data) {
    const hash = exchange.getAmmJoinEcdsaSig(data);
    const result = await ethSig.ethSignHash(hash,this.ecdsaKey);
    console.log('ammJoin_3_6 result', fm.toHex(result));

    return {
      ecdsaSig: fm.toHex(result),
    };
  }

  async  ammExit(data) {
    data['chainId'] = config.getChainId()
    return await this.ammExitWithoutDataStructure(data);
  }

  async  ammExitWithoutDataStructure(data) {
    const hash = exchange.getAmmExitEcdsaSig(data);
    console.log('ammExit hash', hash);
    const result =  await ethSig.ethSignHash(hash,this.ecdsaKey);
    console.log('ammExit_3_6 result', fm.toHex(result));

    return {
      ecdsaSig: fm.toHex(result),
    };
  }

};
