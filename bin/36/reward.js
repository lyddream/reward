const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [{"address":"0x59962c3078852ff7757babf525f90cdffd3fddf0","amount":"2.6056372157369133e20"},{"address":"0xf89265592fbb265e79e05656cdc0a59be0d0b656","amount":"1.6046661070540771e19"},{"address":"0x2c468e5794abddac5ccb78adf6c2ec95eb2fd4fb","amount":"1.433457987419718e19"},{"address":"0x26e70acd178221633fe0a5cb569a59fed0eeca51","amount":"1.347223416923986e21"},{"address":"0x22296fc2421d5fe36e462123565f5f0737888888","amount":"2.92327115871018e21"},{"address":"0x2316c9c98be2b5bc4d11fff69f8e488fe14d5694","amount":"1.1008104584499032e19"},{"address":"0xa793df5e3e118dd1d74383d0a4e980ec1c707de4","amount":"1.4933490816814922e21"},{"address":"0x7557373ce7fa65bb3df822f4db45ebc74941d404","amount":"2.3496321189956832e20"},{"address":"0x7b3b1f252169ff83e3e91106230c36be672afde3","amount":"3.090808673182018e20"},{"address":"0xbf7bb48baaf75d8d053f6a5df4a29f8b91ac0244","amount":"2.4009395207699635e20"},{"address":"0xc1198b6ff790aaa79d74239a481fd8f8eb30986d","amount":"1.0277428829292123e21"},{"address":"0x23535535ecb2ce13732f9376ffd5f9a432353535","amount":"2.43472641863417e19"},{"address":"0x175fdd91a22d840b795e69fef9f6c4a2f7512153","amount":"6.472872332207143e19"},{"address":"0xb116e8ac82beca406b5a6175d0cd00d1bb3cb3bb","amount":"2.4419970122207004e16"},{"address":"0xde5129514feb373b91d4f25158907c843d602ea8","amount":"3.3551677042645683e18"},{"address":"0xb1be7eceba2189a95d0eb649288e4e12faf7676a","amount":"3.910505364248775e19"},{"address":"0x9dbba345d5d8e0fa3a054433a5fba7bef1166391","amount":"2.0698182444514378e17"},{"address":"0x555444444dcf1fa122f82157450ed85ebb575753","amount":"6.656860840072494e19"},{"address":"0x20220290fb098b246c257eac76636d2df66606f6","amount":"1.7557130504527587e19"},{"address":"0x39e56360d1c401de9dc14d4a798d770f21571499","amount":"6.47367114087163e18"},{"address":"0x90a699d2b6eb0f7c3170d502c0bdf386f7faf058","amount":"203550893686083"},{"address":"0x3fb6ec2461e3ee1ee79958a0a241844854635c33","amount":"2.5236872986797213e17"},{"address":"0x175741f03b05ae7318dee8426356c39db92a0774","amount":"6.0281118885634785e19"},{"address":"0xff67a86a01c7c90b0c3f3a26b65c25f432ec1751","amount":"7.395837290187777e17"},{"address":"0xd0554b8dc33b4be4bee98718a7b5f8009a67a6b7","amount":"2.434171051607634e20"},{"address":"0x0783ab35326750c49f73d153064bee4bd99b77e6","amount":"1.8372924335615327e18"},{"address":"0x5a092e52b9b3109372b9905fa5c0655417f0f1a5","amount":"2.5353998552194093e19"},{"address":"0xc5a215cdbb69231b2e0f70613afdddbfc1e12c2d","amount":"4.5522232641184584e18"},{"address":"0xbfbfb2a82aa6f38141da1266f9eb5149c0a024cf","amount":"1.8792137068910253e17"},{"address":"0x772227229da53113279327d7f7b104617c7993c9","amount":"1.5403877047659872e21"},{"address":"0xa56d705978ccfc5854973a6bdaa704c3bc645478","amount":"2.044995166876258e17"},{"address":"0x1933d796c47a73cf1639bc3a0d88eee20bc8dec8","amount":"4.316221699449315e18"},{"address":"0xf9b2e1f44df542fa87b278475f607c0f153e0b2e","amount":"7.052814563572138e18"},{"address":"0x5983320af786ac076d6ac1abbad19bfedddd0332","amount":"72489026167596"},{"address":"0x525dc482960d34a4037fe7441039d751aab2dc0a","amount":"5.840102717176138e15"},{"address":"0x8c64a061bfc06869f2fe5975cf597e3e6e14da14","amount":"2.2082161738315824e17"},{"address":"0x710364b39b37b55faaf7a6a2299bea1a31aa07e5","amount":"1.0575266689406554e19"},{"address":"0x504afd735d03b6d4b1aabd101bc5fd2b34a17fcc","amount":"5.702835406085222e17"}]




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
    memo:"ORDER Reward:USDC-USDT "
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




