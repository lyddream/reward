const {sha3,ecsign,hashPersonalMessage,toBuffer} = require('ethereumjs-util');
const fm = require("../../common/formatter")

function personalSignByKey(msg,ecdsaKey) {
  const hash = hashPersonalMessage(msg);
  const sig = ecsign(hash,toBuffer(ecdsaKey));
  return Buffer.concat([sig.r,sig.s,toBuffer(sig.v)])
}

function ethSign(msg,ecdsaKey){
  const hash = sha3(toBuffer(msg));
  const sig = ecsign(hash,toBuffer(ecdsaKey));
  return Buffer.concat([sig.r,sig.s,toBuffer(sig.v)])
}

function ethSignHash(hash,ecdsaKey){
  const sig = ecsign(toBuffer(hash),toBuffer(ecdsaKey));
  return Buffer.concat([sig.r,sig.s,toBuffer(sig.v)])
}

module.exports = {
  personalSignByKey,
  ethSign,
  ethSignHash
};