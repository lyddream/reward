const Poseidon =require('./poseidon');
const fm = require('../common/formatter') ;
const ABI = require( '../ethereum/contracts');
const EdDSA = require('./eddsa');
const config = require('../config');
const sha256  = require('crypto-js/sha256');
const ethUtil =  require('ethereumjs-util')
const BN= require('bn.js')

const assert = require('assert');

export function signTransfer(transfer, keyPair, tokens) {
    const inputs = [
        transfer.exchangeId,
        transfer.sender,
        transfer.receiver,
        transfer.token,
        transfer.amount,
        transfer.tokenF,
        transfer.amountF,
        transfer.label,
        transfer.nonce,
    ];

    const hasher = Poseidon.createHash(10, 6, 53);
    const hash = hasher(inputs).toString(10);
    const signature = EdDSA.sign(keyPair.secretKey, hash);

    transfer.signatureRx = signature.Rx;
    transfer.signatureRy = signature.Ry;
    transfer.signatureS = signature.s;

    return transfer;
}

function sign36Transfer(transfer, keyPair) {
    const inputs = [
      new BN(ethUtil.toBuffer(transfer.exchange)).toString(),
      transfer.payerId,
      transfer.payeeId,
      transfer.token,
      transfer.amount,
      transfer.feeTokenID,
      transfer.maxFeeAmount,
      new BN(ethUtil.toBuffer(transfer.payeeAddr)).toString(),
      0,
      0,
      transfer.validUntil,
      transfer.storageId,
    ];

    const hasher = Poseidon.createHash(13, 6, 53);
    const hash = hasher(inputs).toString(10);
    const signature = EdDSA.sign(keyPair.secretKey, hash);

    transfer.eddsaSig = fm.formatEddsaKey(fm.toHex(fm.toBig(signature.Rx))) +
        fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signature.Ry)))) +
        fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signature.s))))

    return  transfer
}

module.exports = {
    signTransfer,
    sign36Transfer
};
