const Wallet  = require("../src/wallet/wallet");
const {encodeTransfer} = require("../src/crypto/exchange");
const ethereumUtil = require("ethereumjs-util");



// "hash": "0x209ce8323f04f79e9983c2fcdf57b02fcc835363710530c099a9fad7f5a81736",
// "apiSig": "0xa20c35e0741225cb741d69ed49e9b9d3c0ec37532c2e264fc2aed2a89a894b00283072f63bba8b270720dfb63a4b28055375f1f836d67ee91dec78ea3e43d5261b",
//0x80fde635276e5d19c87e7f06f66f53c27d83177c85e3bc09861b4e4c0b6531a4

const transferMessage = 'Sign this message to authorize Loopring Pay: ';

const data = encodeTransfer({
    "amount": "10000000000000000000",
    "amountF": "2000000000000000000",
    "exchangeId": 10,
    "label": 211,
    "memo": "",
    "nonce": 0,
    "receiver": 27,
    "sender": 29,
    "token": 2,
    "tokenF": 2
});

console.log(data);

const message = `${transferMessage}${data}`;
console.log(message);

const hash = ethereumUtil.hashPersonalMessage(Buffer.from(message));

console.log(ethereumUtil.bufferToHex(hash));
