const exchange = require('../crypto/exchange');

module.exports =  class Wallet {
  constructor(address, accountId = -1, keyPair = null) {
    this.address = address;
    this.accountId = accountId;
    this.keyPair = keyPair;
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
};
