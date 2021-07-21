const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const  BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray =[{"address":"0x7b3b1f252169ff83e3e91106230c36be672afde3","amount":"343555308938746317814970"},{"address":"0xed7868453591d458fe1df133be070bc9295ee4ba","amount":"6823787393162390760420"},{"address":"0x7379c9c1c52aabb30cf73c9eba4b4932e50fd064","amount":"18304502314814808371630"},{"address":"0xdaea96ad29ee7995053c4d85b6954041c4c393be","amount":"759360754985754718460"},{"address":"0x0089cb1465b4d5e93c0d196f373de72748668dfd","amount":"6554446225071222764060"},{"address":"0x36558d19324a1af2236cbb506277b22f2182c352","amount":"6392841880341878091600"},{"address":"0x48e32a0b55b25c5367889dbc8d70effac7a67884","amount":"6049965277777775648190"},{"address":"0xca1a0ea2cdb272ae65641dff85ce33b3be25936c","amount":"6128453525641023483810"},{"address":"0x413a2dcf304d14e0567b6ded34ab8a87f63f90bf","amount":"5877215099715097646320"},{"address":"0x0fd837ae5baf73f58741ab1e1e780e46f461d69d","amount":"7795135327635324891440"},{"address":"0x36573638600380d7e9ac3a864605dbef38809945","amount":"286480504807692206851170"},{"address":"0xa485224862e52643e8b5fa546d8b9615291e767e","amount":"85684123041310511149730"},{"address":"0xe0892bb8f15324ad324a2ae6bacf20ca4b5697f9","amount":"33040625890313378683090"},{"address":"0x92e4b7475c17c63158f8f527d1427986f6c1709c","amount":"100090633012820477588610"},{"address":"0x5983320af786ac076d6ac1abbad19bfedddd0332","amount":"5682987001424499424090"},{"address":"0xa102ea62fa12fcdfcfaddfeab875703e10f520c6","amount":"49801564280626763096630"},{"address":"0x77999079448305d5f414da6805cd5751f4444f49","amount":"3378177528490027300910"},{"address":"0x176028bb3f39ff2d68e40c86f3d112900aaebab1","amount":"24383280804843296260390"},{"address":"0xa793df5e3e118dd1d74383d0a4e980ec1c707de4","amount":"300925925925925820"}]

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
    token:239,
    feeToken:1,
    maxFeeAmount:"0",
    validUntil:Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60,
    memo:"AMM Reward:DEP-ETH"
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
            const actualAmount = new BigNumber(`${i.amount}`).minus(new BigNumber(fee).times(20))
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




