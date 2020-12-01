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
  ammJoin(data) {
    data['chainId'] = config.getChainId();
    return  this.ammJoinWithoutDataStructure(data);
  }

  ammJoinWithoutDataStructure(data) {
    const hash = exchange.getAmmJoinEcdsaSig(data);
    const result = ethSig.ethSignHash(hash,this.ecdsaKey);
    return {
      ...data,
      ecdsaSig: fm.toHex(result) + '02',
    };
  }

  ammExit(data) {
    data['chainId'] = config.getChainId()
    return this.ammExitWithoutDataStructure(data);
  }

  ammExitWithoutDataStructure(data) {
    const hash = exchange.getAmmExitEcdsaSig(data);
    console.log('ammExit hash', hash);
    const result =  ethSig.ethSignHash(hash,this.ecdsaKey);
    return {
      ...data,
      ecdsaSig: fm.toHex(result) + '02',
    };
  }

  submitOrder(order) {
    return exchange.signOrder(order, this.keyPair);
  }

};
