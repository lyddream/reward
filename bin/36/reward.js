const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray =[{"address":"0x38a76454ca9adc0e8150f6a5c97f729a481106db","amount":"4.125437189991144e19"},{"address":"0xf89265592fbb265e79e05656cdc0a59be0d0b656","amount":"3.1887458732779598e19"},{"address":"0x7b3b1f252169ff83e3e91106230c36be672afde3","amount":"2.2960383469427356e19"},{"address":"0x9999996d1c5f48dedfb6eb6be85fe4ef26299934","amount":"1.2916979556445429e17"},{"address":"0x9dbba345d5d8e0fa3a054433a5fba7bef1166391","amount":"8.52126924571481e19"},{"address":"0xfcd95b368e059ffbef0f4c134323b7320310b90f","amount":"3.0641470586293296e20"},{"address":"0xd5a604acf1fcf647142e7e320d7552776cb57590","amount":"7.524218020568465e17"},{"address":"0x90a699d2b6eb0f7c3170d502c0bdf386f7faf058","amount":"2.6621933644845814e17"},{"address":"0x743e6f37c51edc071a6537ae42f1cfd8c3834b45","amount":"2.2232495456052182e17"},{"address":"0x8d50ba56ada4d2101da547c69be792ee08718b54","amount":"1.7034392990441187e17"},{"address":"0x2a00304f0a269c2e2100f311a3f9b50cde95f475","amount":"4.8659759943874845e20"},{"address":"0x900f944d142f164b9dbc4e91ab578cc9c9a0916d","amount":"8.110644995797929e19"},{"address":"0xce54ed055b54f8112f4399afc710110c85d212b4","amount":"4.081710858193948e18"},{"address":"0x328650409920c7ef33a113360cceb091d383f3e1","amount":"2.6346338468593254e18"},{"address":"0x3fb6ec2461e3ee1ee79958a0a241844854635c33","amount":"2.3306646017580126e19"},{"address":"0xd0554b8dc33b4be4bee98718a7b5f8009a67a6b7","amount":"7.829690726473974e19"},{"address":"0x0783ab35326750c49f73d153064bee4bd99b77e6","amount":"1.001986816447111e16"},{"address":"0x8b8fb96ac4d3fed9dfaf97ad3f45eb919d93dc70","amount":"2.704227297425526e18"},{"address":"0x6e45310b69908a7490ebdbb66601462c8da6e46a","amount":"6.971072299599189e19"},{"address":"0x6223b014ebe343b386a57b83202a70a5b364bcd1","amount":"7.348139783277148e18"},{"address":"0x752f6908716cB302c91d296Aa27d52aB271c43ab","amount":"7.906299059780064e21"},{"address":"0xa56d705978ccfc5854973a6bdaa704c3bc645478","amount":"8.03798960154634e20"},{"address":"0x525dc482960d34a4037fe7441039d751aab2dc0a","amount":"4.48348304956104e19"}]


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




