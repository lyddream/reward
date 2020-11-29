const request = require("../common/request");
const formatter =  require("../common/formatter");

async function getAccount(owner) {
    const params = {
        owner,
    };

    const response = await request({
        method: 'GET',
        url: '/api/v2/account',
        params,
    });

    return response['data'];
}

async function submitTransfer(transfer, apiKey) {
    const headers = {
        'X-API-KEY': apiKey,
    };

    const response = await request({
        method: 'POST',
        url: '/api/v2/reward',
        headers: headers,
        data: transfer,
    });

    return response['data'];
}

async function getTokens() {
    const data = {};
    const response = await request({
        method: 'GET',
        url: '/api/v2/exchange/tokens',
        data,
    });

    return response['data'].map((token) => {
        token.address = formatter.formatAddress(token.address);
        return token;
    });
}

module.exports = {
    getAccount,
    submitTransfer,
    getTokens
};
