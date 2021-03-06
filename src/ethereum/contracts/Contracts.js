const Contract = require('./Contract');

const erc20Abi = require('../../config/abis/erc20.json');
const exchangeAbi = require('../../config/abis/exchange.json');
const contractWalletAbi = require('../../config/abis/contractWallet.json');

const ERC20Token = new Contract(erc20Abi);
const ExchangeContract = new Contract(exchangeAbi);
const ContractWallet = new Contract(contractWalletAbi);

module.exports =  {
  ERC20Token,
  ExchangeContract,
  ContractWallet,
};
