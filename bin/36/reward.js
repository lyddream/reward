const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [{"address":"0x36558d19324a1af2236cbb506277b22f2182c352","amount":"45158164173788215920"},{"address":"0x8bb647e93587b27422920166d08c640161b6684d","amount":"110143336004271167976"},{"address":"0x469281431cedfc789279bc8e651706085bf3a2e3","amount":"4434681543803324737488"},{"address":"0x610d6670739068977789d9708e1e8354a53d586b","amount":"461461787749277961024"},{"address":"0xde57e6e65375a38faf744554d63739e5be09f88d","amount":"7572115384615224"},{"address":"0x866c521883bc8cb7c59769e2a06ef38cc685915e","amount":"219431116452986798544"},{"address":"0x74874b09e16e1bf3c116df3fa64ba6f29bd91c42","amount":"1709097832086858334488"},{"address":"0xc248f9b1451067d8c55296f256b51a25d5b7abd6","amount":"860791938212232453624"},{"address":"0x6504bbe7b222c360a7d0087ece417cad26d95662","amount":"12555480324073807754400"},{"address":"0xeead3e6ac0f1175731a38fbe2726f9dab6c769ae","amount":"358730773682328573144"},{"address":"0xe65f3930aa2cc8711ef0d8c2244978a7f4a66c6a","amount":"3537842223112460569848"},{"address":"0x36bf95fbd49a9bd3febe597f37a520695a285314","amount":"388776647079763833264"},{"address":"0xebc38a4c7e2c804088efd568058ed13713e7c6a3","amount":"1196245530626755252704"},{"address":"0xf7242166c7d324cd264d2a9f1ab2d72ce3b456c3","amount":"347128797186602323512"},{"address":"0x39dc119864c17968b9f06887678a90ef1942f442","amount":"957079549501404200400"},{"address":"0x7cf7d9ab22d62486d9c79585acd4841817ae68bc","amount":"133036333689455867568"},{"address":"0xc917d70fff17abd6ced60b77f0be6253de10ed26","amount":"892380341880322951680"},{"address":"0x885c511aa5c6a3f7fb50fb803e749eae594c669a","amount":"12713675213674944"},{"address":"0xed7868453591d458fe1df133be070bc9295ee4ba","amount":"68227221331907384712"},{"address":"0xd9c6c434e7ec14021e49916cd3d845a87a39f89a","amount":"302472293447287031424"},{"address":"0xdaa9a1db7cd436121f03ef898642b533dc89672e","amount":"114630266203701272232"},{"address":"0xeb42d02be9ed6c3b7e57ea3466a8b29ac80323d8","amount":"126557500890310705848"},{"address":"0xbed382f152b3ec36109f554b3642e7873d706e2f","amount":"103933110754983550416"},{"address":"0xe42423f4dae6f59820873e78fb5f38ed1c295b64","amount":"1026118856837585072160"},{"address":"0xa102ea62fa12fcdfcfaddfeab875703e10f520c6","amount":"307060122863241350064"}]


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
    token:217,
    feeToken:1,
    maxFeeAmount:"0",
    validUntil:Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60,
    memo:"AMM Reward:BCDT-ETH"
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
            const actualAmount = new BigNumber(`${i.amount}`).minus(new BigNumber(fee).times(2))
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




