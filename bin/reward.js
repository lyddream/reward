const {getAccount,submitTransfer} = require("../src/api/lightcone");
const Wallet  = require("../src/wallet/wallet");

const startId = 0;
const endId = 0;
const excludeArray = [];
const apiKey = "S6oaSO6r5ktH813RsdwaTYt3EqU6Kj5mO2p9AJcB3VWW3ZYTkuH962bajkndK0Ok";
const keyPair = {
    secretKey : "1960564079557844017577288510450161062109016637276099737260332555161586036225",
    publicKeyX:"7908872213878763480877361736224662992291168969529569356646317058293485615827",
    publicKeyY:"972397044261046143491325751102365894036865709976597886222152959190371496237"
};

const exchangeId = 2;
const address = '0xa3ae668B6239fA3eb1dc26DaAbb03f244d0259f0';
const accountId = 9;


/**
 * for test
 */

// const exludeArray = [1,2,7];
// const apiKey = "Ivxk7g3izIk2RQyoKUCIm3zT68pXXLhUyQOfDXrpvofrrxUXXGoPoR6zlB06kudH";
// const keyPair = {
//     secretKey : "425248493280772583349481733957695261113443491589469083545165592805302794862",
//     publicKeyX:"4545875025091362242428307083632902661939198991370779430179798638063697954898",
//     publicKeyY:"6972475476095673139563046184111115631108117383456688848844331738761822255861"
// };
//
// const exchangeId = 10;
// const address = '0x0306b9d5c9Ed358FC7b77780bACD15398D242f26';
// const accountId = 8;
//
// const startId =  1;
// const endId =  100;




const wallet = new Wallet(address,accountId,keyPair);

/**
 * receiver,nonce
 */
const basicTransfer = {
    exchangeId,
    sender:accountId,
    token:2,
    tokenF:2,
    amount:"40000000000000000000",
    amountF:"0",
    label:211,
    memo:"Reward"
};

async function sendTransfer(transferData) {
    try{
        await submitTransfer(transferData,apiKey);
        return {
            receiver:transferData.receiver,
            result:true
        }
    }catch (e) {
        // console.error(e);
        return {
            receiver:transferData.receiver,
            result:false
        }
    }
}

async function sendRewards() {

    let fArray = [];
    let sArray = [];

    let nonce;

   const result = await getAccount(address);
    console.log(JSON.stringify(result));
    nonce = result.accountNonce;

    if(typeof nonce === undefined){
        console.log("nonce is not ready");
    }

    for(let i = startId;i<endId;i++){
        if(excludeArray.indexOf(i) === -1){
           const transfer =  wallet.signTransfer({
                    ...basicTransfer,
                    receiver:i,
                    nonce:nonce
                });

           console.log(JSON.stringify(transfer));

            const {receiver,result} = await sendTransfer(transfer);
                if(result){
                    sArray.push(receiver);
                    nonce += 1;
                    console.log(`Suc to send reward to ${receiver}`)
                }else{
                    fArray.push(receiver);
                    console.log(`Failed to send reward to ${receiver}`)
                }
        }
    }

    console.log(`Suc receivers: ${JSON.stringify(sArray)}`);
    console.log(`Failed receivers: ${JSON.stringify(fArray)}`);
}

(async () => await sendRewards())();




