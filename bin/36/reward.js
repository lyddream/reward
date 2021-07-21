const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [{"address":"0x38a76454ca9adc0e8150f6a5c97f729a481106db","amount":"5.583365580414902e19"},{"address":"0x7b3b1f252169ff83e3e91106230c36be672afde3","amount":"2.780402133546432e22"},{"address":"0x9dbba345d5d8e0fa3a054433a5fba7bef1166391","amount":"3.6231937241980865e22"},{"address":"0xff6f7b2afdd33671503705098dd3c4c26a0f0705","amount":"1.6200754720557142e22"},{"address":"0x0089cb1465b4d5e93c0d196f373de72748668dfd","amount":"3.8918672860343545e21"},{"address":"0x90a699d2b6eb0f7c3170d502c0bdf386f7faf058","amount":"6.787042830622724e16"},{"address":"0x743e6f37c51edc071a6537ae42f1cfd8c3834b45","amount":"2.7235030342564168e20"},{"address":"0x2a00304f0a269c2e2100f311a3f9b50cde95f475","amount":"1.6958744590539366e22"},{"address":"0x900f944d142f164b9dbc4e91ab578cc9c9a0916d","amount":"7.245278234167776e21"},{"address":"0x0783ab35326750c49f73d153064bee4bd99b77e6","amount":"8.838479055921263e21"},{"address":"0x8c64a061bfc06869f2fe5975cf597e3e6e14da14","amount":"2.024780890502657e21"},{"address":"0xdbaa0077617fddbed9d165ba2f83690d6634e665","amount":"3.6645798675762947e21"},{"address":"0x6734cbf4d0B5FDf92272a4CDa1591042F5Ca9d95","amount":"7.208334421767904e19"},{"address":"0x77999079448305d5f414da6805cd5751f4444f49","amount":"1.3641763090345474e19"},{"address":"0xa102ea62fa12fcdfcfaddfeab875703e10f520c6","amount":"1.2301573772573845e20"}]


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
    token:240,
    feeToken:1,
    maxFeeAmount:"0",
    validUntil:Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60,
    memo:"ORDER Reward:BKT-USDT"
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
            const actualAmount = new BigNumber(`${i.amount}`).minus(new BigNumber(fee).times(10))
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




