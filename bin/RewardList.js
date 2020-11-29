const {getAccount,submitTransfer} = require("../src/api/lightcone");
const Wallet  = require("../src/wallet/wallet");
const asyncEach = require('async/eachOfLimit');
const asyncMap = require('async/mapLimit');

const rewardArray = [];
const excludeArray = [];
const apiKey = "9NeQR6bxLYU58rJYwrUlI188Gfn9CgogAzrECvaFRMVOr3brF4ihAZhsUwJXQqOd";
const keyPair = {
    secretKey : "2576152258228912579179014096741992751024406873258003092233175609287684631191",
    publicKeyX:"1960620478675837685710013784820802631369980847124067287759483732020663341644",
    publicKeyY:"9623711375129750008430389258017985757225995244201295191628906278187981957487"
};

const exchangeId = 2;
const address = '0x3Df7F4C6887c4E3adE159Bc93B6732770D80cb2B';
const accountId = 1625;


/**
 * for test
 */

// const rewardArray = [3,4,5,6,9];
// const excludeArray = [1,2,7];
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


const wallet = new Wallet(address,accountId,keyPair);

/**
 * receiver,nonce
 */
const basicTransfer = {
    exchangeId,
    sender:accountId,
    token:59,
    tokenF:59,
    amount:"500",
    amountF:"0",
    label:211,
    memo:"QCAD Loopring Reward"
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
        throw new Error('nonce is not ready')
    }

   await asyncMap(rewardArray,1,async (i,key) =>{
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
                console.log(`Suc to send reward to ${receiver}`);
                return -1
            }else{
                fArray.push(receiver);
                console.log(`Failed to send reward to ${receiver}`);
                return receiver
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




