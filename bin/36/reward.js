const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [{"address":"0x2316c9c98be2b5bc4d11fff69f8e488fe14d5694","amount":"2.747783601460152e17"},{"address":"0xa793df5e3e118dd1d74383d0a4e980ec1c707de4","amount":"525887287354853"},{"address":"0x3ee954a4bd5b65f0df1b9f596bfb11a6111ebc8b","amount":"1.0315295867173937e19"},{"address":"0xf435b54ebbe3be95d9dc1ed75b4e53a0f5265efa","amount":"8.327976739115596e19"},{"address":"0xb116e8ac82beca406b5a6175d0cd00d1bb3cb3bb","amount":"8.741431358197641e17"},{"address":"0xa3ac9988a89a35641e125a44105f96f787818a22","amount":"3.642180488531209e17"},{"address":"0x9dbba345d5d8e0fa3a054433a5fba7bef1166391","amount":"5.0733351359011344e20"},{"address":"0x9d8d98986b2301c685bfe6d965c4995461116996","amount":"7.327243232261051e16"},{"address":"0xfcd95b368e059ffbef0f4c134323b7320310b90f","amount":"2.9074647114981992e20"},{"address":"0xeb2efa25a92aea369facff87635ff628c013c65e","amount":"2.244999557852026e18"},{"address":"0xff6f7b2afdd33671503705098dd3c4c26a0f0705","amount":"2.5032408754407795e17"},{"address":"0x0089cb1465b4d5e93c0d196f373de72748668dfd","amount":"1.4544804351794747e18"},{"address":"0x90a699d2b6eb0f7c3170d502c0bdf386f7faf058","amount":"1.474529021574069e15"},{"address":"0x6a1902bc0141cda8c7038439538785cfb8231080","amount":"7.339427502620248e17"},{"address":"0x743e6f37c51edc071a6537ae42f1cfd8c3834b45","amount":"3.241695512216825e15"},{"address":"0x2a00304f0a269c2e2100f311a3f9b50cde95f475","amount":"5.048587123534792e19"},{"address":"0xf8a57bb83967d21fd19caba32716dc7d855a0a7d","amount":"1.9729451818998803e17"},{"address":"0x900f944d142f164b9dbc4e91ab578cc9c9a0916d","amount":"5.783770984422751e18"},{"address":"0x3fb6ec2461e3ee1ee79958a0a241844854635c33","amount":"7.348324102170006e18"},{"address":"0x175741f03b05ae7318dee8426356c39db92a0774","amount":"5.46683418709476e16"},{"address":"0xff67a86a01c7c90b0c3f3a26b65c25f432ec1751","amount":"4.206671635336248e16"},{"address":"0xc99edcb9941646b036934a290c9aef05d486adb0","amount":"2.829070210684476e18"},{"address":"0xd0554b8dc33b4be4bee98718a7b5f8009a67a6b7","amount":"1.8960526565997665e20"},{"address":"0xd22c8868509ef86da270f793a488d68fbd03a004","amount":"4.038729131462127e18"},{"address":"0x11111db2022d5127c0cff8df5d719f74a0f5c02c","amount":"1.5565242817062692e18"},{"address":"0x6e45310b69908a7490ebdbb66601462c8da6e46a","amount":"9.81145438585174e18"},{"address":"0x777227213304b829da1ab08ae8f06f9a82218228","amount":"2.1751580256000438e17"},{"address":"0x807061df657a7697c04045da7d16d941861caabc","amount":"1.3815990776282819e19"},{"address":"0x431dec52a66166a70916894aeb8066c09bc70aa1","amount":"3.569852152896029e19"},{"address":"0x752f6908716cB302c91d296Aa27d52aB271c43ab","amount":"4.029096057897816e19"},{"address":"0x4b69d0a077a19bd76a41b32d70f71b8c88ba2f0f","amount":"5.721834739487525e16"},{"address":"0x9f99055052067104879b6e655e17a8a795095905","amount":"4.570363486293632e16"},{"address":"0xdaf93a6a56aec45f7b23aebd531177cc531133ef","amount":"1.4134468570977377e18"},{"address":"0x525dc482960d34a4037fe7441039d751aab2dc0a","amount":"4.807501003589462e18"},{"address":"0x8c64a061bfc06869f2fe5975cf597e3e6e14da14","amount":"1.493170994432623e19"},{"address":"0x786442b0d64728221c511fae74d1c4a450a55379","amount":"5.214059165200347e18"},{"address":"0xa102ea62fa12fcdfcfaddfeab875703e10f520c6","amount":"1.0219396720320003e18"},{"address":"0x205530b7328ba64202ab33f89e5b75a2d9bc9580","amount":"1.2781944202615128e19"}]



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
    token:175,
    feeToken:1,
    maxFeeAmount:"0",
    validUntil:Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60,
    memo:"ORDER Reward:VSP-ETH"
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
            const actualAmount = new BigNumber(`${i.amount}`).minus(new BigNumber(fee).dividedBy(20))
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




