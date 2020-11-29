import {ecsign, hashPersonalMessage} from 'ethereumjs-util';

export function personalSignByKey(msg,ecdsaKey) {
  const hash = hashPersonalMessage(msg);
  const sig = ecsign(hash,ecdsaKey);
  return Buffer.concat([sig.r,sig.s,Buffer.from(sig.v)])
}
