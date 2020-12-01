const {getStorageId,submitTransfer} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncEach = require('async/eachOfLimit');
const asyncMap = require('async/mapLimit');

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = []
const excludeArray = [];
const apiKey = "VnocvyZJ64hOh3StH5fUgelIoAWtUYLu8OKTFL2ItoAzEfmgU8kfmbZAZ6ymCxz8";
const keyPair = {
    secretKey : "1967513386679493938611055859229830011114808428329902737767264118586743995828",
    publicKeyX:"0x1335430766536a62b790b3030561660135c74ea7c9feb5f404ac42200f3e42d0",
    publicKeyY:"0xd343ddecd43cae410ac51c034b2526e0c32d631c49fb05f7e0fd28b3f2701db"
};

const exchange = "0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4";
const address = '0x3Df7F4C6887c4E3adE159Bc93B6732770D80cb2B';
const accountId = 10006;

const wallet = new Wallet(address,accountId,keyPair);

// new BN(ethUtil.toBuffer(transfer.exchange)).toString(),
//     transfer.payerId,
//     transfer.payeeId,
//     transfer.token,
//     transfer.amount,
//     transfer.feeTokenID,
//     transfer.maxFeeAmount,
//     new BN(ethUtil.toBuffer(transfer.payeeAddr)).toString(),
//     0,
//     0,
//     transfer.validUntil,
//     transfer.storageId,

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
    memo:"Withdraw Reward"
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

async function sendRewards() {

    let fArray = [];
    let sArray = [];

    let storageId;

    const result = await getStorageId(accountId,basicTransfer.token,apiKey);
    console.log(JSON.stringify(result));
    storageId = result.offchainId;

    if(typeof storageId === undefined){
        console.log("storageId is not ready");
        throw new Error('storageId is not ready')
    }

    await asyncMap(rewardArray,1,async (i,key) =>{
        if(excludeArray.indexOf(i.address) === -1){
            const transfer =  wallet.sign36Transfer({
                ...basicTransfer,
                payeeAddr:i.address,
                amount:i.amount,
                storageId:storageId
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
                console.log(`Failed to send reward to ${payeeAddr}`);
                return payeeAddr
            }
        }
    },function (err,results) {
        if(err){
            console.error(err);
            console.log(JSON.stringify(results.filter(r => r !== -1 )))
        }else {
            console.log(JSON.stringify(results.filter(r => r !== -1 )))
        }
        console.log(`Suc receivers: ${JSON.stringify(sArray)}`);
        console.log(`Failed receivers: ${JSON.stringify(fArray)}`);
    });
}



(async () => await sendRewards())();




