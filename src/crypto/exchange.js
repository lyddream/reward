const Poseidon =require('./poseidon');
const fm = require('../common/formatter') ;
const ABI = require( '../ethereum/contracts');
const EdDSA = require('./eddsa');
const config = require('../config');
const sha256  = require('crypto-js/sha256');
const ethUtil =  require('ethereumjs-util')
const BN= require('bn.js')
const sigUtil = require('eth-sig-util');

const assert = require('assert');

function signTransfer(transfer, keyPair, tokens) {
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
      transfer.feeToken,
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

/**
 *
 * @param data
 * @returns {{types: {PoolJoin: [{name: string, type: string}, {name: string, type: string}, {name: string, type: string}, {name: string, type: string}, {name: string, type: string}], EIP712Domain: [{name: string, type: string}, {name: string, type: string}, {name: string, type: string}, {name: string, type: string}]}, primaryType: string, domain: {chainId: *, name: *, version: string, verifyingContract: *}, message: {owner: *, joinAmounts: *, joinStorageIDs: *, mintMinAmount: *, validUntil: *}}}
 */
function getAmmJoinEcdsaTypedData(data) {
    let message = {
        owner: data['owner'],
        joinAmounts: data['joinAmounts'],
        joinStorageIDs: data['joinStorageIDs'],
        mintMinAmount: data['mintMinAmount'],
        validUntil: data['validUntil'],
    };
    const typedData = {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            PoolJoin: [
                { name: 'owner', type: 'address' },
                { name: 'joinAmounts', type: 'uint96[]' },
                { name: 'joinStorageIDs', type: 'uint32[]' },
                { name: 'mintMinAmount', type: 'uint96' },
                { name: 'validUntil', type: 'uint32' },
            ],
        },
        primaryType: 'PoolJoin',
        domain: {
            name: data['name'],
            version: '1.0.0',
            chainId: data['chainId'],
            verifyingContract: data['exchange'],
        },
        message: message,
    };

    console.log('typedData', typedData);
    return typedData;
}


function getAmmJoinEcdsaSig(data) {
    console.log('getAmmJoinEcdsaSig', data);
    const typedData = getAmmJoinEcdsaTypedData(data);
    const hash = sigUtil.TypedDataUtils.sign(typedData);
    console.log('hash', fm.toHex(hash));
    return fm.toHex(hash);
}

function getAmmExitEcdsaTypedData(data) {
    let message = {
        owner: data['owner'],
        burnAmount: data['burnAmount'],
        burnStorageID: data['burnStorageID'],
        exitMinAmounts: data['exitMinAmounts'],
        fee: data['fee'],
        validUntil: data['validUntil'],
    };
    const typedData = {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            PoolExit: [
                { name: 'owner', type: 'address' },
                { name: 'burnAmount', type: 'uint96' },
                { name: 'burnStorageID', type: 'uint32' },
                { name: 'exitMinAmounts', type: 'uint96[]' },
                { name: 'fee', type: 'uint96' },
                { name: 'validUntil', type: 'uint32' },
            ],
        },
        primaryType: 'PoolExit',
        domain: {
            name: data['name'],
            version: '1.0.0',
            chainId: data['chainId'],
            verifyingContract: data['exchange'],
        },
        message: message,
    };

    console.log('typedData', typedData);
    return typedData;
}

function getAmmExitEcdsaSig(data) {
    console.log('getAmmExitEcdsaSig', data);
    const typedData = getAmmExitEcdsaTypedData(data);
    const hash = sigUtil.TypedDataUtils.sign(typedData);
    console.log('hash', fm.toHex(hash));
    return fm.toHex(hash);
}


//orderType == AMM, poolAddress for amm
function signOrder(_order, keyPair) {
    if (_order.signature !== undefined) {
        return;
    }

    const order = setupOrder(_order);
    const hasher = Poseidon.createHash(12, 6, 53);

    // Calculate hash
    const inputs = [
        order.exchange,
        order.storageId,
        order.accountId,
        order.tokenSId,
        order.tokenBId,
        order.amountS,
        order.amountB,
        order.validUntil,
        order.maxFeeBips,
        order.fillAmountBOrS ? 1 : 0,
    ];
    console.log('Calculate hash inputs', inputs);

    order.hash = hasher(inputs).toString(10);

    // Create signature
    const signature = EdDSA.sign(keyPair.secretKey, order.hash);

    order['eddsaSig'] = fm.formatEddsaKey(fm.toHex(fm.toBig(signature.Rx))) +
        fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signature.Ry)))) +
        fm.clearHexPrefix(fm.formatEddsaKey(fm.toHex(fm.toBig(signature.s))))

    order.buy = undefined;
    order.hash = undefined;

    return order;
}

function setupOrder(order) {
    // 3.6 change
    order.fillAmountBOrS = order.buy !== undefined ? !!order.buy : false;

    order.maxFeeBips =
        order.maxFeeBips !== undefined ? order.maxFeeBips : 50;
    order.allOrNone = order.allOrNone !== undefined ? !!order.allOrNone : false;

    order.feeBips =
        order.feeBips !== undefined ? order.feeBips : order.maxFeeBips;

    console.log('setupOrder', order);

    // Sign the order
    return order;
}


module.exports = {
    signTransfer,
    sign36Transfer,
    getAmmJoinEcdsaSig,
    getAmmExitEcdsaSig,
    signOrder
};
