const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [[{"address":"0x22296fc2421d5fe36e462123565f5f0737888888","amount":"6211209490740696695812"},{"address":"0xa793df5e3e118dd1d74383d0a4e980ec1c707de4","amount":"172943376068374842"},{"address":"0x7b3b1f252169ff83e3e91106230c36be672afde3","amount":"9317654469373153299868"},{"address":"0xb116e8ac82beca406b5a6175d0cd00d1bb3cb3bb","amount":"7066161302528439920927"},{"address":"0x6fff68f864c9acdaf457444902e6a2e286877776","amount":"1208063011930190863583"},{"address":"0xff6f7b2afdd33671503705098dd3c4c26a0f0705","amount":"795345775462957323007"},{"address":"0x0e67681d3dbb6fa964dce8a5ce74d14606451871","amount":"27711004273504077"},{"address":"0x0089cb1465b4d5e93c0d196f373de72748668dfd","amount":"3875837005876040891733"},{"address":"0x6b1029c9ae8aa5eea9e045e8ba3c93d380d5bdda","amount":"1355913238960104345062"},{"address":"0x33bb4c9e06dd29c26beb72fb9365b6a9208c0860","amount":"560323183760679787320"},{"address":"0xd1b8db6280049feb166c38022ff8a131f02c0bb0","amount":"1094460803952983691951"},{"address":"0xd74a1d8375eedc1e79aa8b811d197746c1b559c6","amount":"3592576010505672530023"},{"address":"0xa66df139494f0fa22611eb4d50e36bb9928f14c6","amount":"712138310185180135270"},{"address":"0x44c38626ed5d7cc049d355eeadd20c85179965af","amount":"621732995014240605412"},{"address":"0xed7868453591d458fe1df133be070bc9295ee4ba","amount":"903188879985748581062"},{"address":"0xd969dd0bf0c3b4e9a55130f83b9e4ff7c4f1ffdf","amount":"1221011284722213563787"},{"address":"0x80bcc0f1618eb9804fe8fcbd30c49b016d7d601b","amount":"507966301638173036086"},{"address":"0x4229811f18d96e2fbad5e6fea027b6cd2ffa5ba7","amount":"10697169805021291665597"},{"address":"0xa38d28ab2ce27cf074cc5243614990dd9412e1ce","amount":"461481370192304419851"},{"address":"0x6b38085e7b4da3fa7018757615f1c4f293525758","amount":"470013020833330000377"},{"address":"0x7379c9c1c52aabb30cf73c9eba4b4932e50fd064","amount":"577342080662389068345"},{"address":"0x8c64a061bfc06869f2fe5975cf597e3e6e14da14","amount":"1221780738069791905909"},{"address":"0x81cf7584fed0b570d599bb217481b57724744549","amount":"12191196358618147168022"},{"address":"0xdaea96ad29ee7995053c4d85b6954041c4c393be","amount":"1892165353454402536693"},{"address":"0x77999079448305d5f414da6805cd5751f4444f49","amount":"1376915843126770862795"},{"address":"0xb2ebb66c7a20e876ffebd48101ffd28a4bfdcc5d","amount":"2254708199786308797738"},{"address":"0x5983320af786ac076d6ac1abbad19bfedddd0332","amount":"1269218416132469632197"},{"address":"0xa102ea62fa12fcdfcfaddfeab875703e10f520c6","amount":"52833670650818713664963"},{"address":"0xa9ef7a4dd98cb10d3325bfbf559abea4f4165ba4","amount":"272663706374641941131"},{"address":"0x13067dc9912f8f82f75a477555cbc171c7502603","amount":"109059495192306918945"}]];


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
    memo:"AMM Reward:BKT-USDT"
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




