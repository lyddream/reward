import {ecsign, hashPersonalMessage,sha3} from 'ethereumjs-util';

function personalSignByKey(msg,ecdsaKey) {
  const hash = hashPersonalMessage(msg);
  const sig = ecsign(hash,ecdsaKey);
  return Buffer.concat([sig.r,sig.s,Buffer.from(sig.v)])
}

function ethSign(msg,ecdsaKey){
  const hash = sha3(msg);
  const sig = ecsign(hash,ecdsaKey);
  return Buffer.concat([sig.r,sig.s,Buffer.from(sig.v)])
}

function ethSignHash(hash,ecdsaKey){
  const sig = ecsign(hash,ecdsaKey);
  return Buffer.concat([sig.r,sig.s,Buffer.from(sig.v)])
}

module.exports = {
  personalSignByKey,
  ethSign,
  ethSignHash
};