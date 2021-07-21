const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [];

const excludeArray = [];
const apiKey = "x870NDe02Ngsu03C3z04sJtHs4yJwTAjGw8GCXPqn4fNPc3ZIBLFVAZldznxLbxV";
const keyPair = {
    secretKey : "636503243171450668778349948372344128422581550386325580613056743855133607389",
    publicKeyX:"0x062e7908e714538e531717ae32ba5babffa1bda62dad109e3ebcc288089d0883",
    publicKeyY:"0x12b0fcdfc3ca325b71572cd75a266b39fc15d801bd769d1383e8f216c442c039"
};

const exchange = "0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4";
const address = '0xF8e0A54aDCBCF9a3793b525a0e188CF9BCbd2E68';
const accountId = 27285;

const wallet = new Wallet(address,accountId,keyPair);

/**
 * payeeAddr,storageId,amount
 */
const basicTransfer = {
    exchange,
    payerId:accountId,
    payerAddr:address,
    payeeId:0,
    token:1,
    feeToken:1,
    maxFeeAmount:"0",
    validUntil:Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60,
    memo:"ORDER Reward:LRC-USDC"
};

async function sendTransfer(transferData) {
    try{
        await submitTransfer(transferData,apiKey);
        return {
            payeeAddr:transferData.payeeAddr,
            result:true
        }
    }catch (e) {
        console.error(e);
        return {
            payeeAddr:transferData.payeeAddr,
            result:false
        }
    }
}

async function getFee(){
    const tokenSymbol =  "LRC"
    let fee = await getOffChainFee(
        accountId,
        3,
        tokenSymbol,
        '0',
        apiKey
    );

    const feeR =  fee.fees.find(fee => fee.token.toLowerCase() === tokenSymbol.toLowerCase())

    console.log("fee",feeR)

    return feeR.fee
}

async function sendRewards() {

    let fArray = [];
    let sArray = [];
    let tArray = []; //threshold

    let storageId;

    const result = await getStorageId(accountId,basicTransfer.token,apiKey);
    console.log(JSON.stringify(result));
    storageId = result.offchainId;

    if(typeof storageId === undefined){
        console.log("storageId is not ready");
        throw new Error('storageId is not ready')
    }

    let fee = await getFee();

    await asyncMap(rewardArray,1,async (i,key) =>{
        if(excludeArray.indexOf(i.address) === -1){
            const actualAmount = new BigNumber(`${i.amount}`).minus(fee)
            if(actualAmount.isPositive()){
                const transfer = wallet.sign36Transfer({
                    ...basicTransfer,
                    payeeAddr:i.address,
                    amount:actualAmount.toFixed(0),
                    storageId:storageId,
                    maxFeeAmount:fee
                });

                console.log(JSON.stringify(transfer));

                const {payeeAddr,result} = await sendTransfer(transfer);
                if(result){
                    sArray.push(payeeAddr);
                    storageId += 2;
                    console.log(`Suc to send reward to ${payeeAddr}`);
                    return -1
                }else{
                    fArray.push(payeeAddr);
                    fee = await getFee();
                    console.log(`Failed to send reward to ${payeeAddr}`);
                    return payeeAddr
                }
            }else {
                tArray.push(i.address);
                console.log(`not enough for fee,no need send to send reward to ${i.address}`);
                return -1
            }
        }
    },function (err,results) {
        if(err){
            console.error(err);
            console.log(JSON.stringify(results.filter(r => r !== -1 )))
        }else {
            console.log(JSON.stringify(results.filter(r => r !== -1 )))
        }
        console.log(`Suc receivers: total is ${sArray.length} ${JSON.stringify(sArray)}`);
        console.log(`low than threshold receivers:total is ${tArray.length} ${JSON.stringify(tArray)}`);
        console.log(`Failed receivers: ${JSON.stringify(fArray)}`);
    });
}


(async () => await sendRewards())();




