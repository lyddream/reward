const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [{"address":"0x38a76454ca9adc0e8150f6a5c97f729a481106db","amount":"5.300267224562513e21"},{"address":"0x22296fc2421d5fe36e462123565f5f0737888888","amount":"4.1637938045417037e18"},{"address":"0xa793df5e3e118dd1d74383d0a4e980ec1c707de4","amount":"2.7224978582852e19"},{"address":"0xf435b54ebbe3be95d9dc1ed75b4e53a0f5265efa","amount":"6.673003538173115e17"},{"address":"0x000000d0606fa1d93e2abfd6a0d25e001c8aa555","amount":"2.928092851165524e18"},{"address":"0x9dbba345d5d8e0fa3a054433a5fba7bef1166391","amount":"8.361032561534963e18"},{"address":"0x70d70f40924de7940f72140e0aa32d82972e2efc","amount":"1.7327167656683424e19"},{"address":"0xff6f7b2afdd33671503705098dd3c4c26a0f0705","amount":"8.556740361650357e18"},{"address":"0x90a699d2b6eb0f7c3170d502c0bdf386f7faf058","amount":"4.0689703165532545e19"},{"address":"0x743e6f37c51edc071a6537ae42f1cfd8c3834b45","amount":"3.943643979754199e17"},{"address":"0x00f7a791936f1d182fb1f892086043fe3a87c6f9","amount":"3.635449265154961e16"},{"address":"0x2a00304f0a269c2e2100f311a3f9b50cde95f475","amount":"8.687829299396777e20"},{"address":"0x35f2051a58fc77adb548b8d38b69640accba7b52","amount":"2.6243455291638896e17"},{"address":"0x900f944d142f164b9dbc4e91ab578cc9c9a0916d","amount":"1.0465115651738626e20"},{"address":"0xa247181d61c08735db7ee6211c8971604ab83a48","amount":"1.7880879075504365e17"},{"address":"0x3fb6ec2461e3ee1ee79958a0a241844854635c33","amount":"1.9462410205760095e18"},{"address":"0xd0554b8dc33b4be4bee98718a7b5f8009a67a6b7","amount":"1.6543706321522126e21"},{"address":"0xb1cf271dc69f77e5a31bb809ea6c0c94f42b62c2","amount":"1.7127318653596214e17"},{"address":"0x92f61e019c65c1b6556744b2b25fa3a548a06074","amount":"5.026381566510028e19"},{"address":"0x6994c53458a196f641a37ecd8e247dd0d380a0dd","amount":"1.5730567317625942e21"},{"address":"0xfE7d9707b58Bf93fB4881c98d374dDdAB8650828","amount":"1.0186004104305065e18"},{"address":"0x64cd43f789274dea013acd9527154780a525d4a1","amount":"1.2197183959709526e20"},{"address":"0x525dc482960d34a4037fe7441039d751aab2dc0a","amount":"1.495408613454402e18"},{"address":"0xfccdd60a1b7409186422c8eb5bec15cafbfd15f5","amount":"1.4602883092513815e18"},{"address":"0x8c64a061bfc06869f2fe5975cf597e3e6e14da14","amount":"5.316385676363811e18"},{"address":"0x77999079448305d5f414da6805cd5751f4444f49","amount":"3.003983293304436e18"},{"address":"0x13543451e3175b4e3ae0d6d900c34fdf79a2b193","amount":"4.1235901613932344e18"},{"address":"0xa102ea62fa12fcdfcfaddfeab875703e10f520c6","amount":"1.0105059990060596e20"},{"address":"0x2453736aca39cbccab4073fe5fa2969c1e732c12","amount":"1.0468150558482421e17"}]


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
    memo:"ORDER Reward:ETH-USDT"
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




