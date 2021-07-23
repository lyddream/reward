const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [{"address":"0x8cd59d7965757a99e120fa42cc74baf91628afe0","amount":"3500000000000000000000"},{"address":"0x9dbba345d5d8e0fa3a054433a5fba7bef1166391","amount":"3500000000000000000000"},{"address":"0xcedb62a7672e6415086e8f8ec0a8d73cb2c4f88c","amount":"3500000000000000000000"},{"address":"0xf8878602db9ec79d567ea6a155374e27b9acfbaf","amount":"3500000000000000000000"},{"address":"0xf734289e19e17d208865d25407fb9c8bf87cb72e","amount":"3500000000000000000000"},{"address":"0x9254dc142566bbdefa0d44411d67cc47d3ce41bf","amount":"3500000000000000000000"},{"address":"0x0a15e4953f438eabc49073d5f29ee852a8423435","amount":"3500000000000000000000"},{"address":"0x519ea9f8a5afffb595594d84d3342a586cc898e4","amount":"3500000000000000000000"},{"address":"0x43a110b88e377f48f0b04d3f31e8b86d95b42b1b","amount":"3500000000000000000000"},{"address":"0xe47143fd51814dd62fdde1e283fd9e17d497401b","amount":"3500000000000000000000"},{"address":"0x0ed8e0faeed652afe9960f6f287c69e178b56d6d","amount":"3500000000000000000000"},{"address":"0xa350973d00c608b71e11bd9688ce2e3ec9490a64","amount":"3500000000000000000000"},{"address":"0x512a46857a63adc36fa7f44d7833cfb85051dff5","amount":"3500000000000000000000"},{"address":"0xc15258716ec171ecf31bc7f12742907017571f07","amount":"3500000000000000000000"},{"address":"0x654d250d18f97ccfb403f65886adf996092055e5","amount":"3500000000000000000000"},{"address":"0x6450f4cf7b63443296155b83b7702022d4ca9324","amount":"3500000000000000000000"},{"address":"0x4755e9d35f5a55a9937eb60c98089620d8d62528","amount":"3500000000000000000000"},{"address":"0xd5b7c328eeb244bffa6fb194f6cc760bdf534501","amount":"3500000000000000000000"},{"address":"0x57a446a1f411e82b0fa73a1f6551351ea7d18512","amount":"3500000000000000000000"},{"address":"0x0be8de5b45eba11222de995a0a700bc6a362a8dd","amount":"3500000000000000000000"},{"address":"0xff63b4b32509e7b593d846fff93bf8dbf83a2161","amount":"3500000000000000000000"},{"address":"0x771176f7ceafe5835bf0f562d49cb73993999999","amount":"3500000000000000000000"},{"address":"0x4499b587a18d2850f62bd0340dc2ed89dc22e3f4","amount":"3500000000000000000000"},{"address":"0x9ef7517bb9428c70f066134b9ad67f2572caacb7","amount":"3500000000000000000000"},{"address":"0xc6643a978d9d8a2f900054ad6db805d801c35dec","amount":"3500000000000000000000"},{"address":"0x796a953512de9a57dbb51723362f46f97cb36ba1","amount":"3500000000000000000000"},{"address":"0xd168a574edd0b9de81698c27d388f81ac20b5d0a","amount":"3500000000000000000000"},{"address":"0x40f51eb502ac737b4874925feac8c970f9b01f74","amount":"3500000000000000000000"},{"address":"0x38b964170edf47940a7f70054fae15c4f596e12c","amount":"3500000000000000000000"}]



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
    token:227,
    feeToken:1,
    maxFeeAmount:"0",
    validUntil:Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60,
    memo:"DPR Reward"
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
            const actualAmount = new BigNumber(`${i.amount}`)
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




