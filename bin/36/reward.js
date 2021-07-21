const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [{"address":"0x900f944d142f164b9dbc4e91ab578cc9c9a0916d","tokenId":1,"amount":"2329300000000000000000"},{"address":"0xff6f7b2afdd33671503705098dd3c4c26a0f0705","tokenId":1,"amount":"1552900000000000000000"},{"address":"0x9dbba345d5d8e0fa3a054433a5fba7bef1166391","tokenId":1,"amount":"1035300000000000000000"},{"address":"0xa3ac9988a89a35641e125a44105f96f787818a22","tokenId":1,"amount":"862700000000000000000"},{"address":"0x743e6f37c51edc071a6537ae42f1cfd8c3834b45","tokenId":1,"amount":"718900000000000000000"},{"address":"0x4b69d0a077a19bd76a41b32d70f71b8c88ba2f0f","tokenId":1,"amount":"599100000000000000000"},{"address":"0xb116e8ac82beca406b5a6175d0cd00d1bb3cb3bb","tokenId":1,"amount":"499300000000000000000"},{"address":"0x90a699d2b6eb0f7c3170d502c0bdf386f7faf058","tokenId":1,"amount":"416000000000000000000"},{"address":"0xa102ea62fa12fcdfcfaddfeab875703e10f520c6","tokenId":1,"amount":"346700000000000000000"},{"address":"0x752f6908716cB302c91d296Aa27d52aB271c43ab","tokenId":1,"amount":"288900000000000000000"},{"address":"0x6a1902bc0141cda8c7038439538785cfb8231080","tokenId":1,"amount":"240800000000000000000"},{"address":"0x175741f03b05ae7318dee8426356c39db92a0774","tokenId":1,"amount":"200600000000000000000"},{"address":"0x7b3b1f252169ff83e3e91106230c36be672afde3","tokenId":1,"amount":"167200000000000000000"},{"address":"0xd0554b8dc33b4be4bee98718a7b5f8009a67a6b7","tokenId":1,"amount":"139300000000000000000"},{"address":"0x6223b014ebe343b386a57b83202a70a5b364bcd1","tokenId":1,"amount":"116100000000000000000"},{"address":"0x8c64a061bfc06869f2fe5975cf597e3e6e14da14","tokenId":1,"amount":"98600000000000000000"},{"address":"0xf435b54ebbe3be95d9dc1ed75b4e53a0f5265efa","tokenId":1,"amount":"80600000000000000000"},{"address":"0x9f99055052067104879b6e655e17a8a795095905","tokenId":1,"amount":"67200000000000000000"},{"address":"0xa793df5e3e118dd1d74383d0a4e980ec1c707de4","tokenId":1,"amount":"56000000000000000000"},{"address":"0x11111db2022d5127c0cff8df5d719f74a0f5c02c","tokenId":1,"amount":"46700000000000000000"},{"address":"0x0783ab35326750c49f73d153064bee4bd99b77e6","tokenId":1,"amount":"38900000000000000000"},{"address":"0x205530b7328ba64202ab33f89e5b75a2d9bc9580","tokenId":1,"amount":"32400000000000000000"},{"address":"0x3ee954a4bd5b65f0df1b9f596bfb11a6111ebc8b","tokenId":1,"amount":"27000000000000000000"},{"address":"0x786442b0d64728221c511fae74d1c4a450a55379","tokenId":1,"amount":"22500000000000000000"},{"address":"0xeb2efa25a92aea369facff87635ff628c013c65e","tokenId":1,"amount":"18800000000000000000"}];

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
    memo:"SWAP Reward:VSP-ETH"
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




