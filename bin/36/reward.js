const {getStorageId,submitTransfer,getOffChainFee,getExchangeInfo} = require("../../src/api/lightcone36");
const Wallet  = require("../../src/wallet/wallet");
const asyncMap = require('async/mapLimit');
const BigNumber = require("bignumber.js");

//{address:"0xa675dafa4d6eb83537f9cec33d8adfd56365431a",amount:"5266203717660600320"}

const rewardArray = [{"address":"0x59962c3078852ff7757babf525f90cdffd3fddf0","accountId":"10002","amount":"357230655693672121761"},{"address":"0x1369123c1650ad57e5c2f934407ace6075962da4","accountId":"10003","amount":"253169097193502619"},{"address":"0x38a76454ca9adc0e8150f6a5c97f729a481106db","accountId":"10011","amount":"194320554915866866783"},{"address":"0xf89265592fbb265e79e05656cdc0a59be0d0b656","accountId":"10012","amount":"55581009392218004492"},{"address":"0x2c468e5794abddac5ccb78adf6c2ec95eb2fd4fb","accountId":"10013","amount":"24259976774874837854"},{"address":"0x26e70acd178221633fe0a5cb569a59fed0eeca51","accountId":"10014","amount":"935577724839606423866"},{"address":"0x22296fc2421d5fe36e462123565f5f0737888888","accountId":"10016","amount":"1426481978685791009712"},{"address":"0x2316c9c98be2b5bc4d11fff69f8e488fe14d5694","accountId":"10019","amount":"4562321234271901063"},{"address":"0xa793df5e3e118dd1d74383d0a4e980ec1c707de4","accountId":"10021","amount":"68738423321510848280"},{"address":"0x7f81d533b2ea31be2591d89394add9a12499ff17","accountId":"10022","amount":"2351066529233970533"},{"address":"0x7557373ce7fa65bb3df822f4db45ebc74941d404","accountId":"10023","amount":"729517760351724873639"},{"address":"0x3ee954a4bd5b65f0df1b9f596bfb11a6111ebc8b","accountId":"10028","amount":"1568153819116383547"},{"address":"0x7b3b1f252169ff83e3e91106230c36be672afde3","accountId":"10033","amount":"224627113536359822452"},{"address":"0xbf7bb48baaf75d8d053f6a5df4a29f8b91ac0244","accountId":"10034","amount":"1555733784710324736755"},{"address":"0xc1198b6ff790aaa79d74239a481fd8f8eb30986d","accountId":"10069","amount":"793378883141978010295"},{"address":"0x23535535ecb2ce13732f9376ffd5f9a432353535","accountId":"10070","amount":"57898901538577610062"},{"address":"0x175fdd91a22d840b795e69fef9f6c4a2f7512153","accountId":"10076","amount":"21127892650136777878"},{"address":"0x86867667269d6e270ab82e71204f51ccc77c777c","accountId":"10079","amount":"237427194830383759"},{"address":"0x105055c1a48466220ae8343df234f26f05555505","accountId":"10080","amount":"1462293168559676993"},{"address":"0x8849bdf80394fc7ac4e937543a1470821642d40a","accountId":"10084","amount":"1443408194855531160"},{"address":"0xf435b54ebbe3be95d9dc1ed75b4e53a0f5265efa","accountId":"10085","amount":"21734716550449744294"},{"address":"0x548678d6bb65869038bcb26daac6ea337c222222","accountId":"10090","amount":"327661119756350972"},{"address":"0x576847758a6a30c18b34be86ef6ad82562ecbbba","accountId":"10094","amount":"9522077990056076820"},{"address":"0xb116e8ac82beca406b5a6175d0cd00d1bb3cb3bb","accountId":"10096","amount":"1780799487566506924"},{"address":"0x5135671666656335a97ee5f29fe672efc399c1ee","accountId":"10105","amount":"486292071527257659"},{"address":"0xde5129514feb373b91d4f25158907c843d602ea8","accountId":"10126","amount":"8303004977248323966"},{"address":"0x000000d0606fa1d93e2abfd6a0d25e001c8aa555","accountId":"10146","amount":"320237613779245613"},{"address":"0xbfd8c5f304ebe72dcb63db29ea78e12284823438","accountId":"10160","amount":"1507776376482490060"},{"address":"0xd657d3c86e46aedad88402374da8d356cf3af2db","accountId":"10188","amount":"232519175452437341"},{"address":"0xb1be7eceba2189a95d0eb649288e4e12faf7676a","accountId":"10244","amount":"142757235536443278616"},{"address":"0x30c247a5fc7488324f7284856edcb4bba29ba14f","accountId":"10288","amount":"1826350713515352930"},{"address":"0xa3ac9988a89a35641e125a44105f96f787818a22","accountId":"10294","amount":"150489461653762826124"},{"address":"0x9dbba345d5d8e0fa3a054433a5fba7bef1166391","accountId":"10295","amount":"287953560511476127237"},{"address":"0x9d8d98986b2301c685bfe6d965c4995461116996","accountId":"10357","amount":"386624838557079161"},{"address":"0xfcd95b368e059ffbef0f4c134323b7320310b90f","accountId":"10399","amount":"111489979237191654626"},{"address":"0x555444444dcf1fa122f82157450ed85ebb575753","accountId":"10472","amount":"46375971296831857512"},{"address":"0xf6ec10dd67d77f2d9accb7804abfdb445f774148","accountId":"10556","amount":"82794608854398125133"},{"address":"0xeb2efa25a92aea369facff87635ff628c013c65e","accountId":"10579","amount":"443171010451319466"},{"address":"0xd5a604acf1fcf647142e7e320d7552776cb57590","accountId":"10593","amount":"45411914263702826347"},{"address":"0x569cda6d421eb959914dbb6b97a9da9181b0eca3","accountId":"10630","amount":"206144485567878636"},{"address":"0xabcdeacfd39c8d115debbc1c1e6655e8bb0280cb","accountId":"10646","amount":"194185493974779976"},{"address":"0x70d70f40924de7940f72140e0aa32d82972e2efc","accountId":"10712","amount":"66056880819077584877"},{"address":"0xff6f7b2afdd33671503705098dd3c4c26a0f0705","accountId":"10917","amount":"130944743362705338762"},{"address":"0x20220290fb098b246c257eac76636d2df66606f6","accountId":"10942","amount":"1453800530235696076"},{"address":"0x0e67681d3dbb6fa964dce8a5ce74d14606451871","accountId":"10963","amount":"716994412691791555"},{"address":"0x39e56360d1c401de9dc14d4a798d770f21571499","accountId":"11022","amount":"1884080027629204441"},{"address":"0x20c2cb4cd3050e72b1b9b175f924d9886ca44eb4","accountId":"11097","amount":"1416294359729218553"},{"address":"0x0089cb1465b4d5e93c0d196f373de72748668dfd","accountId":"11219","amount":"8176270847545168606"},{"address":"0xe9e0557f8c73d7247fee9577b420d96adfc97ff1","accountId":"11267","amount":"88657202991740790543"},{"address":"0xc15792b8578fc26c10de7f88191ecff579151866","accountId":"11344","amount":"152683292335848606"},{"address":"0x90a699d2b6eb0f7c3170d502c0bdf386f7faf058","accountId":"11375","amount":"148083977499773202866"},{"address":"0x6a1902bc0141cda8c7038439538785cfb8231080","accountId":"11388","amount":"209845186702388589"},{"address":"0x743e6f37c51edc071a6537ae42f1cfd8c3834b45","accountId":"11519","amount":"58793902033862857684"},{"address":"0xee260bdeecc3fb2dbefb41f492b89e1b92b2bac5","accountId":"11524","amount":"10630743150391431785"},{"address":"0x00f7a791936f1d182fb1f892086043fe3a87c6f9","accountId":"11579","amount":"103887371273718210"},{"address":"0xd952b2059208993e434984b54efe40617a4efbc4","accountId":"11725","amount":"12222160690395493064001"},{"address":"0xe937030b21267fe970c6603f7458d55c0decb6b5","accountId":"11761","amount":"3820492398602849123"},{"address":"0x2a00304f0a269c2e2100f311a3f9b50cde95f475","accountId":"11836","amount":"102871685589358684600"},{"address":"0xf1479af81176cead86a155940bb7c8d5366ed31d","accountId":"12071","amount":"136868000000000000"},{"address":"0xf8a57bb83967d21fd19caba32716dc7d855a0a7d","accountId":"12178","amount":"889273102172212344"},{"address":"0x2ef82618ba1cdacdc5332316c0f363d5e3b838e9","accountId":"12281","amount":"4851727846869067190"},{"address":"0x900f944d142f164b9dbc4e91ab578cc9c9a0916d","accountId":"12356","amount":"126187220129419279854"},{"address":"0xa247181d61c08735db7ee6211c8971604ab83a48","accountId":"13284","amount":"1279264241903323778"},{"address":"0xce54ed055b54f8112f4399afc710110c85d212b4","accountId":"15176","amount":"1394700472254035117"},{"address":"0x8eb3fbb4a0cc2366e88fb476df63d3ad6907907b","accountId":"16473","amount":"59007686125051884"},{"address":"0xe973154abaa89ccbc0af5ff3d4dca63a21ead958","accountId":"16814","amount":"237476120074688591"},{"address":"0xd455992691f18b447823dd12c28bc31626706244","accountId":"17685","amount":"165711580317723859"},{"address":"0x11f0c025de18b6a66fba5c71126acaa929c81b57","accountId":"18034","amount":"1987170259235500547"},{"address":"0x97314041a2721844a0f114aefcf1fabd02fb84f7","accountId":"18461","amount":"145180568469580804516"},{"address":"0xf29a349f28acab8e946b013505372ffbd1c01733","accountId":"18523","amount":"243372460344122966"},{"address":"0x328650409920c7ef33a113360cceb091d383f3e1","accountId":"19200","amount":"769365800000000000"},{"address":"0xefb595764007ebe3a5ad760baf422f391b8f1420","accountId":"19504","amount":"1616470386777857439"},{"address":"0xa0c2d3ad9c5100a6a5daa03dc6bab01f0d54c361","accountId":"19619","amount":"567434731472397268"},{"address":"0xe632ea637b4b9bc58b62d7dee8c752962adb4b5b","accountId":"19725","amount":"2119378253838100721"},{"address":"0x3fb6ec2461e3ee1ee79958a0a241844854635c33","accountId":"19784","amount":"3643441754008817032"},{"address":"0x175741f03b05ae7318dee8426356c39db92a0774","accountId":"19794","amount":"41679430327418646872"},{"address":"0xf7bd743caf55cdecf665c6b52777c2f224ed596a","accountId":"20354","amount":"2769806687404602718"},{"address":"0x100e0111c9d4ab70b0ed51e3d7a5d14d6e996666","accountId":"20474","amount":"196589240934304365"},{"address":"0x9f28ddaa2c0f43300863208474020b141b197e97","accountId":"20484","amount":"18248628598686363357"},{"address":"0xff67a86a01c7c90b0c3f3a26b65c25f432ec1751","accountId":"20485","amount":"95464376879336321"},{"address":"0x6418e43a93da347fc047545ff71d05695af6e546","accountId":"20595","amount":"256894022775132485"},{"address":"0xd0554b8dc33b4be4bee98718a7b5f8009a67a6b7","accountId":"21662","amount":"121272745063803881085"},{"address":"0xf4cea077229e9bece1d37c2eb61fc8ed91296dd5","accountId":"22218","amount":"1062659614918091182"},{"address":"0xd22c8868509ef86da270f793a488d68fbd03a004","accountId":"22229","amount":"15718798371170311405"},{"address":"0x92f61e019c65c1b6556744b2b25fa3a548a06074","accountId":"22456","amount":"49440111650373915657"},{"address":"0x0783ab35326750c49f73d153064bee4bd99b77e6","accountId":"22641","amount":"15271572457831052034"},{"address":"0xa133ba39fea5f75ec79131096e6881540e3a6fd6","accountId":"22865","amount":"342550317657222444436"},{"address":"0x8b8fb96ac4d3fed9dfaf97ad3f45eb919d93dc70","accountId":"23086","amount":"71105569601147126"},{"address":"0x33bb4c9e06dd29c26beb72fb9365b6a9208c0860","accountId":"23197","amount":"783392000000000000"},{"address":"0xa72036c0b9afd47825e4bdfa2dedb3e0d997a916","accountId":"23350","amount":"125722201615033394"},{"address":"0xef1244af7099dce45ee7f937534f0968501efb29","accountId":"23567","amount":"1117740149428323459"},{"address":"0x1cb4e967c7bdaefbb9a2dbf48a83d63fdeff5333","accountId":"23885","amount":"887357135579789441"},{"address":"0x5a092e52b9b3109372b9905fa5c0655417f0f1a5","accountId":"24122","amount":"2823484328817820323"},{"address":"0xf8c77f282313e65cb99b7567b9f0b787dd6e0110","accountId":"24254","amount":"213624800000000000"},{"address":"0xc28a4bf9359845554bdad503d794de54ca44dc80","accountId":"24348","amount":"26070776000000000000"},{"address":"0xda44a081ab292c2e89e61197abec717cd5e16242","accountId":"24474","amount":"1273138529866797479"},{"address":"0x35438fe42af3c15685f4fa9272c2a3d037a2d493","accountId":"25637","amount":"2044629056834088472"},{"address":"0x11111db2022d5127c0cff8df5d719f74a0f5c02c","accountId":"26280","amount":"123633721638009326"},{"address":"0xd87cfd8757db0aa5b3380bc8009881f64f76bd20","accountId":"26855","amount":"188712284442096524"},{"address":"0x6e45310b69908a7490ebdbb66601462c8da6e46a","accountId":"27127","amount":"8343363197238506079"},{"address":"0x5fe5838575ef7bd84dd0d71af9b4d44e1f1ba8c6","accountId":"27145","amount":"6636918013946230810"},{"address":"0x777227213304b829da1ab08ae8f06f9a82218228","accountId":"27280","amount":"107923142522923663"},{"address":"0x807061df657a7697c04045da7d16d941861caabc","accountId":"27384","amount":"5704175599777727763"},{"address":"0x6223b014ebe343b386a57b83202a70a5b364bcd1","accountId":"27448","amount":"588012864463756310"},{"address":"0x4e92689e6afe4c9e841bffe5776e9f550147cc15","accountId":"27701","amount":"1651060743387041998"},{"address":"0x38552868c1e638009eaf2920c7e85a2aea56c8c1","accountId":"28248","amount":"4732273732327459"},{"address":"0xeff67117613243d1d1d30f48bdf0c1a288bf7c74","accountId":"28309","amount":"27552780319233236481"},{"address":"0x8b8cbb01c288b0e403e64d9be15d06b65e1b7929","accountId":"28352","amount":"64364114740761739254"},{"address":"0x6994c53458a196f641a37ecd8e247dd0d380a0dd","accountId":"28353","amount":"517656565820219797854"},{"address":"0x431dec52a66166a70916894aeb8066c09bc70aa1","accountId":"28364","amount":"4754486979517645835"},{"address":"0x29433bEaf2346c46fB0c876c8E987FA980470475","accountId":"28459","amount":"459804470695267987"},{"address":"0x752f6908716cB302c91d296Aa27d52aB271c43ab","accountId":"28519","amount":"82999451447166099504"},{"address":"0x0B4C35F76AF1aCeBF52A8513255aE3fDA2e9D42b","accountId":"28520","amount":"16891320701029687935"},{"address":"0x9dfae56192f5714129cc69639e233dcace94891f","accountId":"28551","amount":"3361988012353572525"},{"address":"0xfE7d9707b58Bf93fB4881c98d374dDdAB8650828","accountId":"28587","amount":"246119745254118493"},{"address":"0xF48907F0d99675e1Fb9a77BC10C21541A8ebB2b9","accountId":"28646","amount":"12384951691996528432"},{"address":"0xbb458971DF539D30ddDac618a5d705e25227f937","accountId":"28647","amount":"160360495043960227915"},{"address":"0xe379B866EC22E3cD1f13E7dF929f4dcA2478d243","accountId":"28648","amount":"42877573404258329874"},{"address":"0x8BF4D2a5256aEA341E96Bb9c3058bD74866cc293","accountId":"28649","amount":"745299317407192181427"},{"address":"0x64cd43f789274dea013acd9527154780a525d4a1","accountId":"28775","amount":"27727342441335184326"},{"address":"0x8120aef321f5464d398094f6e2d03d155c40c6d8","accountId":"28841","amount":"5372316314188143843"},{"address":"0x7b19eb8a4c5f6b66678c2b30faa8e1ac2a3d19dd","accountId":"28895","amount":"1040643699278458634"},{"address":"0x8ed623111f2cbc8842eef8d55523de173ae3b42c","accountId":"28899","amount":"81374403437606128"},{"address":"0xa4be44f47b1f29fa6e416131674869c7df5bd998","accountId":"28913","amount":"7062414077701997571"},{"address":"0xa4ed864d17b6834f693601831915c35df2a10bb3","accountId":"28951","amount":"4903524284780926090"},{"address":"0x4aae361a89b3657410e0140a4656a000441e240c","accountId":"28969","amount":"493853396504115842182"},{"address":"0xc5a215cdbb69231b2e0f70613afdddbfc1e12c2d","accountId":"29074","amount":"16002681195982321802"},{"address":"0xf0c479087ecdd74743235c9f73835b13514757fc","accountId":"29096","amount":"651777002603675333"},{"address":"0xc6643a978d9d8a2f900054ad6db805d801c35dec","accountId":"29144","amount":"1390666946655840340"},{"address":"0xbfbfb2a82aa6f38141da1266f9eb5149c0a024cf","accountId":"29145","amount":"1293823443643636089"},{"address":"0x4b69d0a077a19bd76a41b32d70f71b8c88ba2f0f","accountId":"30480","amount":"65877814684073609619"},{"address":"0xbb1394f4a4ea378350a8a69ad9e68bf0e03f333f","accountId":"30519","amount":"51150906711552612574"},{"address":"0x5599a8d25bdd1c36777322af5be0ac0d84b6a6fc","accountId":"30648","amount":"105438379650103048"},{"address":"0x772227229da53113279327d7f7b104617c7993c9","accountId":"30688","amount":"547359187584571061193"},{"address":"0x60d4dd03fca377816c959ff89033ffc8af4efad2","accountId":"30749","amount":"844284289468775720"},{"address":"0x02f6355c3e8b51ad57a8b5a054bb893473d2936d","accountId":"31080","amount":"1150052001756277660"},{"address":"0x888558882ffb2948ceb20796eec417f637d17771","accountId":"31146","amount":"157610376738960408"},{"address":"0x28eeb8d6dd706a4562320d3d463c939ce8df0906","accountId":"31171","amount":"103913787474775860"},{"address":"0xa23248f61dc4e1bdd5f58e113db68168ba25009b","accountId":"31262","amount":"11807996293403734043"},{"address":"0xa56d705978ccfc5854973a6bdaa704c3bc645478","accountId":"31271","amount":"189934946681261898929"},{"address":"0x1933d796c47a73cf1639bc3a0d88eee20bc8dec8","accountId":"31452","amount":"680443601814963515"},{"address":"0xf9b2e1f44df542fa87b278475f607c0f153e0b2e","accountId":"31500","amount":"791769170764980575501"},{"address":"0x2b76ed6c015a675ef8487b1c751be0260e5b53ce","accountId":"31613","amount":"3729695483189313610"},{"address":"0x76d85f7e056959ab7d0634cb447554c39db09426","accountId":"31729","amount":"643075729823391192785"},{"address":"0xdaf93a6a56aec45f7b23aebd531177cc531133ef","accountId":"31820","amount":"1786687700852216570"},{"address":"0x525dc482960d34a4037fe7441039d751aab2dc0a","accountId":"31847","amount":"3726202612107971979"},{"address":"0xa38d28ab2ce27cf074cc5243614990dd9412e1ce","accountId":"31938","amount":"301618852118787970"},{"address":"0xfccdd60a1b7409186422c8eb5bec15cafbfd15f5","accountId":"32012","amount":"1681572336983773015"},{"address":"0xcba6c4e500adf292e2294945153058c8ac4ecf8d","accountId":"32020","amount":"8158797047658578921"},{"address":"0x8c64a061bfc06869f2fe5975cf597e3e6e14da14","accountId":"32144","amount":"16072775577320642822"},{"address":"0xd75533dfc23c6f1405b8d059a8f453afe625db0a","accountId":"32153","amount":"17189238274027395"},{"address":"0xe5716d6168ef103aef9c815135df3e38ec488716","accountId":"32155","amount":"151391248261388116"},{"address":"0xdbaa0077617fddbed9d165ba2f83690d6634e665","accountId":"32159","amount":"10933125789665598543"},{"address":"0x6734cbf4d0B5FDf92272a4CDa1591042F5Ca9d95","accountId":"32160","amount":"19600465712274835768"},{"address":"0x710364b39b37b55faaf7a6a2299bea1a31aa07e5","accountId":"32172","amount":"1404520892323906607507"},{"address":"0x7cfd8f5be522bf44bbad800b2069c74673081ef1","accountId":"32196","amount":"9670259415116410701"},{"address":"0x77999079448305d5f414da6805cd5751f4444f49","accountId":"32337","amount":"2878377787302796093"},{"address":"0x786442b0d64728221c511fae74d1c4a450a55379","accountId":"32356","amount":"1727660688216648614"},{"address":"0xf16ba0c476e4664a4bb95362d995b46da340b602","accountId":"32415","amount":"110140543078072525"},{"address":"0x9c742e26bb1bb8efe72331aeafdffb190254d0b1","accountId":"32417","amount":"462344866420135089"},{"address":"0x92e0B0083Abca97FFd66FBc1DB2Bf23a2f10Af88","accountId":"32418","amount":"7699437180295083204"},{"address":"0x504afd735d03b6d4b1aabd101bc5fd2b34a17fcc","accountId":"32420","amount":"75471086421704039"},{"address":"0x7d7fea3cea7bfa805006b9ce1a842054b8490052","accountId":"32438","amount":"1718137586506169578"},{"address":"0xa102ea62fa12fcdfcfaddfeab875703e10f520c6","accountId":"32460","amount":"41191262846731652744"},{"address":"0x205530b7328ba64202ab33f89e5b75a2d9bc9580","accountId":"32481","amount":"4883809320799937130"},{"address":"0x13067dc9912f8f82f75a477555cbc171c7502603","accountId":"32500","amount":"257336494124310840"},{"address":"0x2453736aca39cbccab4073fe5fa2969c1e732c12","accountId":"32517","amount":"433842805995973623"}]


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
    memo:"OFFICIAL REWARD:maker reward and referrer reward"
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




