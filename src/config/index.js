const fm = require('../common/formatter');
const config = require('./config.json');

function getServer() {
  return config.server
}

function getServer36(){
    return config.server_36
}

function getTokenBySymbol(symbol, tokens) {
  return (
    tokens.find(
      (token) => token.symbol.toLowerCase() === symbol.toLowerCase()
    ) || {}
  );
}

function fromWEI(symbol, valueInWEI, tokens, { precision, ceil } = {}) {
  const token = getTokenBySymbol(symbol, tokens);
  const precisionToFixed = precision ? precision : token.precision;
  const value = fm.toBig(valueInWEI).div('1e' + token.decimals);
  return fm.toFixed(value, precisionToFixed, ceil);
}

function toWEI(symbol, value, tokens) {
  const token = getTokenBySymbol(symbol, tokens);
  if (typeof token === 'undefined') {
    return 0;
  }
  return fm.toBig(value)
    .times('1e' + token.decimals)
    .toFixed(0);
}

function getChainId() {
 return  config.chainId
}

module.exports = {
    getServer,
    getServer36,
    getChainId
};
