const {getStorageId,submitOrder,joinAmmPool,exitAmmPool} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncEach = require('async/eachOfLimit');
const asyncMap = require('async/mapLimit');

const config = require("../../src/config")
const exchange= "0x7489DE8c7C1Ee35101196ec650931D7bef9FdAD2"
// const ammConfig = {
//     address : "0x1ff8349Bb0eFD8Ad9c13586547402B7487C49e34",
//     name:"LRC-ETH-Pool-3",
//     tokens:[1,0],
//     poolToken:3
// }

const ammConfig = {
    name: "GTO-ETH-Pool-3",
    market: "LP-GTO-ETH",
    address: "0x6dffbB9F9cE41F95dd5c6Ee9E8Ae69D07288740B",
    tokens: [2, 0],
    poolToken: 4
}

const accountConfig = {
    address: "0x23a51c5f860527f971d0587d130c64536256040d",
    ecdsaKey:"0xa99a8d27d06380565d1cf6c71974e7707a81676c4e7cb3dad2c43babbdca2d23",
    accountId:10004,
    keyPair:
        {
        publicKeyX :"13103136684374695350289095362741682192905891799804820610104834006064597112204",
        publicKeyY:"12666653483086790575452501011252776921961480950527939531154404729184461748440",
        secretKey :"81626357400400"
    },
    apiKey:"XfwL0SCMIV9xX0syXIcCNattVN8sVhtFZIqZ3pHhdOfQLWoXsE62V5BzqgfA5lFL"
}

const requests=[
    {
        type:"join",
        data:{
        owner:accountConfig.address,
        joinAmounts: ["2763500000000000000000","1000000000000000000"],
        // joinStorageIDs:[],
        mintMinAmount:"10",
        validUntil:Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60,
        name:ammConfig.name,
        chainId: config.getChainId(),
        poolAddress:ammConfig.address,
        exchange:exchange
        }
    },
    // {
    //    type:"order",
    //    data:{
    //        exchange,
    //        // storageId,
    //        accountId:accountConfig.accountId,
    //        tokenSId:ammConfig[1],
    //        tokenBId:ammConfig[0],
    //        amountS:"20000000000000000",
    //        amountB:"52969000000000000000",
    //        validSince : Math.ceil(new Date().getTime() / 1000) - 3600,
    //        validUntil:Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60,
    //        orderType:'AMM',
    //        poolAddress:ammConfig.address
    //    }
    // },
    // {
    //     type:"exit",
    //     data:{
    //         exchange:exchange,
    //         owner:accountConfig.address,
    //         poolAddress:ammConfig.address,
    //         burnAmount: "",
    //      //   burnStorageID: 1,
    //         exitMinAmounts: [],
    //         fee: "0",
    //         validUntil: Math.ceil(new Date().getTime() / 1000) + 3600 * 24 * 60
    //     }
    // }
]

const wallet = new Wallet(accountConfig.address,accountConfig.accountId,accountConfig.keyPair,accountConfig.ecdsaKey);

async function submitRequest(request){
        switch (request.type) {
            case "join":
                const storageId0 = await getStorageId(accountConfig.accountId, ammConfig.tokens[0], accountConfig.apiKey);
                console.log("storageId0",storageId0);
                const storageId1 = await getStorageId(accountConfig.accountId, ammConfig.tokens[1], accountConfig.apiKey);
                console.log("storageId1",storageId1);
                const joinStorageIDs = [storageId0.offchainId, storageId1.offchainId];
                const _join = request.data
                _join.joinStorageIDs = joinStorageIDs
                const join = wallet.ammJoin(_join)
                console.log("join",join);
                 await joinAmmPool(join, join.ecdsaSig, accountConfig.apiKey)
                break;
            case "order":
                const storageId = await getStorageId(accountConfig.accountId, request.data.tokenSId, accountConfig.apiKey);
                const _order = request.data
                _order.storageId = storageId.orderId
                const order = wallet.submitOrder(_order)
                await submitOrder(order, accountConfig.apiKey)

                break;
            case "exit":
                const burnStorageId = await getStorageId(accountConfig.accountId,ammConfig.poolToken, accountConfig.apiKey);
                const _exit = request.data
                _exit.burnStorageID = burnStorageId.offchainId
                const exit = wallet.ammExit(_exit)
                await exitAmmPool(exit, exit.ecdsaSig,accountConfig.apiKey)

                break;
            default:
                break
        }
}


async function recover() {
  return await asyncMap(requests,1,async (request,key) =>{
       try{
           await submitRequest(request);
           return 1
        }catch(e){
           console.log(`failed to submit ${request.type}`)
           throw e
       }
     },function (err,results) {
        if(err){
            console.error(err);
        }else {
         console.log("succeed to recover")
        }
    });
}

(async () => await recover())();