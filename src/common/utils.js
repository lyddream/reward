import ethUtils from 'ethereumjs-util';
import fm from './formatter';

/**
 * trim head space and tail space
 * @param str string
 */
function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, '');
}

/**
 * trim all spaces
 * @param str
 */
function trimAll(str) {
  return trim(str).replace(/\s/g, '');
}

function keccakHash(str) {
  return fm.toHex(ethUtils.keccak(str));
}

module.exports =  {
  trim,
  trimAll,
  keccakHash,
};
