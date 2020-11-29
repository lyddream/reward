const ethUtil = require('ethereumjs-util');

function personalSignByKey(msg,ecdsaKey) {
  const hash = ethUtil.hashPersonalMessage(msg);
  const sig = ethUtil.ecsign(hash,ecdsaKey);
  return Buffer.concat([sig.r,sig.s,Buffer.from(sig.v)])
}

function ethSign(msg,ecdsaKey){
  const hash = ethUtil.sha3(msg);
  const sig = ethUtil.ecsign(hash,ecdsaKey);
  return Buffer.concat([sig.r,sig.s,Buffer.from(sig.v)])
}

function ethSignHash(hash,ecdsaKey){
  const sig = ethUtil.ecsign(hash,ecdsaKey);
  return Buffer.concat([sig.r,sig.s,Buffer.from(sig.v)])
}

module.exports = {
  personalSignByKey,
  ethSign,
  ethSignHash
};