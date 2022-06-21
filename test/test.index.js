'use strict';

const { assert } = require('chai');
const { request: makeRequest } = require('../src/');
const nock = require('nock');

const URL = 'http://example.org/';
const STATUS_OK = 200;
const RESPONSE_OK = { ok: true };
const URL_ERROR = 'http://other-example.com';
const RESPONSE_TEXT = 'simple text';

nock(URL)
    .persist()
    .get('/')
    .reply(STATUS_OK, RESPONSE_OK)
    .get('/text')
    .reply(STATUS_OK, RESPONSE_TEXT);

it('is a function', () => {
    assert.isFunction(makeRequest);
});

it('making request', async () => {
    nock.emitter.on('request', function (req) {
        console.log(req);
    });
    await makeRequest(URL);
});

it('making request: get correct JSON body', async () => {
    const response = await makeRequest(URL);
    assert.deepEqual(response.body, RESPONSE_OK);
});
it('making request: get correct text body', async () => {
    const response = await makeRequest(URL + 'text');
    assert.deepEqual(response.body, RESPONSE_TEXT);
});

it('making request: get correct status', async () => {
    const response = await makeRequest(URL);
    assert.deepEqual(response.status, STATUS_OK);
});

it('should returns an error', async () => {
    try {
        await makeRequest(URL_ERROR);
    } catch (err) {
        assert.ok(err);
    }
});
