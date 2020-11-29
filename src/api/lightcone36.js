const request = require("../common/request");
const formatter =  require("../common/formatter");

const config = require('../config');
const SERVER_URL = config.getServer36();

async function getAccount(owner) {
    const params = {
        owner,
    };

    const response = await request({
        method: 'GET',
        url: '/api/v2/account',
        params,
        baseURL:SERVER_URL
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
        baseURL:SERVER_URL
    });

    return response['data'];
}

async function getTokens() {
    const data = {};
    const response = await request({
        method: 'GET',
        url: '/api/v2/exchange/tokens',
        baseURL:SERVER_URL,
        data,
    });

    return response['data'].map((token) => {
        token.address = formatter.formatAddress(token.address);
        return token;
    });
}

async function getStorageId(accountId, tokenSId, apiKey) {
    const params = {
        accountId,
        tokenSId,
    };
    const headers = {
        'X-API-KEY': apiKey,
    };
    const response = await request({
        method: 'GET',
        url: '/api/v2/storageId',
        headers: headers,
        params,
    });

    return response['data'];
}

import request from '../common/request';

export async function getAmmMarkets() {
    const data = {};

    const response = await request({
        method: 'GET',
        url: '/api/v2/amm/markets',
        data,
    });

    return response['data'];
}

export async function getAmmSnapshots() {
    const data = {};

    const response = await request({
        method: 'GET',
        url: '/api/v2/amm/snapshots',
        data,
    });

    return response['data'];
}

export async function getAmmSnapshot(poolAddress) {
    const params = {
        poolAddress,
    };

    const response = await request({
        method: 'GET',
        url: '/api/v2/amm/snapshot',
        params,
    });

    console.log('getAmmSnapshot', response);

    return response['data'];
}

export async function getAmmMarketUserFeeRates(accountId, market, apiKey) {
    const params = {
        accountId,
        market,
    };

    const headers = {
        'X-API-KEY': apiKey,
    };

    const response = await request({
        method: 'GET',
        url: '/api/v2/user/feeRates',
        headers,
        params,
    });

    // console.log('getAmmMarketUserFeeRates', response);

    return response['data'];
}

// /api/v2/amm/join
export async function joinAmmPool(data, ecdsaSig, apiKey) {
    const headers = {
        'X-API-KEY': apiKey,
        'X-API-SIG': ecdsaSig + '02',
    };

    const response = await request({
        method: 'POST',
        url: '/api/v2/amm/join',
        headers: headers,
        data: data,
    });

    return response['data'];
}

// /api/v2/amm/exit
export async function exitAmmPool(data, ecdsaSig, apiKey) {
    const headers = {
        'X-API-KEY': apiKey,
        'X-API-SIG': ecdsaSig + '02',
    };

    const response = await request({
        method: 'POST',
        url: '/api/v2/amm/exit',
        headers: headers,
        data: data,
    });

    return response['data'];
}



module.exports = {
    getAccount,
    submitTransfer,
    getTokens,
    getStorageId
};
